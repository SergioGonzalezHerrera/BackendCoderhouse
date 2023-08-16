import express from "express"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import * as dotenv from 'dotenv'
import productsRouter from "./routes/products.router.js"
import cors from "cors";
import viewsRoutes from "./routes/views.router.js";
import viewsRealTime from "./routes/realTimeProduct.router.js";
import { guardarProducto } from "./routes/services/productUtils.js"
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;
const connection = mongoose.connect(MONGO_URL);
const httpServer = createServer(app);
const PORT2=3030;


app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/", viewsRoutes);
app.use("/realtime", viewsRealTime);


const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

// Iniciar el servidor HTTP
httpServer.listen(PORT2, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT2}`);
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