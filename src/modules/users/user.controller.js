import {
  getUsers,
  getUserById,
  updateUser,
  suspendUser,
  activateUser,
  deleteUser,
} from "./user.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getOneUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateOneUser = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const suspendOneUser = async (req, res, next) => {
  try {
    const user = await suspendUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const activateOneUser = async (req, res, next) => {
  try {
    const user = await activateUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteOneUser = async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
