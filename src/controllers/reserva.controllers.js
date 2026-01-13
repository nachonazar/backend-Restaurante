export const test = (req, res) => {
  res.status(200);
  res.send("Primera prueba desde el backend");
};

export const leerReservas = (req, res) => {
    try {
               
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: "Error al leer las reservas"})       
    }
}