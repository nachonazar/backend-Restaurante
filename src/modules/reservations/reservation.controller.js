import Reservation from "./reservation.model.js";

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

export const leerReservaPorId = async (req, res) => {
    try {
        //1- obtener el parametro del request
        //2- pedir a mongoose que encuentre la reserva con tal id
        const reservaBuscada = await Reserva.findById(req.params.id)
        if(!reservaBuscada){
            return res.status(404).json({ mensaje: "Reserva no encontrada"})
        }
        //3-responder al front
        res.status(200).json(reservaBuscada)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: "Error al leer la reserva" })
    }
}

export const borrarReservaPorId = async (req, res) => {
    try {
        //1- buscar la reserva por id y luego borrar
        const reservaEliminada = await Reserva.findByIdAndDelete(req.params.id)
        if(!reservaEliminada){
            return res.status(404).json({ mensaje: "Reserva no encontrada"})
        }
        //2-responder al front
        res.status(200).json({ mensaje: "Reserva borrada exitosamente"})
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: "Error al borrar la reserva"})
    }
}

export const editarReservaPorId = async (req, res) => {
    try {
        //1- buscar la reserva por id y luego editar
        const reservaModificada = await Reserva.findByIdAndUpdate(req.params.id, req.body)
        if(!reservaModificada){
            return res.status(404).json({ mensaje: "Reserva no encontrada"})
        }
        //2- responder al front
        res.status(200).json({ mensaje: "Reserva actualizada exitosamente"})
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: "Error al editar la reserva" })
    }
}