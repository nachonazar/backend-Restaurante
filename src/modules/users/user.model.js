import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      ],
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      match: [/^[0-9+()\-\s]*$/, "Teléfono inválido"],
      default: "",
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Activo", "Suspendido"],
      default: "Activo",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
