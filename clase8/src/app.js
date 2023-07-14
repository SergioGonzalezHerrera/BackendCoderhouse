import express from "express"
import productRouter from "./router/products.routes.js"


const app = express();
const PORT = 8080;



app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hola Mundo")
})

app.use("/api/products", productRouter)

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT)
})