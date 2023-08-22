import express from "express";
import * as dotenv from "dotenv";
import __dirname from "./utils.js";
import exphbs from "express-handlebars";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import realTimeProductsRouter from "./routes/realTimeProducts.routes.js";
import messagesRouter from "./routes/messages.routes.js";

import { Server } from "socket.io";

import { addProduct, deleteProduct } from "./dao/dbManagers/productManager.js";
import { addMessages, getMessages } from "./dao/dbManagers/messageManager.js";

import mongoose from "mongoose";

import cookierParser from "cookie-parser";
import session from "express-session";

// import FileStore from "session-file-store";

import MongoStore from "connect-mongo";

import LoginRoute from "./routes/login.routes.js";
import SignupRoute from "./routes/signup.routes.js";
import SessionRoute from "./routes/session.routes.js";

//instancio dotenv
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

/* ver porque no me toma la variable de entorno. */
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://sghdevelop:coderhouse@cluster0.y5vbeov.mongodb.net/ecommerce";

/* conexion a la BBDD de MongoDB */
let dbConnect = mongoose.connect(MONGO_URI);
dbConnect.then(() => {
  console.log("conexion a la base de datos exitosa");
}),
  (error) => {
    console.log("Error en la conexion a la base de datos", error);
  };

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* config para usar handlebars */

// Configuración del motor de plantillas Handlebars
const hbs = exphbs.create(); // Creamos el motor de plantillas

// Registro del helper "prop" en el motor de plantillas para poder renderizar las propiedades de los objetos.
hbs.handlebars.registerHelper("prop", function (obj, key) {
  return obj[key];
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

/* Routes */
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/messages", messagesRouter);

//comenzamos a trabajar con sockets.
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente se ha conectado");

  //socket on escucha
  socket.on("message", (data) => {
    console.log(data);
  });

  //socket emit envia
  socket.emit("render", "Me estoy comunicando desde el servidor");

  socket.on("addProduct", (product) => {
    addProduct(product); // fn que agrega el producto creado en el form a la BBDD
  });

  socket.on("delete-product", (productId) => {
    const { id } = productId;
    deleteProduct(id); // fn que deletea el producto de la BBDD
  });

  socket.on("user-message", (obj) => {
    addMessages(obj);
    socketServer.emit("new-message", obj) //enviar el mensaje a todos los usuarios conectados
  });
});

//COOKIES Y SESSION

app.use(cookierParser("C0d3rS3cr3t"));

// app.use(
//   session({
//     secret: "codersecret",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

function auth(req, res, next) {
  if (req.session?.user === "pepe" && req.session?.admin) {
    return next();
  }
  return res.status(401).json("error de autenticacion");
}
//*****cookiess */
app.get("/cookies", (req, res) => {
  res.render("cookies", {});
});
app.get("/login", (req, res) => {
  res.render("login", {});
});
app.get("/setCookie", (req, res) => {
  const { name, lastname } = req.query;
  //guardamos una cookie
  res
    .cookie(
      "CoderCookie",
      JSON.stringify({
        nombre: name,
        apellido: lastname,
      }),
      {
        maxAge: 30000,
        signed: true,
      }
    )
    .send("Cookie");
});

app.get("/getCookies", (req, res) => {
  //obtenemos las cookies del sitio
  // cookier sin firmar
  //res.send(req.cookies);
  //cookies firmadas
  res.send(req.signedCookies);
});
app.get("/deleteCookies", (req, res) => {
  //obtenemos las cookies del sitio
  res.clearCookie("CoderCookie").send("Se  elimino la cookie");
});

//*****session */
app.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
  } else {
    req.session.counter = 1;
    res.send(`Bienvenido,es su primera vez por aca`);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.send("Logout ok!");
    } else {
      res.json({
        status: "Error al cerrar sesion",
        body: err,
      });
    }
  });
});
app.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  if (username !== "pepe" || password !== "pepepass")
    return res.status(401).json({
      respuesta: "error",
    });

  req.session.user = username;
  req.session.admin = true;
  res.status(200).json({
    respuesta: "ok",
  });
});

app.get("/privado", auth, (req, res) => {
  res.render("topsecret", {});
});

//*****session */
//******** session con filestorage */

//const fileStorage = FileStore(session);

/*
app.use(

  session({
    store: new fileStorage({
      path: "./sessions",
      ttl: 100,
      retries: 0,
    }),
    secret: "codersecret",
    resave: true,
    saveUninitialized: true,
  })
);
*/
//******** session con filestorage */

//******** session con mongodb */
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 30,
    }),
    secret: "codersecret",
    resave: false,
    saveUninitialized: false,
  })
);
//******** session con mongodb */

app.use("/login", LoginRoute);
app.use("/signup", SignupRoute);
app.use("/api/session/", SessionRoute);