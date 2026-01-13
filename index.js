import Server from "./server/config.js";
import router from "./src/routes/index.routes.js";

const server = new Server();

//agregar las rutas
server.app.use("/api", router);

server.listen();
