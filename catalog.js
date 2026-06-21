var products = (window.veloData && window.veloData.mockProducts) || [];
var labels = (window.veloData && window.veloData.statusLabels) || {
    in_stock: 'В наличии',
    on_order: 'Под заказ'
};

var state = {
    products: products,
    search: '',
    sort: '',
    filters: {
        status: [],
        type: [],
        brand: [],
        frameSize: [],
        priceMin: '',
        priceMax: ''
    },
    uiOpen: {
        availability: true,
        types: true,
        price: true,
        brands: false,
        frameSize: false
    }
};

var el = {
    sidebar: document.getElementById('sidebarContent'),
    grid: document.getElementById('productsGrid'),
    search: document.getElementById('searchInput'),
    sort: document.getElementById('sortSelect'),
    count: document.getElementById('productsCount')
};

function init() {
    setupEvents();
    renderSidebar();
    render();
    updateBadge();
}

function updateBadge() {
    if (typeof window.updateCartBadge === 'function' && window.veloData) {
        window.updateCartBadge(window.veloData.getCartCount());
    }
}

function setupEvents() {
    el.search.addEventListener('input', function () {
        state.search = el.search.value;
        render();
    });

    var toggleBtn = document.getElementById('sidebarToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            el.sidebar.classList.toggle('show');
            var arrow = toggleBtn.querySelector('span');
            if (arrow) arrow.textContent = el.sidebar.classList.contains('show') ? '▲' : '▼';
        });
    }

    el.sort.addEventListener('change', function () {
        state.sort = el.sort.value;
        render();
    });

    el.grid.addEventListener('click', function (e) {
        var target = e.target.nodeType === 3 ? e.target.parentElement : e.target;
        var buyBtn = target.closest('.buy-btn');
        var cartBtn = target.closest('.cart-btn');
        var card = target.closest('.product-card');

        if (buyBtn) {
            e.stopPropagation();
            handleBuy(buyBtn.dataset.title);
            return;
        }
        if (cartBtn) {
            e.stopPropagation();
            handleCart(cartBtn.dataset.title);
            return;
        }
        if (card) {
            window.location.href = 'product.html';
        }
    });

    document.addEventListener('click', function (e) {
        var target = e.target.nodeType === 3 ? e.target.parentElement : e.target;
        if (target.classList.contains('reset-filters')) {
            state.filters = {
                status: [], type: [], brand: [], frameSize: [],
                priceMin: '', priceMax: ''
            };
            state.search = '';
            state.sort = '';
            el.search.value = '';
            el.sort.value = '';
            renderSidebar();
            render();
        }
    });
}

function renderSidebar() {
    var cnt = { status: {}, type: {}, brand: {}, frameSize: {} };
    var minPrice = Infinity;
    var maxPrice = 0;

    state.products.forEach(function (p) {
        if (p.status) cnt.status[p.status] = (cnt.status[p.status] || 0) + 1;
        if (p.type) cnt.type[p.type] = (cnt.type[p.type] || 0) + 1;
        if (p.brand) cnt.brand[p.brand] = (cnt.brand[p.brand] || 0) + 1;
        if (p.frameSize) cnt.frameSize[p.frameSize] = (cnt.frameSize[p.frameSize] || 0) + 1;
        if (p.price != null) {
            if (p.price < minPrice) minPrice = p.price;
            if (p.price > maxPrice) maxPrice = p.price;
        }
    });

    if (minPrice === Infinity) { minPrice = 0; maxPrice = 100000; }

    function filterGroup(title, key, data, section) {
        var keys = Object.keys(data);
        if (!keys.length) return '';

        return '<div class="filter-section ' + (state.uiOpen[section] ? 'active' : '') + '">' +
            '<div class="filter-title" data-section="' + section + '">' + title + '</div>' +
            '<div class="filter-content">' +
            keys.map(function (k) {
                var name = labels[k] || k;
                var checked = state.filters[key].indexOf(k) !== -1 ? 'checked' : '';
                return '<label class="filter-option">' +
                    '<input type="checkbox" data-cat="' + key + '" data-val="' + k + '" ' + checked + '>' +
                    '<span>' + name + '</span>' +
                    '<span class="fc">' + data[k] + '</span>' +
                    '</label>';
            }).join('') +
            '</div>' +
            '</div>';
    }

    var html = filterGroup('Наличие', 'status', cnt.status, 'availability');
    html += filterGroup('Тип', 'type', cnt.type, 'types');
    html += '<div class="filter-section ' + (state.uiOpen.price ? 'active' : '') + '">' +
        '<div class="filter-title" data-section="price">Цена</div>' +
        '<div class="filter-content">' +
        '<div class="price-range">' +
        '<input type="number" class="price-input" id="pMin" placeholder="' + minPrice +
        '" min="' + minPrice + '" value="' + state.filters.priceMin + '">' +
        '<span class="pr-sep">—</span>' +
        '<input type="number" class="price-input" id="pMax" placeholder="' + maxPrice +
        '" max="' + maxPrice + '" value="' + state.filters.priceMax + '">' +
        '</div>' +
        '</div>' +
        '</div>';
    html += filterGroup('Бренд', 'brand', cnt.brand, 'brands');
    html += filterGroup('Размер рамы', 'frameSize', cnt.frameSize, 'frameSize');
    html += '<button class="reset-filters">Сбросить фильтры</button>';

    el.sidebar.innerHTML = html;
    bindSidebarEvents();
}

function bindSidebarEvents() {
    document.querySelectorAll('.filter-title').forEach(function (title) {
        title.addEventListener('click', function (e) {
            var section = e.target.dataset.section;
            state.uiOpen[section] = !state.uiOpen[section];
            renderSidebar();
        });
    });

    document.querySelectorAll('.filter-option input').forEach(function (input) {
        input.addEventListener('change', function (e) {
            var cat = e.target.dataset.cat;
            var val = e.target.dataset.val;
            var list = state.filters[cat];
            state.filters[cat] = e.target.checked
                ? list.concat(val)
                : list.filter(function (v) { return v !== val; });
            render();
        });
    });

    var pMin = document.getElementById('pMin');
    var pMax = document.getElementById('pMax');
    if (pMin && pMax) {
        function onPriceChange() {
            var minVal = Number(pMin.value) || 0;
            var maxVal = Number(pMax.value) || 0;
            if (pMin.value && pMax.value && minVal > maxVal) {
                pMin.value = maxVal;
                pMax.value = minVal;
            }
            state.filters.priceMin = pMin.value;
            state.filters.priceMax = pMax.value;
            render();
        }
        pMin.addEventListener('input', onPriceChange);
        pMax.addEventListener('input', onPriceChange);
    }
}

function render() {
    var result = state.products;
    var query = state.search.trim().toLowerCase();
    if (query) {
        result = result.filter(function (p) {
            return p.name.toLowerCase().indexOf(query) !== -1;
        });
    }
    if (state.filters.status.length) {
        result = result.filter(function (p) { return state.filters.status.indexOf(p.status) !== -1; });
    }
    if (state.filters.type.length) {
        result = result.filter(function (p) { return state.filters.type.indexOf(p.type) !== -1; });
    }
    if (state.filters.brand.length) {
        result = result.filter(function (p) { return state.filters.brand.indexOf(p.brand) !== -1; });
    }
    if (state.filters.frameSize.length) {
        result = result.filter(function (p) { return state.filters.frameSize.indexOf(p.frameSize) !== -1; });
    }
    if (state.filters.priceMin) {
        result = result.filter(function (p) { return p.price >= Number(state.filters.priceMin); });
    }
    if (state.filters.priceMax) {
        result = result.filter(function (p) { return p.price <= Number(state.filters.priceMax); });
    }
    if (state.sort === 'price-asc') {
        result = result.slice();
        result.sort(function (a, b) { return (a.price || 0) - (b.price || 0); });
    } else if (state.sort === 'price-desc') {
        result = result.slice();
        result.sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
    } else if (state.sort === 'name') {
        result = result.slice();
        result.sort(function (a, b) { return (a.name || '').localeCompare(b.name || ''); });
    }
    if (el.count) {
        el.count.textContent = 'Найдено ' + result.length + ' из ' + state.products.length;
    }
    if (!result.length) {
        el.grid.innerHTML = '<div class="no-results">По вашему запросу ничего не найдено</div>';
        return;
    }
    el.grid.innerHTML = result.map(function (item, i) {
        var inCart = window.veloData ? window.veloData.isInCart(item.name) : false;
        var inStock = item.status === 'in_stock';
        var imgNum = (products.indexOf(item) % 7) + 1;
        return '<div class="product-card" style="animation-delay:' + (i * 0.04) + 's">' +
            '<div class="card-img">' +
            '<img src="assets/bicycle/' + imgNum + '.jpg" alt="' + item.name + '" loading="lazy">' +
            '<span class="card-badge ' + (inStock ? 'bg-green' : 'bg-amber') + '">' +
            (inStock ? 'В наличии' : 'Под заказ') +
            '</span>' +
            '</div>' +
            '<div class="card-body">' +
            '<h3 class="card-title">' + item.name + '</h3>' +
            '<div class="card-meta">' + (item.brand || '') +
            (item.frameSize ? ' · ' + item.frameSize : '') +
            (item.type ? ' · ' + item.type : '') +
            '</div>' +
            '<div class="card-bottom">' +
            '<span class="card-price">' + item.price.toLocaleString('ru-RU') + ' ₽</span>' +
            '</div>' +
            '<div class="card-actions">' +
            '<button class="buy-btn" data-title="' + item.name + '">' +
            (inStock ? 'Купить' : 'Заказать') +
            '</button>' +
            '<button class="cart-btn ' + (inCart ? 'in-cart' : '') + '" data-title="' + item.name + '">' +
            (inCart ? '✓ В корзине' : 'В корзину') +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>';
    }).join('');
}

function handleBuy(title) {
    if (!window.veloData || !title) return;
    if (!window.veloData.isInCart(title)) {
        window.veloData.addToCart(title);
    }
    updateBadge();
    window.location.href = 'cart.html';
}

function handleCart(title) {
    if (!window.veloData || !title) return;
    if (window.veloData.isInCart(title)) {
        window.veloData.removeFromCart(title);
    } else {
        window.veloData.addToCart(title);
    }
    render();
    updateBadge();
}

document.addEventListener('DOMContentLoaded', init);
