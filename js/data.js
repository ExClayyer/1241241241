var mockProducts = [
    { name: 'Горный велосипед Trek Marlin 5', status: 'in_stock', type: 'Горные', brand: 'Trek', frameSize: 'M', price: 55000 },
    { name: 'Шоссейный велосипед Giant Contend', status: 'on_order', type: 'Шоссейные', brand: 'Giant', frameSize: 'L', price: 82000 },
    { name: 'Городской велосипед Stels Navigator', status: 'in_stock', type: 'Городские', brand: 'Stels', frameSize: 'S', price: 21000 },
    { name: 'Велосипед Trek Marlin 7', status: 'in_stock', type: 'Горные', brand: 'Trek', frameSize: 'L', price: 75000 },
    { name: 'BMX Wethepeople Nova', status: 'on_order', type: 'BMX', brand: 'WTP', frameSize: 'Универсальный', price: 35000 },
    { name: 'Электроскутер Xiaomi Electric', status: 'in_stock', type: 'Электро', brand: 'Xiaomi', frameSize: 'Универсальный', price: 45000 },
    { name: 'Горный велосипед Cube Reaction Pro', status: 'in_stock', type: 'Горные', brand: 'Cube', frameSize: 'M', price: 92000 },
    { name: 'Шоссейный Specialized Allez', status: 'on_order', type: 'Шоссейные', brand: 'Specialized', frameSize: 'S', price: 105000 },
    { name: 'Детский велосипед Stels Flyte', status: 'in_stock', type: 'Детские', brand: 'Stels', frameSize: 'XS', price: 12000 },
    { name: 'Городской Giant Escape', status: 'in_stock', type: 'Городские', brand: 'Giant', frameSize: 'M', price: 68000 },
    { name: 'BMX Sunday Broadway', status: 'in_stock', type: 'BMX', brand: 'WTP', frameSize: 'Универсальный', price: 28000 },
    { name: 'Электро Ninebot Max', status: 'on_order', type: 'Электро', brand: 'Xiaomi', frameSize: 'Универсальный', price: 62000 },
    { name: 'Горный Merida Big Nine', status: 'in_stock', type: 'Горные', brand: 'Merida', frameSize: 'L', price: 88000 },
    { name: 'Детский Trek Precaliber', status: 'in_stock', type: 'Детские', brand: 'Trek', frameSize: 'XS', price: 22000 },
    { name: 'Городской Cube Nature', status: 'in_stock', type: 'Городские', brand: 'Cube', frameSize: 'M', price: 58000 },
    { name: 'Шоссейный Trek Domane', status: 'on_order', type: 'Шоссейные', brand: 'Trek', frameSize: 'M', price: 135000 },
    { name: 'Горный Stels Challenger', status: 'in_stock', type: 'Горные', brand: 'Stels', frameSize: 'S', price: 19000 },
    { name: 'BMX Subrosa Letum', status: 'on_order', type: 'BMX', brand: 'WTP', frameSize: 'Универсальный', price: 42000 },
    { name: 'Электро Kugoo Kirin', status: 'in_stock', type: 'Электро', brand: 'Xiaomi', frameSize: 'Универсальный', price: 35000 },
    { name: 'Городской Specialized Sirrus', status: 'in_stock', type: 'Городские', brand: 'Specialized', frameSize: 'L', price: 78000 },
    { name: 'Горный Giant Talon', status: 'in_stock', type: 'Горные', brand: 'Giant', frameSize: 'M', price: 65000 },
    { name: 'Детский Merida Kid', status: 'on_order', type: 'Детские', brand: 'Merida', frameSize: 'XS', price: 15000 }
];
var statusLabels = { in_stock: 'В наличии', on_order: 'Под заказ' };
function getProductByName(name) {
    return mockProducts.find(function (p) { return p.name === name; });
}
var CART_KEY = 'velo_cart';
function getCart() {
    try {
        var raw = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        if (!raw.length) return [];
        if (typeof raw[0] === 'string') {
            var migrated = raw.map(function (n) { return { name: n, qty: 1 }; });
            saveCart(migrated);
            return migrated;
        }
        return raw;
    } catch (e) { return []; }
}
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(name) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.name === name; });
    if (item) { item.qty += 1; } else { cart.push({ name: name, qty: 1 }); }
    saveCart(cart);
}
function removeFromCart(name) {
    saveCart(getCart().filter(function (i) { return i.name !== name; }));
}
function updateCartQty(name, qty) {
    if (qty <= 0) { removeFromCart(name); return; }
    var cart = getCart();
    var item = cart.find(function (i) { return i.name === name; });
    if (item) { item.qty = qty; saveCart(cart); }
}
function getCartCount() {
    return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
}
function getCartTotal() {
    return getCart().reduce(function (sum, i) {
        var p = getProductByName(i.name);
        return sum + (p ? p.price * i.qty : 0);
    }, 0);
}
function isInCart(name) {
    return getCart().some(function (i) { return i.name === name; });
}
var popularItems = [
    { name: 'Горный Trek Marlin 5', price: 55000, tag: 'ХИТ' },
    { name: 'Шоссейный Giant Contend', price: 82000, tag: 'NEW' },
    { name: 'Городской Stels Navigator', price: 21000, tag: 'SALE' },
    { name: 'BMX Wethepeople Nova', price: 35000, tag: 'ХИТ' },
    { name: 'Электро Xiaomi Scooter', price: 45000, tag: 'NEW' },
    { name: 'Горный Cube Reaction Pro', price: 92000, tag: 'TOP' },
    { name: 'Детский Stels Flyte', price: 12000, tag: 'SALE' },
    { name: 'Trek Marlin 7', price: 75000, tag: 'ХИТ' }
];
window.veloData = {
    mockProducts: mockProducts,
    popularItems: popularItems,
    statusLabels: statusLabels,
    getProductByName: getProductByName,
    getCart: getCart,
    saveCart: saveCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateCartQty: updateCartQty,
    getCartCount: getCartCount,
    getCartTotal: getCartTotal,
    isInCart: isInCart
};
