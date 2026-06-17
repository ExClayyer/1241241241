document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Вход выполнен успешно!');
    window.location.href = 'index.html';
});
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    if (pass !== confirm) {
        alert('Пароли не совпадают!');
        return;
    }
    alert('Регистрация прошла успешно!');
    window.location.href = 'login.html';
});
