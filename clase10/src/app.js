import { engine } from "express-handlebars";
import express from "express";
import { __filename, __dirname } from "./utils.js";
import viewsRoutes from "./routes/views.router.js";
import viewsRealTime from "./routes/realTimeProduct.router.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { guardarProducto } from "./services/productUtils.js";

const app = express();
const httpServer = createServer(app);

const PORT = 8081;

// Configurar el motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

// Configurar el directorio estático para archivos públicos
app.use(express.static("public"));

// Configurar el middleware para manejar las solicitudes JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar las rutas para las vistas
app.use("/", viewsRoutes);
app.use("/realtime", viewsRealTime);

// Iniciar el servidor HTTP
httpServer.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

// Configuración del lado del servidor
const io = new Server(httpServer);

// Configurar el evento de conexión de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Manejar eventos personalizados
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);

    // Enviar una respuesta al cliente
    socket.emit("respuesta", "Mensaje recibido correctamente");
  });

  // Escuchar evento 'agregarProducto' y emitir 'nuevoProductoAgregado'
  socket.on("agregarProducto", (newProduct) => {
    console.log("Nuevo producto recibido backend:", newProduct);
    guardarProducto(newProduct);
    // Agregar el nuevo producto a la lista de productos
    io.emit("nuevoProductoAgregado", newProduct);
  });

  /*socket.on("productoEliminado", (productID) => {
    // Eliminar el producto de la lista en el cliente
    const productoElement = document.querySelector(`[data-id="${productID}"]`);
    if (productoElement) {
      productoElement.parentElement.remove();
    }
  });
  */

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});