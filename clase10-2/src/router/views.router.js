import { Router } from "express"
import { ProductManager } from "../classes/ProductManager.js"
import path from 'path';

const router = Router()
const productManager = new ProductManager("../src/products.json")
let products = []

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get("/", async (req, res) => {
    const { limit } = req.query
    try {
        let response = await productManager.getProducts()
        if (limit) {
            let tempArray = response.filter((dat, index) => index < limit)
            res.json({ data: tempArray, limit: limit, quantity: tempArray.length })
        } else {
            res.json({ data: response, limit: false, quantity: response.length })
        }
    } catch (err) {
        console.log(err)
    }
})

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    let product = await productManager.getProduct(parseInt(pid))
    if (product) {
        res.json({ message: "success", data: product })
    } else {
        res.json({
            message: "El producto solicitado no existe",
        });
    }
})

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body
    const product = {}
    if (!title || !description || !code || !price || !stock || !category) {
        res.json({ message: "faltan datos" });
    } else {
        product.title = title;
        product.description = description;
        product.code = code;
        product.price = price;
        product.status = !status || typeof status !== "boolean" ? true : status;
        product.stock = stock;
        product.category = category;
        product.thumbnail = !thumbnail ? "" : thumbnail;

        try {
            const response = await productManager.addProduct(product);
            res.json({
                message: "Producto agregado correctamente",
                data: response,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error interno del servidor",
            });
        }
    }
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    const productTemp = {};
    let product = await productManager.getProduct(pid);

    if (product) {
        if (
            (!title, !description,!code,!price,!status,!stock,!category,!thumbnail)
        ) {
            res.json({ message: "faltan datos" });
        }
        productTemp.title = title;
        productTemp.description = description;
        productTemp.code = code;
        productTemp.price = price;
        productTemp.status = status;
        productTemp.stock = stock;
        productTemp.category = category;
        productTemp.thumbnail = thumbnail;
        let result = await productManager.updateProduct(
            parseInt(pid),
            productTemp
        );

        res.json({ message: "Producto actualizado correctamente", data: result });
    } else {
        res.json({
            message: "No ha sido posible encontrar ese preducto",
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    let product = await productManager.getProduct(pid);
    if (!product) {
        res.json({
            message: "el producto solicitado no existe, no se puede eliminar",
        });
    } else {
        let result = await productManager.deleteProduct(parseInt(pid));
        res.json({ message: "producto eliminado", data: result });
    }
});

export default router