import mongoose, { Schema } from "mongoose";
import { SLOT_CAPACITY } from "../../shared/scheduleConfig.js";

const reservationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientName: { type: String, required: true, trim: true },
  email:      { type: String, trim: true, lowercase: true },
  date:       { type: Date, required: true },
  time:       { type: String, required: true },
  pax:        { type: Number, required: true, min: 1, max: SLOT_CAPACITY },
  status: {
    type: String,
    enum: ["Pendiente", "Confirmada", "Cancelada"],
    default: "Pendiente",
  },
}, { timestamps: true });

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
