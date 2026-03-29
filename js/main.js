lucide.createIcons();

function switchScreen(screenId) {
    document.querySelectorAll('.screen-content').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + screenId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('onclick').includes(screenId));
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.id === 'nav-' + screenId);
    });

    const bottomNav = document.querySelector('.bottom-nav');
    if (screenId === 'splash' || screenId === 'onboarding') {
        bottomNav.style.display = 'none';
    } else {
        bottomNav.style.display = 'flex';
    }
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    document.getElementById('toggle-dark').classList.toggle('on');
}

function toggleContrast() {
    const body = document.body;
    const currentContrast = body.getAttribute('data-contrast');
    const newContrast = currentContrast === 'high' ? 'standard' : 'high';
    body.setAttribute('data-contrast', newContrast);
    document.getElementById('toggle-contrast').classList.toggle('on');
}

function updateFontSize(val) {
    document.documentElement.style.setProperty('--font-scale', val / 100);
    document.getElementById('font-size-val').innerText = val + '%';
}

function toggleMotion() {
    const body = document.body;
    const currentMotion = body.getAttribute('data-motion');
    const newMotion = currentMotion === 'reduce' ? 'standard' : 'reduce';
    body.setAttribute('data-motion', newMotion);
    document.getElementById('toggle-motion').classList.toggle('on');
}

switchScreen('splash');
