import express from "express"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import * as dotenv from 'dotenv' 
import productsRouter from "./routes/products.router.js"
import cors from "cors";
// import viewsRouter from "./routes/views.router.js";
// import usersRouter from "./routes/users.router.js";
// import coursesRouter from "./routes/courses.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;
const connection = mongoose.connect(MONGO_URL);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use("/", viewsRouter);
app.use("/api/products", productsRouter);

// app.use("/api/users", usersRouter);
// app.use("/api/courses", coursesRouter);

const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));