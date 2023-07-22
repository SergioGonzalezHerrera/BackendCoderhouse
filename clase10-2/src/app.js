import express from "express";
import { engine } from 'express-handlebars';
import productRouter from "./router/products.routes.js";
import path from 'path';
import { Server } from 'socket.io';
import { ProductManager } from './classes/ProductManager.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import viewsRouter from "./router/views.router.js";
import { createServer } from "http";

const app = express();
const PORT = 8080;
const httpServer = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productManager = new ProductManager("../src/products.json")

// Configurar Handlebars como el motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Ruta para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

app.use(express.json());


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
app.use('/', viewsRouter);

// Iniciar el servidor HTTP
httpServer.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

// Configuración del lado del servidor
const io = new Server(httpServer);

// Evento que se dispara cuando un cliente se conecta al servidor Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado al servidor de Socket.IO');


    socket.on('addProduct', async (productData) => {
        try {
            await productManager.addProduct(productData);
            io.emit('updateProducts');
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            io.emit('updateProducts');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });


});

app.post("/realtimeproducts", async (req, res) => {
    try {
        const { name, title, description, price, thumbnail, code, stock } = req.body;
        const newProduct = {
            name,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        await productManager.addProduct(newProduct);
        io.emit("productAdded", newProduct);
        res.redirect("/realtimeproducts");
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).send("Error al agregar el producto");
    }
});