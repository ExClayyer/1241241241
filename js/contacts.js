document.getElementById('contactForm') && document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
    e.target.reset();
});
