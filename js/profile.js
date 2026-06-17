document.querySelectorAll('.profile-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.profile-nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.querySelectorAll('.profile-tab').forEach(t => t.style.display = 'none');
        document.getElementById(`tab-${tab}`).style.display = 'block';
    });
});
