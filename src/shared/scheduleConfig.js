export const HORAS_DISPONIBLES = {
  almuerzo: [
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
  ],
  cena: [
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
    "00:30",
  ],
};

const parsedSlotCapacity = Number(process.env.SLOT_CAPACITY);

export const SLOT_CAPACITY =
  Number.isInteger(parsedSlotCapacity) && parsedSlotCapacity > 0
    ? parsedSlotCapacity
    : 20;
