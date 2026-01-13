import mongoose, { Schema } from "mongoose";

const reservaSchema = new Schema({
  nombreCompleto: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    trim: true,
    default: null,
    lowercase: true,
    match: [
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    ],
  },
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/],
  },
  personas: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  estado: {
    type: String,
    enum: ["Pendiente", "Confirmada", "Cancelada"],
    default: "Pendiente",
  },
});

const Reserva = mongoose.model("reserva", reservaSchema);

export default Reserva;
