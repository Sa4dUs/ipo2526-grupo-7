let totalCO2 = 0;
let currentActionCat = '';
let currentSubcat = 'Estándar';
let currentMultiplier = 1.0;

function switchScreen(screenId) {
    document.querySelectorAll('.screen-content').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + screenId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('onclick') && t.getAttribute('onclick').includes(screenId));
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.id === 'nav-' + screenId);
    });

    const bottomNav = document.querySelector('.bottom-nav');
    if (!bottomNav) return;
    bottomNav.style.display = (screenId === 'splash' || screenId === 'onboarding') ? 'none' : 'flex';

    if (screenId === 'profile') backToSettingsMain();
    if (screenId === 'calculator') calcNextStep(1);
    if (screenId === 'news') loadNews();
    lucide.createIcons();
}

function updateZoom(val) {
    const screen = document.querySelector('.app-screen');
    if (screen) screen.style.zoom = val / 100;
    const label = document.getElementById('zoom-val');
    if (label) label.innerText = val + '%';
}

function resetZoom() {
    const screen = document.querySelector('.app-screen');
    if (screen) screen.style.zoom = 1;
    const slider = document.getElementById('zoom-range');
    if (slider) slider.value = 100;
    const label = document.getElementById('zoom-val');
    if (label) label.innerText = '100%';
}

function openSettingsSub(id) {
    document.querySelectorAll('[id^="settings-"]').forEach(el => { el.style.display = 'none'; });
    const target = document.getElementById('settings-' + id);
    if (target) { target.style.display = 'block'; }
    lucide.createIcons();
}

function backToSettingsMain() {
    document.querySelectorAll('[id^="settings-"]').forEach(el => { el.style.display = 'none'; });
    document.getElementById('settings-main').style.display = 'block';
    lucide.createIcons();
}

function openActionDetails(cat) {
    currentActionCat = cat;
    document.getElementById('detail-title').innerText = 'Impacto de ' + cat;
    document.getElementById('action-details-overlay').style.display = 'flex';

    currentSubcat = 'Estándar';
    currentMultiplier = 1.0;

    document.querySelectorAll('.action-field-set').forEach(fs => fs.style.display = 'none');
    document.querySelectorAll('.subcat-btn').forEach(b => {
        b.style.border = '2px solid transparent';
        b.style.color = 'var(--text)';
    });

    const desc = document.getElementById('detail-desc');
    let firstBtn = null;
    if (cat === 'Transporte') {
        document.getElementById('fields-transport').style.display = 'block';
        desc.innerText = 'Dinos cuántos kilómetros has recorrido y en qué medio.';
        firstBtn = document.querySelector('#fields-transport .subcat-btn');
    } else if (cat === 'Alimentación') {
        document.getElementById('fields-food').style.display = 'block';
        desc.innerText = 'Calcula el ahorro por elegir opciones vegetales o locales.';
        firstBtn = document.querySelector('#fields-food .subcat-btn');
    } else if (cat === 'Energía') {
        document.getElementById('fields-energy').style.display = 'block';
        desc.innerText = 'Registra cuánto tiempo has ahorrado energía hoy.';
        firstBtn = document.querySelector('#fields-energy .subcat-btn');
    } else if (cat === 'Residuos') {
        document.getElementById('fields-waste').style.display = 'block';
        desc.innerText = 'Rastrea el impacto de reciclar o evitar residuos.';
        firstBtn = document.querySelector('#fields-waste .subcat-btn');
    }

    if (firstBtn) firstBtn.click();
}
function closeActionDetails() {
    document.getElementById('action-details-overlay').style.display = 'none';
}
function setSubcat(name, multiplier, btn) {
    currentSubcat = name;
    currentMultiplier = multiplier;

    const parent = btn.parentElement;
    parent.querySelectorAll('.calc-option').forEach(b => {
        b.classList.remove('selected');
    });

    btn.classList.add('selected');
}
function confirmAction() {
    let amount = 0;
    let labelSuffix = '';

    if (currentActionCat === 'Transporte') {
        amount = parseFloat(document.getElementById('input-km').value);
        labelSuffix = ' km';
    } else if (currentActionCat === 'Alimentación') {
        amount = parseFloat(document.getElementById('input-grams').value) / 1000; // a kg
        labelSuffix = 'g';
    } else if (currentActionCat === 'Energía') {
        amount = parseFloat(document.getElementById('input-hours').value);
        labelSuffix = 'h';
    } else if (currentActionCat === 'Residuos') {
        amount = parseFloat(document.getElementById('input-waste').value);
        labelSuffix = ' kg';
    }

    const co2Saved = amount * currentMultiplier;
    recordAction(`${currentActionCat} (${currentSubcat})`, co2Saved);
    closeActionDetails();
}

function toggleTheme() {
    const body = document.body;
    const newTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    const btn = document.getElementById('toggle-dark');
    if (btn) btn.classList.toggle('on', newTheme === 'dark');
    speak(newTheme === 'dark' ? "Modo oscuro activado" : "Modo claro activado");
}
function toggleContrast() {
    const body = document.body;
    const newVal = body.getAttribute('data-contrast') === 'high' ? 'standard' : 'high';
    body.setAttribute('data-contrast', newVal);
    const btn = document.getElementById('toggle-contrast');
    if (btn) btn.classList.toggle('on', newVal === 'high');
    speak("Contraste actualizado");
}
function toggleGrayscale() {
    const body = document.body;
    const newVal = body.getAttribute('data-grayscale') === 'on' ? 'off' : 'on';
    body.setAttribute('data-grayscale', newVal);
    const btn = document.getElementById('toggle-grayscale');
    if (btn) btn.classList.toggle('on', newVal === 'on');
}
function toggleDyslexic() {
    const body = document.body;
    const newVal = body.getAttribute('data-dyslexic') === 'on' ? 'off' : 'on';
    body.setAttribute('data-dyslexic', newVal);
    const btn = document.getElementById('toggle-dyslexic');
    if (btn) btn.classList.toggle('on', newVal === 'on');
}
function toggleNarrator() {
    const body = document.body;
    const newVal = body.getAttribute('data-narrator') === 'on' ? 'off' : 'on';
    body.setAttribute('data-narrator', newVal);
    const btn = document.getElementById('toggle-narrator');
    if (btn) btn.classList.toggle('on', newVal === 'on');
    if (newVal === 'on') speak("Narrador activado");
}
function toggleMotion() {
    const body = document.body;
    const newVal = body.getAttribute('data-motion') === 'reduce' ? 'standard' : 'reduce';
    body.setAttribute('data-motion', newVal);
    const btn = document.getElementById('toggle-motion');
    if (btn) btn.classList.toggle('on', newVal === 'reduce');
}
function updateFontSize(val) {
    document.documentElement.style.setProperty('--font-scale', val / 100);
    const label = document.getElementById('font-size-val');
    if (label) label.innerText = val + '%';
}
function setColorFilter(filter) {
    document.body.setAttribute('data-filter', filter);
    document.querySelectorAll('.filter-btn').forEach(b => {
        const isActive = b.getAttribute('data-filter-val') === filter;
        b.style.border = isActive ? '2px solid var(--primary)' : '2px solid transparent';
        b.style.color = isActive ? 'var(--primary)' : 'var(--text)';
    });
}
function speak(text) {
    if (document.body.getAttribute('data-narrator') === 'on' && 'speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'es-ES';
        window.speechSynthesis.speak(msg);
    }
}

function recordAction(name, co2) {
    totalCO2 += co2;
    updateImpactDisplay();
    const history = document.getElementById('action-history');
    if (history.innerHTML.includes('No hay registros')) history.innerHTML = '';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;padding:10px 0;border-bottom:1px solid var(--line);animation:fadeIn 0.4s ease-out;';
    item.innerHTML = `<div><b>${name}</b><div style="font-size:0.7rem;color:var(--text-muted);">Hoy, ${now}</div></div><span style="color:var(--primary);font-weight:700;">-${co2.toFixed(1)} kg</span>`;
    history.insertBefore(item, history.firstChild);
    speak("Acción registrada: " + name);
}
function updateImpactDisplay() {
    const co2El = document.getElementById('today-co2');
    const treeEl = document.getElementById('today-trees');
    if (co2El) co2El.innerText = totalCO2.toFixed(1) + ' kg';
    if (treeEl) treeEl.innerText = (totalCO2 / 0.06).toFixed(2);
}

const calcData = { transport: 0.21, diet: 1500, heating: 1800, flights: 0, consumption: 500 };
const CALC_STEPS = 4;

function selectCalcOption(btn, group) {
    document.querySelectorAll(`.calc-option[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    calcData[group] = parseFloat(btn.dataset.val);
    speak(btn.innerText.trim() + " seleccionado");
}

function calcNextStep(step) {
    for (let i = 1; i <= CALC_STEPS; i++) {
        const el = document.getElementById('calc-step-' + i);
        if (el) el.style.display = 'none';
        const dot = document.getElementById('calc-step-dot-' + i);
        if (dot) dot.style.background = i <= step ? 'var(--primary)' : 'var(--line)';
    }
    const target = document.getElementById('calc-step-' + step);
    if (target) {
        target.style.display = 'block';
        target.style.animation = 'fadeIn 0.3s ease-out';
    }
    if (step === CALC_STEPS) computeAndShowResult();
    lucide.createIcons();
}

function computeAndShowResult() {
    const km = parseFloat(document.getElementById('calc-km').value) || 0;
    const SPAIN_AVG = 5500;

    const transportCO2 = Math.round(km * calcData.transport * 300);
    const dietCO2 = Math.round(calcData.diet);
    const heatingCO2 = Math.round(calcData.heating);
    const flightsCO2 = Math.round(calcData.flights);
    const consumptionCO2 = Math.round(calcData.consumption);
    const total = transportCO2 + dietCO2 + heatingCO2 + flightsCO2 + consumptionCO2;

    animateCounter('calc-result-co2', total);
    const trees = Math.ceil(total / 21);
    document.getElementById('calc-result-trees').innerText = trees;

    const vsPct = Math.round(((total - SPAIN_AVG) / SPAIN_AVG) * 100);
    const vsEl = document.getElementById('calc-result-vs');
    vsEl.innerText = (vsPct >= 0 ? '+' : '') + vsPct + '%';
    vsEl.style.color = vsPct <= 0 ? '#2ECC71' : '#E74C3C';

    const grade = total < 2000 ? 'A' : total < 3500 ? 'B' : total < 5000 ? 'C' : total < 7000 ? 'D' : 'E';
    const gradeColors = { A: '#2ECC71', B: '#82E0AA', C: '#F39C12', D: '#E67E22', E: '#E74C3C' };
    const gradeEl = document.getElementById('calc-result-grade');
    gradeEl.innerText = grade;
    gradeEl.style.color = gradeColors[grade];

    const categories = [
        { id: 'transport', val: transportCO2, color: '#E74C3C' },
        { id: 'diet', val: dietCO2, color: '#F39C12' },
        { id: 'heating', val: heatingCO2, color: '#3498DB' },
        { id: 'flights', val: flightsCO2, color: '#9B59B6' },
        { id: 'consumption', val: consumptionCO2, color: '#1ABC9C' }
    ];
    const maxVal = Math.max(...categories.map(c => c.val), 1);
    categories.forEach(cat => {
        const bar = document.getElementById('calc-bar-' + cat.id);
        const valEl = document.getElementById('calc-bar-' + cat.id + '-val');
        if (bar) bar.style.width = (cat.val / maxVal * 100) + '%';
        if (valEl) valEl.innerText = cat.val.toLocaleString('es') + ' kg';
    });

    const sortedCats = [...categories].sort((a, b) => b.val - a.val);
    const tipMap = {
        transport: `🚗 Tu transporte genera ${transportCO2.toLocaleString('es')} kg/año. Cambiar a transporte público 3 días/semana podría ahorrarte ~${Math.round(transportCO2 * 0.4).toLocaleString('es')} kg.`,
        diet: `🥩 Tu alimentación genera ${dietCO2.toLocaleString('es')} kg/año. Reducir la carne roja a 1-2 veces/semana ahorraría ~${Math.round(dietCO2 * 0.35).toLocaleString('es')} kg.`,
        heating: `🏠 Tu hogar genera ${heatingCO2.toLocaleString('es')} kg/año. Mejorar el aislamiento o usar bomba de calor reduciría hasta un 60%.`,
        flights: `✈️ Tus vuelos generan ${flightsCO2.toLocaleString('es')} kg/año. Un vuelo ida y vuelta Madrid-Londres emite ~500 kg. Considera el tren para distancias cortas.`,
        consumption: `🛒 Tu consumo genera ${consumptionCO2.toLocaleString('es')} kg/año. Comprar segunda mano y reducir envases puede bajar un 30%.`
    };
    const tipEl = document.getElementById('calc-tip');
    if (tipEl) tipEl.innerText = tipMap[sortedCats[0].id];

    const eqEl = document.getElementById('calc-equivalences');
    if (eqEl) {
        const flights_eq = (total / 500).toFixed(1);
        const cars_eq = (total / 4600).toFixed(1);
        const beef_eq = Math.round(total / 27);
        eqEl.innerHTML = `
            <div style="display:flex;justify-content:space-around;text-align:center;gap:8px;">
                <div><div style="font-size:1.8rem;">✈️</div><div style="font-weight:800;font-size:1.1rem;">${flights_eq}</div><div style="font-size:0.7rem;color:var(--text-muted);">vuelos cortos</div></div>
                <div><div style="font-size:1.8rem;">🚗</div><div style="font-weight:800;font-size:1.1rem;">${cars_eq}</div><div style="font-size:0.7rem;color:var(--text-muted);">años en coche</div></div>
                <div><div style="font-size:1.8rem;">🥩</div><div style="font-weight:800;font-size:1.1rem;">${beef_eq}</div><div style="font-size:0.7rem;color:var(--text-muted);">kg de ternera</div></div>
            </div>`;
    }

    speak("Tu huella es de " + total + " kilogramos de CO2 al año. Calificación: " + grade);
}

function animateCounter(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.innerText = current.toLocaleString('es');
    }, 25);
}

async function loadNews() {
    const apiKey = 'e30b68a6be7a635dedfbc732287d43e6';
    const query = 'medio ambiente sostenibilidad clima';
    const url = `https://gnews.io/api/v4/search?q=medioambiente&lang=es&max=6&apikey=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        const articles = data.articles;
        if (!articles || articles.length === 0) return;

        renderFeaturedNews(articles[0]);
        renderNewsList(articles.slice(1));
    } catch (e) {
        document.getElementById('news-list').innerHTML =
            '<div style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding:20px;">No se pudieron cargar las noticias.</div>';
    }
}

function renderFeaturedNews(article) {
    const container = document.getElementById('featured-news');
    const imgHtml = article.image
        ? `<img src="${article.image}" style="width:100%; height:160px; object-fit:cover;">`
        : `<div style="height:160px; background: linear-gradient(135deg, #1B7F43, #21618C); display:flex; align-items:center; justify-content:center;">
        <i data-lucide="newspaper" style="width:40px; height:40px; color:white;"></i>
        </div>`;

    container.innerHTML = `
    ${imgHtml}
    <div style="padding: 16px;">
        <span style="font-size: 0.7rem; background: #eee; padding: 4px 8px; border-radius: 8px; color: #333;">${article.source.name}</span>
        <h3 style="margin: 8px 0; font-size: 1.1rem;">${article.title}</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted);">${article.description || ''}</p>
        <span style="font-size: 0.7rem; color: var(--text-muted);">${formatNewsDate(article.publishedAt)}</span>
    </div>`;
    container.onclick = () => openNewsOverlay(article);
    lucide.createIcons();
}

function renderNewsList(articles) {
    const container = document.getElementById('news-list');
    container.innerHTML = '';

    articles.forEach(article => {
        const item = document.createElement('div');
        item.className = 'glass-card';
        item.style.cssText = 'display:flex; gap:10px; align-items:center; padding:10px; cursor:pointer;';

        const imgHtml = article.image
            ? `<img src="${article.image}" style="width:52px; height:52px; border-radius:12px; object-fit:cover; flex-shrink:0;">`
            : `<div style="width:52px; height:52px; border-radius:12px; background:#E8F8F5; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <i data-lucide="leaf" style="width:18px; color:var(--primary);"></i>
            </div>`;

        item.innerHTML = `${imgHtml}
            <div style="flex:1; min-width:0;">
                <h4 style="font-size:0.85rem; margin:0; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${article.title}</h4>
                <span style="font-size:0.65rem; color:var(--text-muted);">${article.source.name} · ${formatNewsDate(article.publishedAt)}</span>
            </div>
    `;

        item.onclick = () => openNewsOverlay(article);
        container.appendChild(item);
    });

    lucide.createIcons();
}

function openNewsOverlay(article) {
    const overlay = document.getElementById('news-overlay');
    const content = document.getElementById('news-overlay-content');

    const imgHtml = article.image
        ? `<img src="${article.image}" style="width:100%; border-radius:16px; margin-bottom:16px; object-fit:cover; max-height:200px;">`
        : '';

    content.innerHTML = `
    ${imgHtml}
    <span style="font-size:0.7rem; background:var(--line); padding:4px 10px; border-radius:8px; color:var(--text-muted);">${article.source.name}</span>
    <h2 style="font-size:1.2rem; margin:12px 0 8px;">${article.title}</h2>
    <span style="font-size:0.75rem; color:var(--text-muted);">${formatNewsDate(article.publishedAt)}</span>
    <p style="font-size:0.9rem; line-height:1.6; margin-top:16px; color:var(--text);">${article.content || article.description || 'Contenido no disponible.'}</p>
    <button onclick="window.open('${article.url}', '_blank')" class="primary-btn" style="margin-top:24px;">
    Leer artículo completo
    </button>`;

    overlay.style.display = 'block';
    lucide.createIcons();
}

function closeNewsOverlay() {
    document.getElementById('news-overlay').style.display = 'none';
}

function formatNewsDate(dateStr) {
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date) / 60000);
    if (diff < 60) return `Hace ${diff} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)} horas`;
    return `Hace ${Math.floor(diff / 1440)} días`;
}

let xpActual = 840;
const xpMax = 1000;
let huellaActual = 72;
let objetivoActual = 65;

function completeChallenge() {
    const card = document.getElementById('reto-card');
    const btn = document.getElementById('reto-btn');
    const badge = document.getElementById('reto-badge');

    card.style.borderLeft = '4px solid var(--primary)';
    card.style.background = 'rgba(27, 127, 67, 0.08)';
    badge.style.background = 'rgba(27, 127, 67, 0.15)';
    badge.style.color = 'var(--primary)';
    badge.innerText = '✓ Completado';
    btn.disabled = true;
    btn.innerText = '🎉 ¡Reto completado!';
    btn.style.opacity = '0.6';

    const xpGanado = Math.round(500 / 3);
    xpActual = Math.min(xpActual + xpGanado, xpMax);
    const xpPct = Math.round((xpActual / xpMax) * 100);

    const homeXp = document.getElementById('home-xp');
    if (homeXp) homeXp.innerText = xpActual + ' XP';

    const perfilFill = document.getElementById('perfil-xp-fill');
    if (perfilFill) perfilFill.style.width = xpPct + '%';

    const perfilXpMin = document.querySelector('#screen-profile .scrollview span');
    if (perfilXpMin) perfilXpMin.innerText = xpActual + ' XP';

    huellaActual = Math.max(huellaActual - 5, 0);
    const homeFill = document.getElementById('home-huella-fill');
    if (homeFill) homeFill.style.width = huellaActual + '%';

    objetivoActual = Math.min(objetivoActual + 10, 100);
    const objFill = document.getElementById('objetivos-fill');
    if (objFill) objFill.style.width = objetivoActual + '%';
    const objPct = document.getElementById('objetivos-pct');
    if (objPct) objPct.innerText = objetivoActual + '%';

    speak('¡Enhorabuena! Has completado el reto y ganado ' + xpGanado + ' XP.');
}

switchScreen('splash');
lucide.createIcons();
