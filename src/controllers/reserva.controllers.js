import Reserva from "../models/reserva.js";

export const test = (req, res) => {
  res.status(200);
  res.send("Primera prueba desde el backend");
};

export const leerReservas = async (req, res) => {
    try {
        //1- Buscar todas las reservas en la BD
        const listaReservas = await Reserva.find()
        //2- enviar la respuesta al front
        res.status(200).json(listaReservas) 
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: "Error al leer las reservas"})       
    }
}

export const crearReserva = async (req, res) => {
    try {
        //1- recibir el objeto que tengo que agregar a la BD
        //2- validar los datos del objeto
        //3- guardar el objeto en la BD
        const nuevaReserva = new Reserva(req.body)
        await nuevaReserva.save()
        //4- enviar respuesta
        res.status(201).json({ mensaje: "Reserva creada exitosamente" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: "Error al crear la reserva"})    
    }
}