document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Вход выполнен успешно!');
    window.location.href = 'index.html';
});
var regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var passEl = document.getElementById('regPassword');
        var confirmEl = document.getElementById('regConfirm');
        if (!passEl || !confirmEl) return;
        if (passEl.value !== confirmEl.value) {
            alert('Пароли не совпадают!');
            return;
        }
        alert('Регистрация прошла успешно!');
        window.location.href = 'login.html';
    });
}
