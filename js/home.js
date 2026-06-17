window.addEventListener('scroll', function () {
    var bg = document.querySelector('.parallax-bg');
    if (bg) bg.style.transform = 'translateY(' + (window.scrollY * 0.4) + 'px)';
});
