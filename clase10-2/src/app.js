import express from "express";
import exphbs, { engine } from 'express-handlebars';
import productRouter from "./router/products.routes.js";
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import fs from 'fs/promises';
import { ProductManager } from './classes/ProductManager.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = 8080;

// Obtener la ruta actual del archivo "app.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar Handlebars como el motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Ruta para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

app.use(express.json());

// Crear una instancia de ProductManager con la ruta del archivo "products.json"
const productsFilePath = path.join(__dirname, 'products.json');
const productManager = new ProductManager(productsFilePath);

console.log('__dirname:', __dirname);
console.log('productsFilePath:', productsFilePath);

// Ruta principal
app.get("/", async (req, res) => {
    try {
        // Obtener la lista de productos utilizando el método getProducts del ProductManager
        const productos = await productManager.getProducts();

        // Pasar los datos a la vista "home.handlebars"
        res.render('home', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.use("/api/products", productRouter)

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT)
})

// Crear un servidor HTTP usando Express
const server = http.createServer(app);

// Crear una instancia de Socket.IO vinculada al servidor HTTP
const io = new SocketIOServer(server);

// Evento que se dispara cuando un cliente se conecta al servidor Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado al servidor de Socket.IO');

});

