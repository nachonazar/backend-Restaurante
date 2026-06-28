import Reservation from "./reservation.model.js";
import SlotCapacity from "./slotCapacity.model.js";
import AppError from "../../shared/AppError.js";
import { HORAS_DISPONIBLES, SLOT_CAPACITY } from "../../shared/scheduleConfig.js";
import { buildSlotCapacityDetails } from "./slotCapacityDetails.js";
import {
  buildEffectiveReservationValues,
  buildSlotCapacityCounterQuery,
  buildUpdateCapacityPlan,
  normalizeSlotDate,
} from "./slotCapacity.helpers.js";

const throwSlotCapacityExceeded = ({ date, time, used, requested }) => {
  throw new AppError(
    "Slot capacity exceeded",
    409,
    buildSlotCapacityDetails({ date, time, used, requested }),
  );
};

const getReservationSlotUsage = async ({ date, time }) => {
  const [usage] = await Reservation.aggregate([
    {
      $match: {
        date: normalizeSlotDate(date),
        time,
        status: { $ne: "Cancelada" },
      },
    },
    { $group: { _id: null, used: { $sum: "$pax" } } },
  ]);

  return Number(usage?.used || 0);
};

const getSlotCounterUsage = async ({ date, time }) => {
  const counter = await SlotCapacity.findOne({
    date: normalizeSlotDate(date),
    time,
  }).select("used");

  return Number(counter?.used || 0);
};

const getSlotUsage = async ({ date, time }) => {
  const [reservationUsage, counterUsage] = await Promise.all([
    getReservationSlotUsage({ date, time }),
    getSlotCounterUsage({ date, time }),
  ]);

  return Math.max(reservationUsage, counterUsage);
};

const ensureSlotCounterInitialized = async ({ date, time }) => {
  const slotDate = normalizeSlotDate(date);
  const used = await getReservationSlotUsage({ date: slotDate, time });

  try {
    await SlotCapacity.updateOne(
      { date: slotDate, time },
      {
        $setOnInsert: { date: slotDate, time },
        $max: { used },
      },
      { upsert: true },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    await SlotCapacity.updateOne(
      { date: slotDate, time },
      { $max: { used } },
    );
  }
};

const reserveSlotCapacity = async ({ date, time, pax }) => {
  const requested = Number(pax);
  const slotDate = normalizeSlotDate(date);

  if (requested > SLOT_CAPACITY) {
    throwSlotCapacityExceeded({ date: slotDate, time, used: 0, requested });
  }

  await ensureSlotCounterInitialized({ date: slotDate, time });

  const counter = await SlotCapacity.findOneAndUpdate(
    buildSlotCapacityCounterQuery({ date: slotDate, time, requested }),
    { $inc: { used: requested } },
    { new: true },
  );

  if (!counter) {
    const used = await getSlotUsage({ date: slotDate, time });
    throwSlotCapacityExceeded({ date: slotDate, time, used, requested });
  }
};

const releaseSlotCapacity = async ({ date, time, pax }) => {
  const release = Number(pax || 0);
  if (release <= 0) return;

  await SlotCapacity.updateOne(
    { date: normalizeSlotDate(date), time },
    { $inc: { used: -release } },
  );

  await SlotCapacity.updateOne(
    { date: normalizeSlotDate(date), time, used: { $lt: 0 } },
    { $set: { used: 0 } },
  );
};

export const validateSlotCapacity = async ({ date, time, pax, excludeId = null }) => {
  const requested = Number(pax);
  const slotDate = normalizeSlotDate(date);
  const query = {
    date: slotDate,
    time,
    status: { $ne: "Cancelada" },
  };
  if (excludeId) query._id = { $ne: excludeId };

  const reservations = await Reservation.find(query).select("pax");
  const used = reservations.reduce((total, reservation) => {
    return total + Number(reservation.pax || 0);
  }, 0);
  const counterUsed = excludeId ? 0 : await getSlotCounterUsage({ date: slotDate, time });
  const effectiveUsed = Math.max(used, counterUsed);
  const remaining = Math.max(SLOT_CAPACITY - effectiveUsed, 0);

  if (requested > remaining) {
    throwSlotCapacityExceeded({ date: slotDate, time, used: effectiveUsed, requested });
  }
};

export const getReservations = async (userId, role) => {
  const query = role === "Admin" ? {} : { userId };
  return await Reservation.find(query);
};

export const getReservationsById = async (id) => {
  const reserva = await Reservation.findById(id);
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  return reserva;
};

export const createReservation = async (data) => {
  const consumesCapacity = (data.status || "Pendiente") !== "Cancelada";

  if (consumesCapacity) {
    await reserveSlotCapacity({
      date: data.date,
      time: data.time,
      pax: data.pax,
    });
  }

  try {
    const reserva = new Reservation(data);
    return await reserva.save();
  } catch (error) {
    if (consumesCapacity) {
      await releaseSlotCapacity({
        date: data.date,
        time: data.time,
        pax: data.pax,
      });
    }
    throw error;
  }
};

export const updateReservation = async (id, data) => {
  const current = await Reservation.findById(id);
  if (!current) throw new AppError("Reserva no encontrada", 404);

  const effective = buildEffectiveReservationValues(current, data);
  const capacityPlan = buildUpdateCapacityPlan(current, effective);

  let reservedCapacity = capacityPlan.reserve;
  const releasedCapacity = capacityPlan.release;

  if (reservedCapacity) {
    await reserveSlotCapacity(reservedCapacity);
  }

  try {
    const reserva = await Reservation.findByIdAndUpdate(id, data, { new: true });
    if (releasedCapacity) {
      await releaseSlotCapacity(releasedCapacity);
    }
    return reserva;
  } catch (error) {
    if (reservedCapacity) {
      await releaseSlotCapacity(reservedCapacity);
    }
    throw error;
  }
};

export const deleteReservation = async (id) => {
  const reserva = await Reservation.findByIdAndDelete(id);
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  if (reserva.status !== "Cancelada") {
    await releaseSlotCapacity({
      date: reserva.date,
      time: reserva.time,
      pax: reserva.pax,
    });
  }
  return true;
};

export const getAvailableSlots = async (date) => {
  const slotDate = normalizeSlotDate(date);
  const [reservasDelDia, countersDelDia] = await Promise.all([
    Reservation.find({
      date: slotDate,
      status: { $ne: "Cancelada" },
    }),
    SlotCapacity.find({ date: slotDate }),
  ]);

  const usedByTime = reservasDelDia.reduce((acc, reservation) => {
    acc[reservation.time] = (acc[reservation.time] || 0) + Number(reservation.pax || 0);
    return acc;
  }, {});

  countersDelDia.forEach((counter) => {
    usedByTime[counter.time] = Math.max(
      usedByTime[counter.time] || 0,
      Number(counter.used || 0),
    );
  });

  const hasRemainingCapacity = (time) => (usedByTime[time] || 0) < SLOT_CAPACITY;

  return {
    almuerzo: HORAS_DISPONIBLES.almuerzo.filter(hasRemainingCapacity),
    cena: HORAS_DISPONIBLES.cena.filter(hasRemainingCapacity),
  };
};

export const getMyReservations = async (userId) => {
  return await Reservation.find({ userId });
};

export const cancelReservation = async (id, userId, role) => {
  const reserva = await Reservation.findById(id);
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  if (role !== "Admin" && reserva.userId.toString() !== userId)
    throw new AppError("No autorizado", 403);
  const wasConsumingCapacity = reserva.status !== "Cancelada";
  reserva.status = "Cancelada";
  const updated = await reserva.save();
  if (wasConsumingCapacity) {
    await releaseSlotCapacity({ date: updated.date, time: updated.time, pax: updated.pax });
  }
  return updated;
};

export const updateReservationStatus = async (id, status) => {
  const current = await Reservation.findById(id);
  if (!current) throw new AppError("Reserva no encontrada", 404);

  const currentConsumesCapacity = current.status !== "Cancelada";
  const nextConsumesCapacity = status !== "Cancelada";

  if (!currentConsumesCapacity && nextConsumesCapacity) {
    await reserveSlotCapacity({ date: current.date, time: current.time, pax: current.pax });
  }

  try {
    const reserva = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (currentConsumesCapacity && !nextConsumesCapacity) {
      await releaseSlotCapacity({ date: current.date, time: current.time, pax: current.pax });
    }
    return reserva;
  } catch (error) {
    if (!currentConsumesCapacity && nextConsumesCapacity) {
      await releaseSlotCapacity({ date: current.date, time: current.time, pax: current.pax });
    }
    throw error;
  }
};

export const getStats = async () => {
  const [total, confirmed, pending, canceled] = await Promise.all([
    Reservation.countDocuments(),
    Reservation.countDocuments({ status: "Confirmada" }),
    Reservation.countDocuments({ status: "Pendiente" }),
    Reservation.countDocuments({ status: "Cancelada" }),
  ]);

  return { total, confirmed, pending, canceled };
};

export const getTrend = async (period) => {
  let groupBy;

  if (period === "day") {
    groupBy = { $hour: "$date" };
  } else if (period === "month") {
    groupBy = { $week: "$date" };
  } else {
    groupBy = { $month: "$date" };
  }

  return await Reservation.aggregate([
    { $group: { _id: groupBy, value: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { name: "$_id", value: 1, _id: 0 } },
  ]);
};

export const getPeakHours = async () => {
  return await Reservation.aggregate([
    { $group: { _id: "$time", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $project: { hour: "$_id", total: 1, _id: 0 } },
  ]);
};
