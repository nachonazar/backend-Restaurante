import "dotenv/config";
import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
  console.info(`Servidor corriendo en http://localhost:${PORT}`);
});