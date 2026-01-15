import Usuario from "../models/usuario.js";

export const prueba = (req, res) => {
  res.status(200);
  res.send("Primera prueba desde usuario");
};

export const leerUsuarios = async (req, res) => {
  try {
    //Buscar todos los usuarios de la BD
    const listaUsuarios = await Usuario.find();
    //enviar respuesta
    res.status(200).json(listaUsuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al leer los usuarios" });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    //1- recibir el objeto que tengo que agregar a la BD
    //2- validar los datos del objeto
    //3- guardar el objeto en la BD
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    //4- enviar respuesta
    res.status(201).json({ mensaje: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el usuario" });
  }
};

export const leerUsuariosPorId = async (req, res) => {
  try {
    //1- obtener el parametro del request
    //2- pedir a mongoose que encuentre la reserva con tal id
    const usuarioBuscado = await Usuario.findById(req.params.id);
    if (!usuarioBuscado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    //3- responder al front
    res.status(200).json(usuarioBuscado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener el usuario" });
  }
};

export const borrarUsuariosPorId = async (req, res) => {
  try {
    //1- buscar el usuario por el id y luego borrar
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    //2- responder al front
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al borrar el usuario" });
  }
};

export const editarUsuariosPorId = async (req, res) => {
  try {
    //1- obtener el parametro del request
    //2- pedir a mongoose que encuentre la reserva con tal id
    const usuarioEditado = await Usuario.findByIdAndUpdate(req.params.id, req.body);
    if (!usuarioEditado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    //3- responder al front
    res.status(200).json({ mensaje: "Usuario actualizado correctamente"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al editar el usuario" });
  }
};