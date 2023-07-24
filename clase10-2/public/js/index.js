const socket = io();

socket.emit("connection", "nuevo cliente conectado");

const form = document.getElementById("productForm")
form.addEventListener("submit", (e) => {
    e.preventDefault()

    const productName = document.getElementById("productName");
    const productTitle = document.getElementById("productTitle");
    const productDescription = document.getElementById("productDescription");
    const productPrice = document.getElementById("productPrice");
    const productThumbnail = document.getElementById("productThumbnail");
    const productCode = document.getElementById("productCode");
    const productStock = document.getElementById("productStock");
    const product = {
        name: productName.value,
        title: productTitle.value,
        description: productDescription.value,
        price: productPrice.value,
        thumbnail: productThumbnail.value,
        code: productCode.value,
        stock: productStock.value

    }


    socket.emit("agregarProducto", product);

    productName.value = ""
    productTitle.value = ""
    productDescription.value = ""
    productPrice.value = ""
    productThumbnail.value = ""
    productCode.value = ""
    productStock.value = ""

    location.reload()

});


const deleteButton = document.querySelectorAll(".deleteButton")
deleteButton.forEach(button => {
    button.addEventListener("click", () => {
        const id = parseInt(button.id)
        const productId = {
            id: id
        }

        socket.emit("Producto eliminado", productId)
        location.reload()
    })
})