import mongoose, { Schema } from "mongoose";

const slotCapacitySchema = new Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    used: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

slotCapacitySchema.index({ date: 1, time: 1 }, { unique: true });

const SlotCapacity = mongoose.model("SlotCapacity", slotCapacitySchema);

export default SlotCapacity;
