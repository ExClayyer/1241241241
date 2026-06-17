document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('site-header');
    const footerContainer = document.getElementById('site-footer');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = [
        { href: 'index.html', label: 'Главная' },
        { href: 'catalog.html', label: 'Каталог' },
        { href: 'about.html', label: 'О нас' },
        { href: 'contacts.html', label: 'Контакты' }
    ];
    const page = currentPage.replace('.html', '');
    const routeMap = { '': 'index', cart: 'catalog', login: 'catalog', register: 'catalog', profile: 'catalog' };
    const activePage = routeMap[page] || page;
    const navHtml = navLinks.map(link => {
        const linkPage = link.href.replace('.html', '');
        return `<a href="${link.href}"${linkPage === activePage ? ' class="active"' : ''}>${link.label}</a>`;
    }).join('');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <div class="header-inner">
                <button class="burger-btn" id="burgerBtn">
                    <span></span><span></span><span></span>
                </button>
                <div class="header-logo">
                    <a href="index.html">VeloShop</a>
                </div>
                <nav class="header-nav">
                    ${navHtml}
                </nav>
                <div class="header-actions">
                    <a href="profile.html" class="header-link" title="Личный кабинет">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </a>
                    <a href="login.html" class="header-link" title="Вход">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    </a>
                    <a href="cart.html" class="header-cart" id="headerCartBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Корзина <span class="cart-badge" id="cartBadge">0</span>
                    </a>
                    <button class="theme-toggle" id="themeToggle" title="Тема">☀️</button>
                </div>
            </div>
        `;
    }
    const currentYear = new Date().getFullYear();
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="footer-inner">
                <div class="footer-col">
                    <h3>VeloShop</h3>
                    <p>Твой надёжный магазин велосипедов. Мы предлагаем лучшие бренды для профессионалов и любителей велоспорта.</p>
                </div>
                <div class="footer-col">
                    <h4>Навигация</h4>
                    <a href="index.html">Главная</a>
                    <a href="catalog.html">Каталог</a>
                    <a href="about.html">О нас</a>
                    <a href="contacts.html">Контакты</a>
                </div>
                <div class="footer-col">
                    <h4>Покупателям</h4>
                    <a href="cart.html">Корзина</a>
                    <a href="login.html">Вход</a>
                    <a href="register.html">Регистрация</a>
                    <a href="profile.html">Личный кабинет</a>
                </div>
                <div class="footer-col">
                    <h4>Контакты</h4>
                    <p>Телефон: +7 (999) 123-45-67</p>
                    <p>Email: info@veloshop.ru</p>
                    <p>г. Абакан, ул. Велосипедная, д. 1</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${currentYear} VeloShop. Все права защищены.</p>
            </div>
        `;
    }
    const count = (window.veloData && window.veloData.getCartCount) ? window.veloData.getCartCount() : 0;
    updateCartBadge(count);

    document.body.insertAdjacentHTML('afterbegin',
        '<div class="burger-overlay" id="burgerOverlay"></div>' +
        '<nav class="burger-menu" id="burgerMenu">' + navHtml + '</nav>');

    var burgerBtn = document.getElementById('burgerBtn');
    var burgerMenu = document.getElementById('burgerMenu');
    var burgerOverlay = document.getElementById('burgerOverlay');

    function toggleBurger(force) {
        var open = force !== undefined ? force : !burgerMenu.classList.contains('show');
        burgerBtn.classList.toggle('open', open);
        burgerMenu.classList.toggle('show', open);
        burgerOverlay.classList.toggle('show', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (burgerBtn && burgerMenu && burgerOverlay) {
        burgerBtn.addEventListener('click', function () { toggleBurger(); });
        burgerOverlay.addEventListener('click', function () { toggleBurger(false); });
    }

    var saved = localStorage.getItem('velo_theme') || 'light';
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    var btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = saved === 'dark' ? '🌙' : '☀️';
        btn.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme');
            if (current === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('velo_theme', 'light');
                btn.textContent = '☀️';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('velo_theme', 'dark');
                btn.textContent = '🌙';
            }
        });
    }
});
window.updateCartBadge = function(count) {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
};