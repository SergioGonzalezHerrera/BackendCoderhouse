import { ProductManager } from "./ProductManager.js";
import { __dirname } from "./utils.js";


//const { ProductManager } = productManager;

let myFirstStore = new ProductManager("./products.json");

/*
mySecondStore.addProduct(
    "producto prueba",
    "Este es un producto de prueba",
    200,
    "sin imagen",
    "abc1c3aaaa" + Math.floor(Math.random() * (100 - 1) + 1),
    25
);
//agregamos un duplicado este evento generara un error
myFirstStore.addProduct(
    "producto prueba",
    "Este es un producto de prueba",
    200,
    "sin imagen",
    "abc127",
    25
);
myFirstStore.addProduct(
    "Pelota",
    "De futbol",
    9.99,
    "http://imagen.jgp",
    "123c",
    23
);
*/

/*mySecondStore.getProducts().then((data) => console.log("get products", data));
mySecondStore
  .getProduct("34fb15d2-30eb-4585-b92b-6975064a3e4f")
  .then((data) => console.log("get product by id", data));
mySecondStore
  .updateProduct("0d7f53fb-b2d1-4f13-813e-d1601b9b4a55", {
    title: "pizza con piña",
    description: "pizza con description ",
    price: 400,
    thumbnail: "fotito.jpg",
    code: "pizzapizza",
  })
  .then((data) => console.log("resultado", data));
*/
mySecondStore
    .deleteProduct("34fb15d2-30eb-4585-b92b-6975064a3e4f")
    .then((data) => console.log("el resultado de la eliminacion es:", data));
//console.log("desde getProducts", myFirstStore.getProducts(1));

//console.log("mi producto filtrado  por id", myFirstPRoducts.getProduct(2)); // ok
//console.log("mi producto filtrado  por id", myFirstPRoducts.getProduct(5)); // error