import express from "express";

//inicializamos el servidor express
const app =express()

//creamos la ruta/endpoint
app.get("/", (req, res) => {
    //res.send nos enviará un objeto html
    res.send("Hola mundo")
})
//creamos la ruta/endpoint saludo
app.get("/saludo", (req, res) =>{
    res.send("Probando el saludo 2")
})
//creamos la ruta/endpoint bienvenida
app.get("/bienvenida", (req, res) =>{
    res.send('<h1 style="color:blue">Hola alumnos de CoderHouse</h1>')
})
//creamos la ruta/endpoint usuario
app.get("/usuario", (req, res) =>{
    //creamos un usuario
    let usuario= {
        nombre:"Sergio",
        apellido:"González",
        edad:31
    }
    //aquí en vez de res.send usamos res.json
    res.json(usuario)
})
//configuramos express para que escuche en el puerto 8080
app.listen(8080,()=>{
    console.log("Servidor escuchando en el puerto 8080")
})