const productName = 'Горный велосипед Trek Marlin 5';
const store = window.veloData;
const addBtn = document.getElementById('addToCartBtn');
const buyBtn = document.getElementById('buyBtn');
function refreshButton() {
    if (!store) return;
    const inCart = store.isInCart(productName);
    addBtn.textContent = inCart ? '✓ В корзине' : 'В корзину';
    addBtn.style.background = inCart ? '#e8f5e9' : '';
    addBtn.style.color = inCart ? '#2e7d32' : '';
}
refreshButton();
addBtn.addEventListener('click', function () {
    if (!store) return;
    if (store.isInCart(productName)) {
        store.removeFromCart(productName);
    } else {
        store.addToCart(productName);
    }
    if (typeof window.updateCartBadge === 'function') {
        window.updateCartBadge(store.getCartCount());
    }
    refreshButton();
});
buyBtn.addEventListener('click', function () {
    if (!store) return;
    if (!store.isInCart(productName)) {
        store.addToCart(productName);
    }
    if (typeof window.updateCartBadge === 'function') {
        window.updateCartBadge(store.getCartCount());
    }
    window.location.href = 'cart.html';
});
