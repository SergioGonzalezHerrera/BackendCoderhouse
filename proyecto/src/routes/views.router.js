import { Router } from "express";
import  __dirname  from "../utils.js";
import { obtenerListaDeProductos } from "./services/productUtils.js";

const router = Router();

const productRouter = Router();

productRouter.get("/", (req, res) => {
    const products = obtenerListaDeProductos();

    res.render("home", { products });
});

router.get('/courses', async (req, res) => {
    let courses = await coursesManager.getAll();
    console.log(courses);
    res.render('courses', { courses })
})


export default router;