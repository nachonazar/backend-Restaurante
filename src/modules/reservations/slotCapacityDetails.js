import { SLOT_CAPACITY } from "../../shared/scheduleConfig.js";

const formatSlotDate = (date) => new Date(date).toISOString().slice(0, 10);

export const buildSlotCapacityDetails = ({ date, time, used, requested }) => {
  const normalizedUsed = Math.max(Number(used || 0), 0);
  const normalizedRequested = Number(requested);
  return {
    code: "SLOT_CAPACITY_EXCEEDED",
    date: formatSlotDate(date),
    time,
    capacity: SLOT_CAPACITY,
    used: normalizedUsed,
    requested: normalizedRequested,
    remaining: Math.max(SLOT_CAPACITY - normalizedUsed, 0),
  };
};
