import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.info(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;