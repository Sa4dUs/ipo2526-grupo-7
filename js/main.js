let totalCO2 = 0;
let currentActionCat = '';
let currentSubcat = 'Estándar';
let currentMultiplier = 1.0;
let consentAccepted = localStorage.getItem('ecotrackConsentAccepted') === 'true';

function getConsentTab() {
    return Array.from(document.querySelectorAll('.nav-tab')).find(tab => {
        const handler = tab.getAttribute('onclick') || '';
        return handler.includes("switchScreen('consent')");
    });
}

function removeConsentUI() {
    const consentTab = getConsentTab();
    if (consentTab) consentTab.remove();

    const consentScreen = document.getElementById('screen-consent');
    if (consentScreen) consentScreen.remove();

    const splashStartBtn = document.querySelector('#screen-splash .primary-btn');
    if (splashStartBtn) splashStartBtn.setAttribute('onclick', "switchScreen('onboarding')");
}

function acceptConsent() {
    const consentCheckbox = document.getElementById('consent-ck');
    if (consentCheckbox && !consentCheckbox.checked) {
        alert('Debes aceptar el consentimiento para continuar.');
        return;
    }

    consentAccepted = true;
    localStorage.setItem('ecotrackConsentAccepted', 'true');
    removeConsentUI();
    switchScreen('onboarding');
}

function initConsentState() {
    if (consentAccepted) {
        removeConsentUI();
    }
}

function switchScreen(screenId) {
    if (screenId === 'consent' && consentAccepted) {
        screenId = 'onboarding';
    }

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
    bottomNav.style.display = (screenId === 'splash' || screenId === 'consent' || screenId === 'onboarding') ? 'none' : 'flex';

    if (screenId === 'profile') backToSettingsMain();
    if (screenId === 'calculator') calcNextStep(1);
    lucide.createIcons();
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

initConsentState();
switchScreen('splash');
lucide.createIcons();
