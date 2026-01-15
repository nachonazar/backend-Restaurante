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
