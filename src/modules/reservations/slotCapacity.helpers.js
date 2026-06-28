import { SLOT_CAPACITY } from "../../shared/scheduleConfig.js";

export const normalizeSlotDate = (date) => new Date(date);

export const formatSlotDate = (date) => normalizeSlotDate(date).toISOString().slice(0, 10);

export const buildSlotCapacityCounterQuery = ({ date, time, requested }) => ({
  date: normalizeSlotDate(date),
  time,
  used: { $lte: SLOT_CAPACITY - Number(requested) },
});

export const applySlotCapacityIncrement = ({ used, requested }) => {
  const normalizedUsed = Number(used || 0);
  const normalizedRequested = Number(requested);

  if (normalizedRequested > SLOT_CAPACITY - normalizedUsed) {
    return { accepted: false, used: normalizedUsed };
  }

  return { accepted: true, used: normalizedUsed + normalizedRequested };
};

export const applySlotCapacityRelease = ({ used, release }) => ({
  used: Math.max(Number(used || 0) - Number(release || 0), 0),
});

export const buildEffectiveReservationValues = (current, data) => ({
  date: data.date ?? current.date,
  time: data.time ?? current.time,
  pax: data.pax ?? current.pax,
  status: data.status ?? current.status,
});

export const buildUpdateCapacityPlan = (current, effective) => {
  const currentConsumesCapacity = current.status !== "Cancelada";
  const nextConsumesCapacity = effective.status !== "Cancelada";
  const sameSlot =
    formatSlotDate(current.date) === formatSlotDate(effective.date) &&
    current.time === effective.time;

  if (currentConsumesCapacity && nextConsumesCapacity && sameSlot) {
    const delta = Number(effective.pax) - Number(current.pax);
    if (delta > 0) {
      return {
        reserve: { date: effective.date, time: effective.time, pax: delta },
        release: null,
      };
    }
    if (delta < 0) {
      return {
        reserve: null,
        release: { date: current.date, time: current.time, pax: Math.abs(delta) },
      };
    }
    return { reserve: null, release: null };
  }

  return {
    reserve: nextConsumesCapacity
      ? { date: effective.date, time: effective.time, pax: effective.pax }
      : null,
    release: currentConsumesCapacity
      ? { date: current.date, time: current.time, pax: current.pax }
      : null,
  };
};
