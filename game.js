'use strict';

/* ============================================================
   HUMAN.SIM — motor de simulación
   Estado local, código defensivo, sin dependencias.
   ============================================================ */

const $ = (id) => document.getElementById(id);
const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, Number.isFinite(Number(value)) ? Number(value) : 0));
const int = (value, fallback = 0) => (Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback);
const fmtMoney = (value) => {
  const n = int(value);
  return `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('es-AR')}`;
};

const BEST_KEY = 'humansim_best_v1';
const SOUND_KEY = 'humansim_sound_v1';

const ui = { statEls: {}, lastAge: -1, audio: null };
let state = null;
let selectedOrigin = 'calle';
let soundOn = false;

/* ---------- consultas ---------- */
function stageForAge(age) {
  const a = Math.max(0, int(age));
  return STAGES.find((stage) => a >= stage.min && a <= stage.max) ?? STAGES[0];
}

function turnYears(age) {
  const a = Math.max(0, int(age));
  if (a >= 60) return 3;
  if (a >= 18) return 2;
  return 1;
}

function originOf() {
  return ORIGINS[state?.originId] ?? ORIGINS.calle;
}

function careerOf(level) {
  const safe = Math.min(6, Math.max(0, int(level)));
  return CAREER[safe] ?? CAREER[0];
}

function salaryPerYear() {
  if (!state) return 0;
  const level = Math.min(6, Math.max(0, int(state.career)));
  const base = careerOf(level)?.salary ?? 0;
  const mindMult = 0.7 + (clamp(state.stats?.mind ?? 0) / 100) * 0.6;
  const degreeMult = state.degree ? 1.15 : 1;
  const originMult = originOf()?.salaryMult ?? 1;
  return Math.round((base * mindMult * degreeMult * originMult) / 10) * 10;
}

function computeScore(snapshot = state) {
  if (!snapshot) return 0;
  const s = snapshot.stats ?? {};
  const moneyScore = Math.min(250, Math.floor((snapshot.money ?? 0) / 400));
  const careerScore = (snapshot.career ?? 0) * 30 + (snapshot.retired ? 10 : 0);
  const loveScore = Math.round((snapshot.love ?? 0) * 0.6);
  const familyScore = (snapshot.partner ? 25 : 0) + (snapshot.kids ?? 0) * 20;
  const homeScore = snapshot.house ? 40 : 0;
  const degreeScore = snapshot.degree ? 30 : 0;
  const achScore = (snapshot.achievements?.length ?? 0) * 12;
  return Math.max(0, Math.round(
    (s.health ?? 0) + (s.mind ?? 0) + (s.social ?? 0) + (s.happy ?? 0) +
    moneyScore + careerScore + loveScore + familyScore + homeScore + degreeScore + achScore
  ));
}

function getRank(score) {
  const safe = Math.max(0, int(score));
  let rank = RANKS[0];
  for (const candidate of RANKS) if (safe >= (candidate?.min ?? 0)) rank = candidate;
  return rank ?? RANKS[0];
}

function lifeValue() {
  if (!state) return 0;
  const s = state.stats ?? {};
  return (s.health ?? 0) + (s.mind ?? 0) + (s.social ?? 0) + (s.happy ?? 0) +
    (state.love ?? 0) * 0.5 + (state.money ?? 0) / 200 + (state.energy ?? 0) * 0.1;
}

function getMoneyCost(action) {
  if (!action) return 0;
  if (action.id === 'formarse') return (state?.uniYears ?? 0) < 3 ? 700 : 600;
  return Math.max(0, int(action.moneyCost));
}

/* ---------- persistencia y sonido ---------- */
function loadBest() {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && Number.isFinite(Number(parsed.score)) ? parsed : null;
  } catch {
    return null;
  }
}

function saveBest(record) {
  try { localStorage.setItem(BEST_KEY, JSON.stringify(record)); } catch { /* almacenamiento no disponible */ }
}

function updateBestRecord() {
  const el = $('best-record');
  if (!el) return;
  const best = loadBest();
  if (best?.score) {
    el.textContent = `🏆 Récord: ${best.name ?? 'Alguien'} · ${int(best.score)} pts · ${int(best.age)} años`;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function updateSoundButton() {
  const btn = $('sound-btn');
  if (!btn) return;
  btn.textContent = soundOn ? '🔊' : '🔇';
  btn.setAttribute('aria-label', soundOn ? 'Desactivar sonido' : 'Activar sonido');
}

function ensureAudio() {
  if (ui.audio) return ui.audio;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    ui.audio = new AudioCtor();
    return ui.audio;
  } catch {
    return null;
  }
}

function sfx(kind) {
  if (!soundOn) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const sequences = {
      click: [[520, 0.05, 0, 'triangle']],
      good: [[523, 0.1, 0, 'sine'], [659, 0.1, 0.08, 'sine'], [784, 0.16, 0.16, 'sine']],
      bad: [[220, 0.15, 0, 'sawtooth'], [160, 0.22, 0.12, 'sawtooth']],
      level: [[523, 0.09, 0, 'triangle'], [659, 0.09, 0.08, 'triangle'], [784, 0.09, 0.16, 'triangle'], [1046, 0.18, 0.24, 'triangle']],
      event: [[392, 0.1, 0, 'triangle'], [523, 0.12, 0.09, 'triangle']],
      start: [[392, 0.1, 0, 'sine'], [523, 0.1, 0.09, 'sine'], [659, 0.18, 0.18, 'sine']],
      death: [[392, 0.28, 0, 'sine'], [330, 0.3, 0.2, 'sine'], [262, 0.6, 0.42, 'sine']],
    };
    const sequence = sequences[kind] ?? sequences.click;
    for (const [freq, dur, delay, type] of sequence) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + (delay ?? 0);
      osc.type = type ?? 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.035, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + (dur ?? 0.1));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + (dur ?? 0.1) + 0.03);
    }
  } catch { /* audio opcional */ }
}

/* ---------- feedback ---------- */
function toast(icon, title, detail, kind = '') {
  const host = $('toasts');
  if (!host) return;
  while (host.children.length >= 3) host.firstElementChild?.remove();
  const el = document.createElement('div');
  el.className = `toast${kind === 'warn' ? ' warn' : ''}`;
  const iconEl = document.createElement('span');
  iconEl.className = 'toast-icon';
  iconEl.textContent = icon ?? '✨';
  const body = document.createElement('div');
  const titleEl = document.createElement('b');
  titleEl.textContent = title ?? '';
  const detailEl = document.createElement('span');
  detailEl.textContent = detail ?? '';
  body.append(titleEl, detailEl);
  el.append(iconEl, body);
  host.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 320);
  }, 4200);
}

function addLog(age, icon, text, tone = 'neutral') {
  if (!state) return;
  state.log.unshift({
    age: Math.max(0, int(age ?? state.age)),
    icon: icon ?? '•',
    text: String(text ?? ''),
    tone: ['good', 'bad', 'money', 'milestone'].includes(tone) ? tone : 'neutral',
  });
  if (state.log.length > 60) state.log.length = 60;
}

function pill(text, extra = '') {
  const safeText = String(text ?? '');
  return `<span class="pill ${extra}">${safeText}</span>`;
}

function buildPills(effects) {
  const e = effects && typeof effects === 'object' ? effects : {};
  const parts = [];
  for (const stat of STATS) {
    const delta = int(e[stat.key]);
    if (delta !== 0) parts.push(pill(`${stat.icon} ${delta > 0 ? '+' : '−'}${Math.abs(delta)}`, delta < 0 ? 'neg' : ''));
  }
  const love = int(e.love);
  if (love !== 0) parts.push(pill(`❤️ ${love > 0 ? '+' : '−'}${Math.abs(love)}`, love < 0 ? 'neg' : ''));
  const energy = int(e.energy);
  if (energy !== 0) parts.push(pill(`⚡ ${energy > 0 ? '+' : '−'}${Math.abs(energy)}`, energy < 0 ? 'neg' : 'gold'));
  const money = int(e.money);
  if (money !== 0) parts.push(pill(`${money > 0 ? '+' : '−'}${fmtMoney(Math.abs(money))}`, money < 0 ? 'neg' : 'gold'));
  const xp = int(e.careerXp);
  if (xp !== 0) parts.push(pill(`🚀 +${xp}`, ''));
  if (int(e.kids) > 0) parts.push(pill('👶 +1', ''));
  if (e.partner === true) parts.push(pill('❤️ Pareja', ''));
  if (e.house === true) parts.push(pill('🏠 Casa', 'gold'));
  if (e.degree === true) parts.push(pill('🎓 Título', 'gold'));
  if (e.retired === true) parts.push(pill('🛋️ Jubilación', ''));
  return parts.join('');
}

function buildEventHint(choice, locked = false) {
  const prefix = locked ? `<span class="neg">Necesitás ${fmtMoney(choice?.requires?.money ?? 0)} · </span>` : '';
  if (typeof choice?.hint === 'string' && choice.hint.trim()) return prefix + choice.hint;
  if (Array.isArray(choice?.outcomes) && choice.outcomes.length) return prefix + 'Resultado incierto';
  const eff = choice?.effects ?? {};
  const parts = [];
  for (const stat of STATS) {
    const d = int(eff[stat.key]);
    if (d) parts.push(`<span class="${d < 0 ? 'neg' : 'pos'}">${stat.icon} ${d > 0 ? '+' : '−'}${Math.abs(d)}</span>`);
  }
  const love = int(eff.love);
  if (love) parts.push(`<span class="${love < 0 ? 'neg' : 'pos'}">❤️ ${love > 0 ? '+' : '−'}${Math.abs(love)}</span>`);
  const money = int(eff.money);
  if (money) parts.push(`<span class="${money < 0 ? 'neg' : 'pos'}">${money > 0 ? '+' : '−'}${fmtMoney(Math.abs(money))}</span>`);
  const xp = int(eff.careerXp);
  if (xp) parts.push(`<span class="pos">🚀 +${xp}</span>`);
  if (int(eff.kids) > 0) parts.push('<span class="pos">👶 +1</span>');
  if (eff.partner === true) parts.push('<span class="pos">❤️ Pareja</span>');
  if (eff.house === true) parts.push('<span class="pos">🏠 Casa</span>');
  if (eff.retired === true) parts.push('<span class="pos">🛋️ Jubilación</span>');
  for (const key of ['partner', 'house', 'degree', 'retired']) {
    if (eff[key] === true && !parts.some((p) => p.includes(key))) { /* ya cubierto arriba */ }
  }
  return prefix + (parts.length ? parts.join(' · ') : 'Sin consecuencias visibles');
}

/* ---------- render ---------- */
function buildStatList() {
  const wrap = $('stat-list');
  if (!wrap) return;
  wrap.textContent = '';
  ui.statEls = {};
  for (const stat of STATS) {
    const item = document.createElement('div');
    item.className = 'stat-item';
    const top = document.createElement('div');
    top.className = 'stat-top';
    const name = document.createElement('span');
    name.className = 'stat-name';
    name.textContent = `${stat.icon} ${stat.label}`;
    const value = document.createElement('span');
    value.className = 'stat-value mono';
    value.textContent = '0';
    top.append(name, value);
    const track = document.createElement('div');
    track.className = 'stat-track';
    const fill = document.createElement('div');
    fill.className = `stat-fill ${stat.color}`;
    track.appendChild(fill);
    item.append(top, track);
    wrap.appendChild(item);
    ui.statEls[stat.key] = { item, value, fill };
  }
}

function renderHeader() {
  if (!state) return;
  const ageEl = $('age-big');
  const age = Math.round(state.age ?? 0);
  if (ageEl) {
    if (ui.lastAge !== age && ui.lastAge >= 0) {
      ageEl.classList.remove('pop');
      void ageEl.offsetWidth;
      ageEl.classList.add('pop');
    }
    ageEl.textContent = String(age);
    ui.lastAge = age;
  }
  const stage = stageForAge(age);
  if ($('stage-pill')) $('stage-pill').textContent = stage?.name ?? 'Vida';
  if ($('life-label')) $('life-label').textContent = age <= 0 ? 'Nacimiento' : (stage?.name ?? 'Vida');
  if ($('life-progress')) $('life-progress').style.width = `${clamp(age / 90 * 100)}%`;
  const bar = $('life-progressbar');
  if (bar) bar.setAttribute('aria-valuenow', String(age));
  if ($('money-big')) {
    $('money-big').textContent = fmtMoney(state.money ?? 0);
    $('money-big').classList.toggle('negative', (state.money ?? 0) < 0);
  }
  if ($('turn-num')) $('turn-num').textContent = String(state.turn ?? 1);
}

function renderProfile() {
  if (!state) return;
  const origin = originOf();
  if ($('profile-name')) $('profile-name').textContent = state.name ?? 'Alex';
  if ($('profile-origin')) $('profile-origin').textContent = `${origin?.icon ?? '🌍'} ${origin?.name ?? 'Origen'}`;

  let job = 'Estudiante';
  if ((state.age ?? 0) >= 18) {
    if (state.retired) job = 'Jubilado/a';
    else if ((state.career ?? 0) >= 1) job = careerOf(state.career)?.title ?? 'Trabajando';
    else if (state.degree) job = 'Título en mano';
    else job = 'Buscando trabajo';
  }
  if ($('profile-job')) $('profile-job').textContent = job;

  const chips = $('life-chips');
  if (chips) {
    chips.textContent = '';
    const add = (text) => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.textContent = text;
      chips.appendChild(span);
    };
    if (state.degree) add('🎓 Título');
    if (state.partner) add('❤️ En pareja');
    if ((state.kids ?? 0) > 0) add(`👶 ×${state.kids}`);
    if (state.house) add('🏠 Casa propia');
    if (state.retired) add('🛋️ Jubilado/a');
    if (!chips.children.length) add('🌱 Camino por delante');
  }

  if ($('career-txt')) $('career-txt').textContent = (state.career ?? 0) >= 1 ? (careerOf(state.career)?.title ?? 'Trabajando') : 'Sin empleo';
  if ($('love-txt')) $('love-txt').textContent = state.partner ? 'En pareja' : ((state.love ?? 0) > 0 ? `${Math.round(state.love)}%` : '—');
}

function renderStats() {
  if (!state) return;
  for (const stat of STATS) {
    const el = ui.statEls?.[stat.key];
    if (!el) continue;
    const value = clamp(state.stats?.[stat.key] ?? 0);
    el.fill.style.width = `${value}%`;
    el.value.textContent = String(Math.round(value));
    el.item.classList.toggle('low', value < 25);
  }
  if ($('energy-val')) $('energy-val').textContent = String(Math.round(clamp(state.energy ?? 0)));
  if ($('energy-fill')) $('energy-fill').style.width = `${clamp(state.energy ?? 0)}%`;
}

function renderAvatar() {
  if (!state) return;
  const stage = $('avatar-stage');
  const origin = originOf();
  const age = state.age ?? 0;
  const mind = state.stats?.mind ?? 0;
  const career = state.career ?? 0;
  const happy = state.stats?.happy ?? 0;
  const health = state.stats?.health ?? 0;

  if (stage) {
    stage.style.setProperty('--skin', origin?.skin ?? '#f0c09a');
    stage.style.setProperty('--hair', age >= 60 ? '#cbd5e1' : (origin?.hair ?? '#2b2118'));
    stage.style.setProperty('--outfit', (() => {
      if (age < 12) return '#2dd4bf';
      if (age < 18) return '#38bdf8';
      if (state.retired) return '#a78bfa';
      if (career >= 4) return '#334155';
      return origin?.outfit ?? '#2dd4bf';
    })());
    stage.style.setProperty('--pants', age >= 18 ? '#1e293b' : (origin?.pants ?? '#22304d'));
  }

  const scale = age < 6 ? 0.74 : age < 12 ? 0.82 : age < 18 ? 0.9 : age < 60 ? 1 : age < 75 ? 0.95 : 0.9;
  $('avatar-scale')?.setAttribute('transform', `translate(110 285) scale(${scale}) translate(-110 -285)`);
  const rotation = age >= 80 ? -4 : age >= 70 ? -2 : 0;
  $('avatar-posture')?.setAttribute('transform', `rotate(${rotation} 110 285)`);

  const toggle = (id, show) => $(id)?.classList.toggle('hidden', !show);
  const babyHair = age < 5;
  const oldHair = age >= 60;
  toggle('hair-baby', babyHair);
  toggle('hair-full', !babyHair && !oldHair);
  toggle('hair-old', oldHair);
  toggle('glasses', mind >= 70 && age >= 12);
  toggle('tie', career >= 3 && age >= 18 && !state.retired);
  toggle('necklace', (state.money ?? 0) >= 25000);
  toggle('cane', age >= 72);
  toggle('badge', career >= 6);

  const mouth = $('mouth');
  if (mouth) {
    if (happy >= 70) mouth.setAttribute('d', 'M96 108 Q110 124 124 108');
    else if (happy >= 40) mouth.setAttribute('d', 'M96 110 Q110 120 124 110');
    else mouth.setAttribute('d', 'M98 116 Q110 104 122 116');
  }
  const mood = $('mood-bubble');
  if (mood) {
    mood.textContent = health < 22 ? '🤒' : happy >= 75 ? '😄' : happy >= 50 ? '🙂' : happy >= 30 ? '😐' : '😟';
  }
}

function renderGoals() {
  if (!state) return;
  const list = $('goals-list');
  if (!list) return;
  list.textContent = '';
  let done = 0;
  for (const goal of GOALS) {
    let reached = false;
    try { reached = Boolean(goal?.test?.(state)); } catch { reached = false; }
    if (reached) done += 1;
    const li = document.createElement('li');
    li.className = `goal${reached ? ' done' : ''}`;
    const icon = document.createElement('span');
    icon.className = 'goal-icon';
    icon.textContent = goal?.icon ?? '🎯';
    const body = document.createElement('div');
    body.className = 'goal-body';
    const name = document.createElement('span');
    name.className = 'goal-name';
    name.textContent = goal?.name ?? 'Meta';
    const desc = document.createElement('span');
    desc.className = 'goal-desc';
    desc.textContent = goal?.desc ?? '';
    body.append(name, desc);
    const check = document.createElement('span');
    check.className = 'goal-check';
    check.textContent = '✓';
    li.append(icon, body, check);
    list.appendChild(li);
  }
  if ($('goals-count')) $('goals-count').textContent = `${done}/${GOALS.length}`;
}

function renderLog() {
  if (!state) return;
  const log = $('log');
  if (!log) return;
  log.textContent = '';
  for (const entry of (state.log ?? []).slice(0, 40)) {
    const row = document.createElement('div');
    row.className = `log-entry ${entry?.tone ?? 'neutral'}`;
    const age = document.createElement('span');
    age.className = 'log-age';
    age.textContent = `${int(entry?.age)}a`;
    const icon = document.createElement('span');
    icon.className = 'log-icon';
    icon.textContent = entry?.icon ?? '•';
    const text = document.createElement('span');
    text.className = 'log-text';
    text.textContent = entry?.text ?? '';
    row.append(age, icon, text);
    log.appendChild(row);
  }
}

function renderActions() {
  if (!state) return;
  const stage = stageForAge(state.age);
  const list = ACTIONS?.[stage?.id] ?? ACTIONS.infancia ?? [];
  const wrap = $('actions');
  if (!wrap) return;
  wrap.textContent = '';
  const years = turnYears(state.age);
  if ($('choice-title')) {
    $('choice-title').textContent = years > 1
      ? `¿Qué hace ${state.name} en los próximos ${years} años?`
      : `¿Qué hace ${state.name} este año?`;
  }
  if ($('years-chip')) $('years-chip').textContent = `+${years} año${years > 1 ? 's' : ''}`;

  const note = STAGE_NOTES?.[stage?.id] ?? STAGE_NOTES?.infancia;
  if ($('stage-note-icon')) $('stage-note-icon').textContent = stage?.icon ?? '🌱';
  if ($('stage-note-title')) $('stage-note-title').textContent = note?.title ?? (stage?.name ?? 'Vida');
  if ($('stage-note-text')) $('stage-note-text').textContent = note?.text ?? '';

  list.forEach((action, index) => {
    const costMoney = getMoneyCost(action);
    const energy = Math.max(0, int(action?.energy));
    const canEnergy = (state.energy ?? 0) >= energy;
    const canMoney = (state.money ?? 0) >= costMoney;
    const disabled = Boolean(state.busy || state.over || state.currentEvent || !canEnergy || !canMoney);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'action-card';
    btn.disabled = disabled;
    btn.dataset.actionId = action?.id ?? '';
    const costLabel = costMoney > 0 ? `-${fmtMoney(costMoney)} · ⚡${energy}` : `⚡${energy}`;
    const pills = buildPills(action?.effects);
    const lock = !canEnergy ? 'Sin energía' : !canMoney ? 'Falta dinero' : '';
    btn.innerHTML = `
      <span class="action-top">
        <span class="action-icon">${action?.icon ?? '✨'}</span>
        <span class="action-cost${costMoney > 0 ? ' money' : ''}">${costLabel}</span>
      </span>
      <span class="action-title">${action?.title ?? 'Acción'}</span>
      <span class="action-desc">${action?.desc ?? ''}</span>
      <span class="action-pills">${pills}</span>
      ${lock ? `<span class="action-lock">${lock}</span>` : ''}
    `;
    btn.addEventListener('click', () => doAction(action?.id));
    wrap.appendChild(btn);
    btn.dataset.index = String(index);
  });
}

function renderAll() {
  if (!state) return;
  renderHeader();
  renderProfile();
  renderStats();
  renderAvatar();
  renderGoals();
  renderActions();
  renderLog();
}

/* ---------- estado y efectos ---------- */
function createState(name, originId) {
  const origin = ORIGINS[originId] ?? ORIGINS.calle;
  return {
    name: String(name || 'Alex').slice(0, 14),
    originId: origin.id,
    age: 0,
    stageId: 'infancia',
    stats: { ...(origin.stats ?? { health: 60, mind: 50, social: 50, happy: 50 }) },
    energy: 80,
    money: Math.max(0, int(origin.money)),
    career: 0,
    careerXp: 0,
    love: 0,
    partner: false,
    kids: 0,
    house: false,
    degree: false,
    uniYears: 0,
    retired: false,
    actions: 0,
    turn: 1,
    log: [],
    achievements: [],
    usedEvents: [],
    eventStreak: 0,
    busy: false,
    over: false,
    currentEvent: null,
    totalEarned: 0,
    lowHealthWarned: false,
  };
}

function gainCareerXp(amount) {
  if (!state) return [];
  const gain = Math.max(0, int(amount));
  if (gain <= 0) return [];
  state.careerXp = int(state.careerXp) + gain;
  if ((state.career ?? 0) < 1) state.career = 1;
  const promotions = [];
  let guard = 0;
  while ((state.career ?? 0) < 6 && guard < 8) {
    const needed = CAREER_XP[state.career] ?? Infinity;
    if (state.careerXp < needed) break;
    state.career += 1;
    promotions.push(careerOf(state.career));
    addLog(state.age, '🏷️', `Ascenso: ahora sos ${careerOf(state.career).title}.`, 'milestone');
    toast('🏷️', `Ascenso: ${careerOf(state.career).title}`, 'Tu carrera subió un nivel.');
    sfx('level');
    guard += 1;
  }
  return promotions;
}

function applyEffects(effects) {
  if (!state || !effects || typeof effects !== 'object') return;
  const s = state.stats ?? {};
  for (const key of ['health', 'mind', 'social', 'happy']) {
    if (typeof effects[key] === 'number') s[key] = clamp(s[key] + effects[key]);
  }
  state.stats = s;
  if (typeof effects.energy === 'number') state.energy = clamp(state.energy + effects.energy);
  if (typeof effects.love === 'number') state.love = clamp(state.love + effects.love);
  if (typeof effects.money === 'number') {
    const delta = int(effects.money);
    state.money = Math.max(0, int(state.money) + delta);
    if (delta > 0) state.totalEarned = int(state.totalEarned) + delta;
  }
  if (typeof effects.careerXp === 'number') gainCareerXp(effects.careerXp);
  if (typeof effects.kids === 'number') state.kids = Math.max(0, Math.min(5, int(state.kids) + int(effects.kids)));
  if (effects.partner === true) state.partner = true;
  if (effects.house === true) state.house = true;
  if (effects.degree === true) state.degree = true;
  if (effects.retired === true) state.retired = true;
}

function checkAchievements() {
  if (!state) return;
  const score = computeScore();
  for (const achievement of ACHIEVEMENTS) {
    if (!achievement?.id || state.achievements.includes(achievement.id)) continue;
    let unlocked = false;
    try { unlocked = Boolean(achievement.test?.(state, score)); } catch { unlocked = false; }
    if (unlocked) {
      state.achievements.push(achievement.id);
      toast(achievement.icon ?? '🏅', achievement.name ?? 'Logro', achievement.desc ?? '', '');
      sfx('level');
    }
  }
}

/* ---------- turnos ---------- */
function advanceYears(years) {
  if (!state) return;
  const y = Math.max(1, int(years, 1));
  const startAge = int(state.age);
  const incomePerYear = startAge + 1 >= 18
    ? (state.retired ? Math.max(700, Math.round(salaryPerYear() * 0.42)) : salaryPerYear())
    : 0;
  const costsPerYear = startAge + 1 >= 18
    ? (600 + (state.partner ? 300 : 0) + int(state.kids) * 350 + (state.house ? 400 : 0))
    : 0;
  let income = 0;
  let costs = 0;

  for (let i = 0; i < y; i += 1) {
    state.age = Math.min(90, int(state.age) + 1);
    const age = state.age;
    const decay = age < 30 ? 0 : age < 45 ? 1 : age < 60 ? 2 : age < 75 ? 3 : 4;
    if (decay > 0) state.stats.health = clamp((state.stats?.health ?? 0) - decay);
    if (age >= 18) state.stats.social = clamp((state.stats?.social ?? 0) - 1);
    if (age >= 25) state.stats.happy = clamp((state.stats?.happy ?? 0) - 1);
    if ((state.stats?.health ?? 0) < 25) state.stats.happy = clamp((state.stats?.happy ?? 0) - 1);
    if (age >= 18) { income += incomePerYear; costs += costsPerYear; }

    if (!state.retired && age >= 65 && (state.career ?? 0) >= 1) {
      state.retired = true;
      addLog(65, '🛋️', 'Se jubiló después de años de trabajo.', 'milestone');
    }

    const stage = stageForAge(age);
    if (stage?.id && stage.id !== state.stageId) {
      state.stageId = stage.id;
      addLog(age, stage.icon ?? '🌱', `Nueva etapa: ${stage.name}.`, 'milestone');
      sfx('level');
    }

    if ((state.stats?.health ?? 0) < 20 && !state.lowHealthWarned) {
      state.lowHealthWarned = true;
      addLog(age, '🚨', 'La salud está en rojo. Cuidate o esto termina antes.', 'bad');
    }
    state.stageId = stageForAge(state.age).id;
  }

  state.money = Math.max(0, int(state.money) + income - costs);
  if (income > 0) state.totalEarned = int(state.totalEarned) + income;
  if (income < costs && (state.money ?? 0) <= 0) {
    state.stats.happy = clamp((state.stats?.happy ?? 0) - 2);
    addLog(state.age, '💸', 'Las cuentas no cierran: deudas y estrés.', 'bad');
  }
  state.energy = clamp((state.energy ?? 0) + 12);
}

function resolveAction(action) {
  if (!state || !action) return { text: '', effects: {} };
  if (action.id === 'trabajar') {
    if ((state.career ?? 0) < 1) {
      state.career = 1;
      state.careerXp = 0;
      const bonus = Math.round(salaryPerYear() * 0.35);
      addLog(state.age, '💼', `Consiguió su primer empleo como ${careerOf(1).title}.`, 'milestone');
      toast('💼', 'Primer empleo', `Entró como ${careerOf(1).title}.`);
      sfx('level');
      return {
        effects: { money: bonus, happy: -1, health: -1 },
        text: `Lo contrataron como ${careerOf(1).title}. Primer sueldo: ${fmtMoney(bonus)}.`,
        tone: 'good',
      };
    }
    const promotions = gainCareerXp(1);
    const bonus = Math.round(salaryPerYear() * 0.45);
    const promotion = promotions?.[promotions.length - 1];
    return {
      effects: { money: bonus, happy: -2, health: -1 },
      text: promotion
        ? `Trabajó duro y ascendió a ${promotion.title}. Bonus: ${fmtMoney(bonus)}.`
        : `Trabajó todo el año. Bonus: ${fmtMoney(bonus)}.`,
      tone: promotion ? 'milestone' : 'money',
    };
  }

  if (action.id === 'formarse') {
    state.uniYears = int(state.uniYears) + 1;
    const effects = { mind: 8, happy: 1 };
    let text = 'Se formó, estudió y sumó herramientas nuevas.';
    let tone = 'good';
    if (state.uniYears >= 3 && !state.degree) {
      state.degree = true;
      effects.happy += 6;
      effects.mind += 2;
      text = 'Se recibió. Años de esfuerzo y un título en la pared.';
      tone = 'milestone';
      addLog(state.age, '🎓', 'Se recibió. Título en mano.', 'milestone');
      toast('🎓', 'Título en mano', 'Terminó su formación.');
      sfx('level');
    } else if (state.degree) {
      effects.mind = 6;
      text = 'Hizo un posgrado y siguió especializándose.';
    }
    return { effects, text, tone };
  }

  if (action.id === 'familia') {
    if (state.partner) {
      const text = (state.kids ?? 0) > 0
        ? 'Compartió sobremesas, tareas y risas con su familia.'
        : 'Le hizo lugar a su pareja: tiempo, charlas y planes.';
      return { effects: action.effects ?? {}, text, tone: 'good' };
    }
    return {
      effects: action.effects ?? {},
      text: 'Salió a conocer gente y se permitió disfrutar.',
      tone: 'good',
    };
  }

  return { effects: action.effects ?? {}, text: action.log ?? `${action.title}.`, tone: 'neutral' };
}

function doAction(actionId) {
  if (!state || state.busy || state.over || state.currentEvent) return;
  const stage = stageForAge(state.age);
  const action = (ACTIONS?.[stage?.id] ?? []).find((candidate) => candidate?.id === actionId);
  if (!action) return;
  const energyCost = Math.max(0, int(action.energy));
  const moneyCost = getMoneyCost(action);
  if ((state.energy ?? 0) < energyCost) {
    toast('⚡', 'Sin energía', 'Usá Descansar para recuperar fuerzas.', 'warn');
    sfx('bad');
    return;
  }
  if ((state.money ?? 0) < moneyCost) {
    toast('💸', 'Falta dinero', `Necesitás ${fmtMoney(moneyCost)}.`, 'warn');
    sfx('bad');
    return;
  }

  state.busy = true;
  state.actions = int(state.actions) + 1;
  state.turn = int(state.turn) + 1;
  state.energy = clamp((state.energy ?? 0) - energyCost);
  if (moneyCost > 0) state.money = Math.max(0, int(state.money) - moneyCost);

  const resolved = resolveAction(action) ?? {};
  applyEffects(resolved.effects ?? {});
  addLog(state.age, action.icon ?? '✨', resolved.text ?? action.log ?? action.title, resolved.tone ?? 'neutral');
  renderAll();
  advanceYears(turnYears(state.age));
  checkAchievements();
  renderAll();
  sfx(resolved.tone === 'milestone' ? 'level' : 'click');

  const event = maybeEvent();
  if (event) {
    openEvent(event);
  } else {
    state.busy = false;
    checkEnd();
  }
}

function restTurn() {
  if (!state || state.busy || state.over || state.currentEvent) return;
  state.busy = true;
  state.actions = int(state.actions) + 1;
  state.turn = int(state.turn) + 1;
  applyEffects({ energy: 30, health: 3, happy: 1 });
  addLog(state.age, '😴', 'Se tomó un año para descansar y recuperar fuerzas.', 'neutral');
  renderAll();
  advanceYears(turnYears(state.age));
  checkAchievements();
  renderAll();
  sfx('click');
  const event = maybeEvent();
  if (event) {
    openEvent(event);
  } else {
    state.busy = false;
    checkEnd();
  }
}

/* ---------- eventos ---------- */
function maybeEvent() {
  if (!state) return null;
  const stage = stageForAge(state.age);
  const pool = (EVENTS ?? []).filter((event) => {
    if (!Array.isArray(event?.stages) || !event.stages.includes(stage?.id)) return false;
    if (state.usedEvents.includes(event.id)) return false;
    if (typeof event.condition === 'function') {
      try { return Boolean(event.condition(state)); } catch { return false; }
    }
    return true;
  });
  if (!pool.length) return null;
  if (state.eventStreak < 2 && Math.random() > 0.55) {
    state.eventStreak += 1;
    return null;
  }
  const event = pool[Math.floor(Math.random() * pool.length)];
  state.usedEvents.push(event.id);
  state.eventStreak = 0;
  return event;
}

function openEvent(event) {
  if (!state || !event) return;
  state.currentEvent = { event, resolved: false, choiceIndex: null };
  state.busy = true;
  const stage = stageForAge(state.age);
  if ($('event-icon')) $('event-icon').textContent = event.icon ?? '🎲';
  if ($('event-kicker')) $('event-kicker').textContent = `EVENTO · ${(stage?.name ?? 'VIDA').toUpperCase()}`;
  if ($('event-title')) $('event-title').textContent = event.title ?? 'Un evento de vida';
  if ($('event-text')) $('event-text').textContent = event.text ?? '';
  const result = $('event-result');
  if (result) { result.classList.add('hidden'); result.className = 'event-result hidden'; }
  const choices = $('event-choices');
  if (choices) choices.classList.remove('hidden');
  renderEventChoices(event);
  $('event-modal')?.classList.remove('hidden');
  sfx('event');
  setTimeout(() => {
    const first = $('event-choices')?.querySelector('.event-choice:not([disabled])');
    first?.focus?.();
  }, 60);
}

function renderEventChoices(event) {
  const wrap = $('event-choices');
  if (!wrap) return;
  wrap.textContent = '';
  const choices = Array.isArray(event?.choices) ? event.choices : [];
  choices.forEach((choice, index) => {
    const required = Math.max(0, int(choice?.requires?.money));
    const locked = required > (state?.money ?? 0);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'event-choice';
    btn.disabled = locked;
    const num = document.createElement('span');
    num.className = 'event-choice-num';
    num.textContent = String(index + 1);
    const body = document.createElement('span');
    body.className = 'event-choice-body';
    const label = document.createElement('span');
    label.className = 'event-choice-label';
    label.textContent = choice?.label ?? 'Elegir';
    const hint = document.createElement('span');
    hint.className = 'event-choice-hint';
    hint.innerHTML = buildEventHint(choice, locked);
    body.append(label, hint);
    btn.append(num, body);
    btn.addEventListener('click', () => chooseEvent(index));
    wrap.appendChild(btn);
  });
}

function chooseEvent(index) {
  if (!state?.currentEvent || state.currentEvent.resolved) return;
  const event = state.currentEvent.event;
  const choice = event?.choices?.[index];
  if (!choice) return;
  const required = Math.max(0, int(choice?.requires?.money));
  if (required > (state.money ?? 0)) {
    toast('💸', 'No te alcanza', `Necesitás ${fmtMoney(required)}.`, 'warn');
    return;
  }

  let outcome = null;
  if (Array.isArray(choice.outcomes) && choice.outcomes.length) {
    const roll = Math.random();
    let acc = 0;
    for (const candidate of choice.outcomes) {
      acc += Math.max(0, Number(candidate?.p) || 0);
      if (roll <= acc) { outcome = candidate; break; }
    }
    outcome = outcome ?? choice.outcomes[choice.outcomes.length - 1];
  } else {
    outcome = { effects: choice.effects ?? {}, result: choice.result ?? '' };
  }

  const before = lifeValue();
  applyEffects(outcome?.effects ?? {});
  const after = lifeValue();
  const tone = after - before > 1.5 ? 'good' : after - before < -1.5 ? 'bad' : 'neutral';
  state.currentEvent.resolved = true;
  state.currentEvent.choiceIndex = index;

  addLog(state.age, event?.icon ?? '🎲', `${event?.title ?? 'Evento'}: ${outcome?.result ?? 'La vida siguió.'}`, tone);
  checkAchievements();
  renderAll();

  const resultBox = $('event-result');
  const resultText = $('event-result-text');
  if (resultText) resultText.textContent = outcome?.result ?? 'La vida siguió su curso.';
  if (resultBox) {
    resultBox.className = `event-result${tone === 'good' ? ' good' : tone === 'bad' ? ' bad' : ''}`;
    resultBox.classList.remove('hidden');
  }
  $('event-choices')?.classList.add('hidden');
  sfx(tone === 'bad' ? 'bad' : 'good');
  setTimeout(() => $('event-continue')?.focus?.(), 60);
}

function continueEvent() {
  if (!state?.currentEvent?.resolved) return;
  $('event-modal')?.classList.add('hidden');
  state.currentEvent = null;
  state.busy = false;
  renderAll();
  checkEnd();
}

/* ---------- final ---------- */
function checkEnd() {
  if (!state) return false;
  if (state.over) return true;
  if ((state.stats?.health ?? 0) <= 0 || (state.age ?? 0) >= 90) {
    endGame();
    return true;
  }
  return false;
}

function buildEpitaph(score) {
  if (!state) return '';
  const stats = state.stats ?? {};
  const options = [
    { key: 'happy', text: 'Encontró motivos para sonreír casi todos los días.' },
    { key: 'social', text: 'Nunca le faltó con quién compartir una mesa.' },
    { key: 'mind', text: 'Pensó mucho. Y vivió más.' },
    { key: 'health', text: 'Llegó lejos con el cuerpo entero.' },
  ];
  options.sort((a, b) => (stats[b.key] ?? 0) - (stats[a.key] ?? 0));
  let text = options[0]?.text ?? 'Vivió a su manera.';
  if ((state.kids ?? 0) > 0) text += ' Crio a su gente con más amor que paciencia.';
  if ((state.career ?? 0) >= 5) text += ' Dejó huella en lo que hizo.';
  if (state.house) text += ' Tuvo un techo y lo llenó de vida.';
  if (state.partner) text += ' No caminó solo.';
  if (score >= 840) text += ' Su historia se cuenta en el barrio.';
  return `“${text}”`;
}

function renderEnd() {
  if (!state) return;
  const score = computeScore();
  const rank = getRank(score);
  const died = (state.stats?.health ?? 0) <= 0;
  if ($('end-kicker')) $('end-kicker').textContent = died ? 'FIN DEL CAMINO' : 'VIDA COMPLETA';
  if ($('end-title')) $('end-title').textContent = `La vida de ${state.name}`;
  if ($('end-dates')) $('end-dates').textContent = died ? `0 — ${state.age} años · Salud agotada` : `0 — ${state.age} años · Historia completa`;
  if ($('end-epitaph')) $('end-epitaph').textContent = buildEpitaph(score);
  if ($('end-score')) $('end-score').textContent = String(score);
  if ($('end-rank')) $('end-rank').textContent = rank?.name ?? 'Vida';
  if ($('end-rank-icon')) $('end-rank-icon').textContent = rank?.icon ?? '🌱';
  if ($('end-summary')) $('end-summary').textContent = rank?.sub ?? '';
  const ring = $('score-ring');
  if (ring) ring.style.setProperty('--pct', String(clamp(score / 11, 0, 100)));

  const statsWrap = $('end-stats');
  if (statsWrap) {
    statsWrap.textContent = '';
    for (const stat of STATS) {
      const cell = document.createElement('div');
      cell.className = 'end-stat';
      const label = document.createElement('span');
      label.textContent = `${stat.icon} ${stat.label}`;
      const value = document.createElement('strong');
      value.textContent = String(Math.round(clamp(state.stats?.[stat.key] ?? 0)));
      cell.append(label, value);
      statsWrap.appendChild(cell);
    }
  }

  const extras = $('end-extras');
  if (extras) {
    extras.textContent = '';
    const add = (text) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = text;
      extras.appendChild(chip);
    };
    add(`💰 ${fmtMoney(state.money ?? 0)}`);
    add(`💼 ${state.retired ? 'Jubilado/a' : ((state.career ?? 0) >= 1 ? careerOf(state.career)?.title : 'Sin empleo')}`);
    add(`❤️ ${state.partner ? 'En pareja' : `${Math.round(state.love ?? 0)}% de amor`}`);
    if ((state.kids ?? 0) > 0) add(`👶 ${state.kids} hijo${state.kids > 1 ? 's' : ''}`);
    if (state.house) add('🏠 Casa propia');
    if (state.degree) add('🎓 Título');
    add(`📈 ${fmtMoney(state.totalEarned ?? 0)} ganados en total`);
  }

  const achWrap = $('end-achievements');
  if (achWrap) {
    achWrap.textContent = '';
    for (const achievement of ACHIEVEMENTS) {
      const unlocked = state.achievements.includes(achievement.id);
      const cell = document.createElement('div');
      cell.className = `end-ach${unlocked ? '' : ' locked'}`;
      const icon = document.createElement('span');
      icon.className = 'end-ach-icon';
      icon.textContent = achievement.icon ?? '🏅';
      const body = document.createElement('div');
      body.className = 'end-ach-body';
      const name = document.createElement('span');
      name.className = 'end-ach-name';
      name.textContent = achievement.name ?? 'Logro';
      const desc = document.createElement('span');
      desc.className = 'end-ach-desc';
      desc.textContent = unlocked ? (achievement.desc ?? '') : 'Todavía no desbloqueado';
      body.append(name, desc);
      cell.append(icon, body);
      achWrap.appendChild(cell);
    }
  }
  if ($('end-ach-count')) $('end-ach-count').textContent = `${state.achievements.length}/${ACHIEVEMENTS.length}`;

  const previousBest = loadBest();
  const isRecord = !previousBest || score > int(previousBest.score);
  if (isRecord) saveBest({ name: state.name, age: state.age, score, date: new Date().toISOString() });
  if ($('end-best')) {
    const best = loadBest();
    $('end-best').textContent = isRecord
      ? `🏆 ¡Nuevo récord personal! ${score} puntos.`
      : `🏆 Récord personal: ${int(best?.score)} puntos (${best?.name ?? 'alguien'}).`;
  }
}

function endGame() {
  if (!state || state.over) return;
  state.over = true;
  state.busy = false;
  state.currentEvent = null;
  $('event-modal')?.classList.add('hidden');
  checkAchievements();
  renderEnd();
  $('screen-game')?.classList.add('hidden');
  $('screen-start')?.classList.add('hidden');
  $('end-screen')?.classList.remove('hidden');
  $('reset-btn')?.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  sfx('death');
}

/* ---------- flujo de pantallas ---------- */
function initGame(name, originId) {
  state = createState(name, originId);
  ui.lastAge = -1;
  $('screen-start')?.classList.add('hidden');
  $('end-screen')?.classList.add('hidden');
  $('screen-game')?.classList.remove('hidden');
  $('event-modal')?.classList.add('hidden');
  $('reset-btn')?.classList.remove('hidden');
  buildStatList();
  addLog(0, '👶', `Nació ${state.name}. Origen: ${originOf().name}.`, 'milestone');
  addLog(0, '✨', 'Una vida nueva empieza. Cada decisión cuenta.', 'neutral');
  renderAll();
  updateBestRecord();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  sfx('start');
}

function showStart() {
  state = null;
  $('screen-game')?.classList.add('hidden');
  $('end-screen')?.classList.add('hidden');
  $('event-modal')?.classList.add('hidden');
  $('screen-start')?.classList.remove('hidden');
  $('reset-btn')?.classList.add('hidden');
  updateBestRecord();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shareStory() {
  if (!state) return;
  const score = computeScore();
  const rank = getRank(score);
  const text = [
    '🧬 HUMAN.SIM',
    `${state.name} vivió ${state.age} años.`,
    `Legado: ${score} pts · ${rank?.name ?? ''}`,
    `Salud ${Math.round(state.stats?.health ?? 0)} · Mente ${Math.round(state.stats?.mind ?? 0)} · Social ${Math.round(state.stats?.social ?? 0)} · Felicidad ${Math.round(state.stats?.happy ?? 0)}`,
    `Logros: ${state.achievements.length}/${ACHIEVEMENTS.length}`,
  ].join('\n');
  const fallback = () => {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      toast('📋', 'Historia copiada', 'Pegala donde quieras.');
    } catch {
      toast('⚠️', 'No se pudo copiar', 'Tu navegador bloqueó el portapapeles.', 'warn');
    }
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => toast('📋', 'Historia copiada', 'Pegala donde quieras.')).catch(fallback);
  } else {
    fallback();
  }
}

/* ---------- wiring ---------- */
function selectOrigin(originId) {
  if (!ORIGINS[originId]) return;
  selectedOrigin = originId;
  document.querySelectorAll('.origin').forEach((btn) => {
    const selected = btn?.dataset?.origin === originId;
    btn.classList.toggle('is-selected', selected);
    btn.setAttribute('aria-checked', selected ? 'true' : 'false');
  });
  sfx('click');
}

function wireEvents() {
  document.querySelectorAll('.origin').forEach((btn) => {
    btn.addEventListener('click', () => selectOrigin(btn?.dataset?.origin ?? 'calle'));
  });

  $('start-btn')?.addEventListener('click', () => {
    const rawName = $('name-input')?.value ?? '';
    const name = rawName.trim().slice(0, 14) || 'Alex';
    initGame(name, selectedOrigin);
  });

  $('name-input')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') $('start-btn')?.click();
  });

  $('rest-btn')?.addEventListener('click', restTurn);
  $('event-continue')?.addEventListener('click', continueEvent);
  $('again-btn')?.addEventListener('click', () => {
    const name = state?.name ?? 'Alex';
    const origin = state?.originId ?? 'calle';
    initGame(name, origin);
  });
  $('share-btn')?.addEventListener('click', shareStory);

  $('reset-btn')?.addEventListener('click', () => {
    const midGame = Boolean(state && !state.over && int(state.actions) > 0);
    if (midGame && !window.confirm('¿Empezar una vida nueva? Se perderá esta partida.')) return;
    showStart();
  });

  $('sound-btn')?.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0'); } catch { /* opcional */ }
    updateSoundButton();
    if (soundOn) sfx('click');
  });

  document.addEventListener('keydown', (event) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    const modalOpen = !$('event-modal')?.classList.contains('hidden');
    if (modalOpen) {
      const resultVisible = !$('event-result')?.classList.contains('hidden');
      if (resultVisible) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); continueEvent(); }
        return;
      }
      const n = Number(event.key);
      if (Number.isInteger(n) && n >= 1 && n <= 9) {
        const buttons = $('event-choices')?.querySelectorAll('.event-choice') ?? [];
        const target = buttons[n - 1];
        if (target && !target.disabled) target.click();
      }
      return;
    }
    if ($('screen-game')?.classList.contains('hidden')) return;
    const n = Number(event.key);
    if (Number.isInteger(n) && n >= 1 && n <= 9) {
      const cards = $('actions')?.querySelectorAll('.action-card') ?? [];
      const target = cards[n - 1];
      if (target && !target.disabled) target.click();
    }
  });

  try { soundOn = localStorage.getItem(SOUND_KEY) === '1'; } catch { soundOn = false; }
  updateSoundButton();
  updateBestRecord();
  selectOrigin('calle');
}

wireEvents();
