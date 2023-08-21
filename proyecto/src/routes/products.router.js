import { Router } from "express";
import Products from "../dao/dbManagers/products.js";
const router = Router();
const products = new Products();

router.get("/productos", async (req, res) => {
        const productos = await products.getAll();
        res.render('products', { productos });
});

router.get("/", async (req, res) => {
    try {
        const respuesta = await products.getAll();
        res.json({ message: "Aqui se mostrarán los productos:", data: respuesta });
    } catch (err) {
        res.json({ message: "algo  ha pasado revisa los datos por favor." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const respuesta = await products.getById(id);
        respuesta
            ? res.json({ message: "Encontramos este producto", data: respuesta })
            : res.json({
                message: "El producto solicitado no existe",
                data: respuesta,
            });
    } catch (err) {
        res.json({ message: "ID NO ENCONTRADO" });
    }
});
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const respuesta = await products.save(data);
        res.json({ message: "Hemos creado un producto", data: respuesta });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "algo ha pasado", error: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const respuesta = await products.update(id, data);
        res.json({ message: "Hemos modificado un producto", data: respuesta });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "algo ha pasado", error: err });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const respuesta = await products.delete(id);
        res.json({ message: "Hemos eliminado un producto", data: respuesta });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "algo ha pasado", error: err });
    }
});
export default router;