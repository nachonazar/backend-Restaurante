import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import AppError from "../../shared/AppError.js";

export const registerService = async ({ username, email, password }) => {
  // 1. Verificar si el email ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("El email ya está registrado", 409);
  }

  // 2. Verificar si el username ya existe
  const existingUsername = await User.findOne({ userName: username });
  if (existingUsername) {
    throw new AppError("El nombre de usuario ya está en uso", 409);
  }

  // 3. Primer usuario registrado = Admin, el resto = User
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? "Admin" : "User";

  // 4. Hashear password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Crear usuario
  const user = await User.create({
    userName: username,
    email,
    password: hashedPassword,
    role,
  });

  // 6. Generar token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      userName: user.userName,
      role: user.role,
    },
  };
};

export const loginService = async ({ username, password }) => {
  // 1. Buscar por userName O por email
  const user = await User.findOne({
    $or: [{ userName: username }, { email: username }],
  });

  if (!user) {
    throw new AppError("Usuario o contraseña incorrectos", 401);
  }

  // 2. Verificar si está suspendido
  if (user.status === "Suspendido") {
    throw new AppError(
      "Tu cuenta fue suspendida. Contactá al administrador",
      403,
    );
  }

  // 3. Comparar password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Usuario o contraseña incorrectos", 401);
  }

  // 4. Generar token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      userName: user.userName,
      role: user.role,
    },
  };
};
