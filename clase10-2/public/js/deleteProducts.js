document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const productList = document.getElementById('productList');
    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('btnEliminar')) {
            const productId = event.target.dataset.id;
            socket.emit('deleteProduct', productId);
        }
    });
});