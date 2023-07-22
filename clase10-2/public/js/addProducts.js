document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(productForm);
        const productData = {};
        formData.forEach((value, key) => {
            productData[key] = value;
        });
        socket.emit('addProduct', productData);
        productForm.reset();
    });
});