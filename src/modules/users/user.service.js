import User from "./user.model.js";
import AppError from "../../shared/AppError.js";

export const getUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new AppError("Usuario no encontrado", 404);
  return user;
};

export const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true }).select(
    "-password",
  );
  if (!user) throw new AppError("Usuario no encontrado", 404);
  return user;
};

export const suspendUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { status: "Suspendido" },
    { new: true },
  ).select("-password");
  if (!user) throw new AppError("Usuario no encontrado", 404);
  return user;
};

export const activateUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { status: "Activo" },
    { new: true },
  ).select("-password");
  if (!user) throw new AppError("Usuario no encontrado", 404);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("Usuario no encontrado", 404);
  return true;
};
