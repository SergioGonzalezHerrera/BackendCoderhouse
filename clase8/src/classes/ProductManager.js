import utils from "../utils.js";

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }
    async addProduct(product) {
        const {title, description, price, thumbnail, code, stock} = product
        if (
            title == undefined ||
            description == undefined ||
            price == undefined ||
            code == undefined ||
            stock == undefined
        ) {
            throw new Error("Todos los campos son obligatorios");
        }
        try {
            let data = await utils.readFile(this.path);
            this.products = data?.length > 0 ? data : [];
        } catch (error) {
            console.log(error);
        }

        let codeExists = this.products.some((dato) => dato.code == code);

        if (codeExists) {
            throw new Error("El código ya existe por favor verifique");
        } else {
            let data = await utils.readFile(this.path);
            const newProduct = {
                id: data?.length ? data.length + 1 : 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };
            this.products.push(newProduct);
            try {
                await utils.writeFile(this.path, products);
            } catch (error) {
                console.log(error);
            }
        }

    }
    async getProducts() {
        try {
            let data = await utils.readFile(this.path);
            this.products = data;
            return data?.length > 0 ? this.products : "Aun no hay registros";
        } catch (error) {
            console.log(error);
        }
    }
    async getProduct(id) {
        try {
            let data = await utils.readFile(this.path);
            this.products = data?.length > 0 ? data : [];
            let product = this.products.find((dato) => dato.id === id);

            if (product !== undefined) {
                return product;
            } else {
                return "No existe el producto solicitado";
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, data) {
        try {
            let products = await utils.readFile(this.path);
            this.products = products?.length > 0 ? products : [];

            let productIndex = this.products.findIndex((dato) => dato.id === id);
            if (productIndex !== -1) {
                this.products[productIndex] = {
                    ...this.products[productIndex],
                    ...data,
                };
                await utils.writeFile(this.path, products);
                return {
                    mensaje: "producto actualizado",
                    producto: this.products[productIndex],
                };
            } else {
                return { mensaje: "no existe el producto solicitado" };
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await utils.readFile(this.path);
            this.products = products?.length > 0 ? products : [];
            let productIndex = this.products.findIndex((dato) => dato.id === id);
            if (productIndex !== -1) {
                let product = this.products[productIndex];
                this.products.splice(productIndex, 1);
                await utils.writeFile(this.path, products);
                return { mensaje: "producto eliminado", producto: this.product };
            } else {
                return { mensaje: "no existe el producto solicitado" };
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default {
    ProductManager,
};
