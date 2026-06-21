var root = document.getElementById('cartRoot');
var KEY = 'velo_cart';
var store = window.veloData;

function readCart() {
    var s = localStorage.getItem(KEY);
    if (!s) return [];
    try { return JSON.parse(s); } catch (e) { return []; }
}

function writeCart(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
}

function findProduct(name) {
    var all = (store && store.mockProducts) || [];
    for (var i = 0; i < all.length; i++) {
        if (all[i].name === name) return all[i];
    }
    return null;
}

function renderCart() {
    var cart = readCart();
    if (!cart.length) {
        root.innerHTML =
            '<div class="cart-empty">' +
            '<div class="cart-empty-icon">🛒</div>' +
            '<h2>Корзина пуста</h2>' +
            '<p>Добавьте товары из каталога, чтобы оформить заказ</p>' +
            '<a href="catalog.html" class="form-btn" style="display:inline-block;width:auto;padding:14px 40px;text-decoration:none;margin-top:8px">Перейти в каталог</a>' +
            '</div>';
        return;
    }
    var total = 0;
    var rows = '';
    for (var i = 0; i < cart.length; i++) {
        var it = cart[i];
        var prod = findProduct(it.name);
        var price = prod ? prod.price : 0;
        var sub = price * (it.qty || 1);
        total += sub;
        var imgNum = prod ? (store.mockProducts.indexOf(prod) % 7) + 1 : 1;
        rows +=
            '<div class="cart-item">' +
            '<div class="cart-item-img"><img src="assets/bicycle/' + imgNum + '.jpg" alt="' + it.name + '"></div>' +
            '<div class="cart-item-info">' +
            '<h4>' + it.name + '</h4>' +
            '<span class="cart-item-price">' + price.toLocaleString('ru-RU') + ' ₽</span>' +
            '<div class="cart-item-subtotal">' + sub.toLocaleString('ru-RU') + ' ₽</div>' +
            '<div class="cart-qty">' +
            '<button class="cart-qty-btn" onclick="window.cartQty(' + i + ',-1)">−</button>' +
            '<span class="cart-qty-val">' + (it.qty || 1) + '</span>' +
            '<button class="cart-qty-btn" onclick="window.cartQty(' + i + ',1)">+</button>' +
            '</div>' +
            '</div>' +
            '<button class="cart-item-remove" onclick="window.cartDel(' + i + ')">✕</button>' +
            '</div>';
    }
    root.innerHTML =
        '<div class="cart-layout">' +
        '<div>' +
        '<div>' + rows + '</div>' +
        '<button class="form-btn form-btn-secondary" onclick="window.cartClear()" style="margin-top:14px">Очистить корзину</button>' +
        '</div>' +
        '<aside class="cart-checkout">' +
        '<div class="cart-summary">' +
        '<div class="cart-total"><span>Итого:</span><span>' + total.toLocaleString('ru-RU') + ' ₽</span></div>' +
        '<div class="checkout-form">' +
        '<div class="form-group"><label>Email</label><input type="email" id="chEmail" class="form-input" placeholder="ivan@example.com"></div>' +
        '<div class="form-group"><label>Телефон</label><input type="tel" id="chPhone" class="form-input" placeholder="+7 (999) 123-45-67"></div>' +
        '<button class="form-btn" onclick="window.cartCheckout()">Оформить заказ</button>' +
        '</div>' +
        '</div>' +
        '</aside>' +
        '</div>';
}

window.cartQty = function (i, d) {
    var cart = readCart();
    if (i >= cart.length) return;
    cart[i].qty = (cart[i].qty || 1) + d;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    writeCart(cart);
    renderCart();
};

window.cartDel = function (i) {
    var cart = readCart();
    if (i < cart.length) cart.splice(i, 1);
    writeCart(cart);
    renderCart();
};

window.cartClear = function () {
    writeCart([]);
    renderCart();
};

window.cartCheckout = function () {
    var emailEl = document.getElementById('chEmail');
    var phoneEl = document.getElementById('chPhone');
    if (!emailEl || !phoneEl) return;
    var email = emailEl.value.trim();
    var phone = phoneEl.value.trim();
    if (!email) { alert('Введите Email'); return; }
    if (email.indexOf('@') === -1) { alert('Некорректный Email'); return; }
    if (!phone) { alert('Введите Телефон'); return; }
    var cart = readCart();
    var sum = 0;
    for (var i = 0; i < cart.length; i++) {
        var prod = findProduct(cart[i].name);
        if (prod) sum += prod.price * (cart[i].qty || 1);
    }
    alert('Заказ на ' + sum.toLocaleString('ru-RU') + ' ₽\nEmail: ' + email + '\nТелефон: ' + phone);
    writeCart([]);
    renderCart();
};

renderCart();
