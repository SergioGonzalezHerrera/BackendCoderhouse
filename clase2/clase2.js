class ProductManager {
    constructor() {
        this.products = [];
        this.lastProductId = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        // Validar que no se repita el campo "code"
        const existingProduct = this.products.find((product) => product.code === code);
        if (existingProduct) {
            console.log("El código del producto ya existe.");
            return;
        }

        // Crear un nuevo producto con id autoincrementable
        const newProduct = {
            id: ++this.lastProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        // Agregar el nuevo producto al arreglo de productos
        this.products.push(newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (!product) {
            console.log("Producto no encontrado.");
        }
        return product;
    }
}

const manager = new ProductManager();

manager.addProduct("Producto 1", "Descripción del producto 1", 9.99, "imagen1.jpg", "ABC123", 10);
manager.addProduct("Producto 2", "Descripción del producto 2", 19.99, "imagen2.jpg", "DEF456", 5);

console.log(manager.getProducts());
console.log(manager.getProductById(1));
console.log(manager.getProductById(3));