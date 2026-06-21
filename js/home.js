// Hero slider
(function () {
    var slides = document.querySelectorAll('.slide');
    var dotsContainer = document.getElementById('sliderDots');
    if (!slides.length || !dotsContainer) return;

    var current = 0;
    var total = slides.length;
    var interval;

    // Create dots
    for (var i = 0; i < total; i++) {
        var dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        dot.addEventListener('click', function () {
            goTo(parseInt(this.dataset.index));
            resetInterval();
        });
        dotsContainer.appendChild(dot);
    }

    var dots = dotsContainer.querySelectorAll('span');

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = index;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function next() {
        goTo((current + 1) % total);
    }

    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(next, 4000);
    }

    interval = setInterval(next, 4000);

    // Parallax
    var parallaxBg = document.querySelector('.parallax-bg');
    window.addEventListener('scroll', function () {
        if (parallaxBg) parallaxBg.style.transform = 'translateY(' + (window.scrollY * 0.4) + 'px)';
    });
})();