document.querySelectorAll('.profile-nav-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.profile-nav-item').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var tab = btn.dataset.tab;
        document.querySelectorAll('.profile-tab').forEach(function (t) { t.style.display = 'none'; });
        document.getElementById('tab-' + tab).style.display = 'block';
    });
});
