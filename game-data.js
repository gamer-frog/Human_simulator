'use strict';

/* ============================================================
   HUMAN.SIM — datos del juego (orígenes, acciones, logros)
   ============================================================ */

const ORIGINS = {
  calle: {
    id: 'calle',
    name: 'Barrio Unido',
    icon: '🏙️',
    desc: 'Comunidad fuerte, bolsillo corto.',
    money: 150,
    stats: { health: 68, mind: 48, social: 72, happy: 64 },
    salaryMult: 1,
    skin: '#d9a06e',
    hair: '#2b2118',
    outfit: '#2dd4bf',
    pants: '#22304d',
  },
  media: {
    id: 'media',
    name: 'Clase Media',
    icon: '🏡',
    desc: 'Estabilidad, techo y libros.',
    money: 1200,
    stats: { health: 62, mind: 58, social: 56, happy: 58 },
    salaryMult: 1.1,
    skin: '#f0c09a',
    hair: '#3a2a1e',
    outfit: '#60a5fa',
    pants: '#27334f',
  },
  dorada: {
    id: 'dorada',
    name: 'Cuna Dorada',
    icon: '🏛️',
    desc: 'Contactos, apellido y expectativas.',
    money: 6000,
    stats: { health: 55, mind: 52, social: 48, happy: 52 },
    salaryMult: 1.25,
    skin: '#f7d3b0',
    hair: '#1f1a17',
    outfit: '#a78bfa',
    pants: '#2a2440',
  },
};

const STAGES = [
  { id: 'infancia', name: 'Infancia', min: 0, max: 11, icon: '🧸' },
  { id: 'adolescencia', name: 'Adolescencia', min: 12, max: 17, icon: '🎧' },
  { id: 'juventud', name: 'Juventud', min: 18, max: 29, icon: '🔥' },
  { id: 'adultez', name: 'Adultez', min: 30, max: 59, icon: '💼' },
  { id: 'vejez', name: 'Vejez', min: 60, max: 200, icon: '🍂' },
];

const CAREER = [
  { level: 0, title: 'Sin empleo', salary: 0 },
  { level: 1, title: 'Becario/a', salary: 900 },
  { level: 2, title: 'Junior', salary: 1800 },
  { level: 3, title: 'Semi senior', salary: 3200 },
  { level: 4, title: 'Senior', salary: 5200 },
  { level: 5, title: 'Director/a', salary: 8000 },
  { level: 6, title: 'CEO', salary: 12000 },
];

/* total XP needed to leave each level */
const CAREER_XP = { 1: 2, 2: 4, 3: 7, 4: 11, 5: 16 };

const STAT_META = {
  health: { icon: '❤️', label: 'Salud' },
  mind: { icon: '🧠', label: 'Mente' },
  social: { icon: '💬', label: 'Social' },
  happy: { icon: '😊', label: 'Felicidad' },
};

const STATS = [
  { key: 'health', label: 'Salud', icon: '❤️', color: 'health' },
  { key: 'mind', label: 'Mente', icon: '🧠', color: 'mind' },
  { key: 'social', label: 'Social', icon: '💬', color: 'social' },
  { key: 'happy', label: 'Felicidad', icon: '😊', color: 'happy' },
];

const ACTIONS = {
  infancia: [
    {
      id: 'estudiar',
      icon: '📚',
      title: 'Estudiar',
      desc: 'Deberes, preguntas y algo nuevo cada día.',
      energy: 14,
      effects: { mind: 6, happy: -1 },
      log: 'Pasó el año entre libros, tareas y preguntas.',
    },
    {
      id: 'jugar',
      icon: '⚽',
      title: 'Jugar afuera',
      desc: 'Correr hasta que se haga de noche.',
      energy: 16,
      effects: { health: 5, social: 5, happy: 4 },
      log: 'Jugó afuera hasta que se hizo de noche.',
    },
    {
      id: 'leer',
      icon: '📖',
      title: 'Leer historias',
      desc: 'Mundos enteros en pocas páginas.',
      energy: 8,
      effects: { mind: 4, happy: 3 },
      log: 'Devoró historias y se imaginó otros mundos.',
    },
    {
      id: 'ayudar',
      icon: '🧹',
      title: 'Ayudar en casa',
      desc: 'Una mano extra y unas monedas para el bolsillo.',
      energy: 10,
      effects: { social: 3, happy: 1, money: 40 },
      log: 'Ayudó en casa y se ganó unas monedas.',
    },
  ],

  adolescencia: [
    {
      id: 'estudiar',
      icon: '📚',
      title: 'Estudiar',
      desc: 'Exámenes, apuntes y futuro en juego.',
      energy: 16,
      effects: { mind: 7, happy: -2 },
      log: 'Estudió con sacrificio y la cabeza en el futuro.',
    },
    {
      id: 'entrenar',
      icon: '🏃',
      title: 'Entrenar',
      desc: 'Deporte, equipo y energía de sobra.',
      energy: 16,
      effects: { health: 7, happy: 2, social: 2 },
      log: 'Entrenó, se movió y se sintió imparable.',
    },
    {
      id: 'amigos',
      icon: '🎉',
      title: 'Salir con amigos',
      desc: 'Risas, música y alguna que otra metida de pata.',
      energy: 14,
      moneyCost: 80,
      effects: { social: 8, happy: 5, love: 4 },
      log: 'Salió con amigos y volvió con la cabeza liviana.',
    },
    {
      id: 'verano',
      icon: '💼',
      title: 'Trabajo de verano',
      desc: 'Primer sueldo, primeras responsabilidades.',
      energy: 18,
      effects: { social: 2, happy: -1, money: 350 },
      log: 'Trabajó todo el verano y aprendió lo que cuesta ganarse un peso.',
    },
  ],

  juventud: [
    {
      id: 'formarse',
      icon: '🎓',
      title: 'Formarte',
      desc: 'Universidad, cursos y especializaciones.',
      energy: 18,
      moneyCost: 700,
      effects: { mind: 8, happy: 1 },
      log: 'Invirtió en su formación.',
    },
    {
      id: 'trabajar',
      icon: '💼',
      title: 'Trabajar',
      desc: 'Construir carrera, sueldo y experiencia.',
      energy: 18,
      effects: { happy: -2, health: -1 },
      log: 'Trabajó todo el año.',
    },
    {
      id: 'entrenar',
      icon: '🏋️',
      title: 'Entrenar',
      desc: 'Cuerpo y cabeza en forma.',
      energy: 16,
      effects: { health: 8, happy: 2, social: 1 },
      log: 'Entrenó con constancia y se sintió mejor.',
    },
    {
      id: 'social',
      icon: '🍻',
      title: 'Vida social',
      desc: 'Salidas, citas y gente nueva.',
      energy: 14,
      moneyCost: 150,
      effects: { social: 7, love: 9, happy: 5 },
      log: 'Salió, conoció gente y la pasó bien.',
    },
  ],

  adultez: [
    {
      id: 'trabajar',
      icon: '💼',
      title: 'Trabajar',
      desc: 'Sostener la carrera y la casa.',
      energy: 18,
      effects: { happy: -2, health: -1 },
      log: 'Trabajó todo el año.',
    },
    {
      id: 'entrenar',
      icon: '🏋️',
      title: 'Entrenar',
      desc: 'Mantenerse en forma cuesta, pero rinde.',
      energy: 16,
      effects: { health: 8, happy: 2 },
      log: 'Entrenó y cuidó el cuerpo.',
    },
    {
      id: 'familia',
      icon: '👨‍👩‍👧',
      title: 'Tiempo con los tuyos',
      desc: 'La vida también pasa en la mesa.',
      energy: 12,
      effects: { happy: 6, social: 5, love: 3 },
      log: 'Le hizo lugar a la gente que quiere.',
    },
    {
      id: 'hobby',
      icon: '🎨',
      title: 'Cultivar un hobby',
      desc: 'Algo que sea solo tuyo.',
      energy: 10,
      effects: { happy: 6, mind: 3, health: 1 },
      log: 'Le dedicó tiempo a un proyecto personal.',
    },
  ],

  vejez: [
    {
      id: 'caminar',
      icon: '🚶',
      title: 'Caminar',
      desc: 'Paso firme, mates y barrio.',
      energy: 10,
      effects: { health: 4, happy: 3 },
      log: 'Caminó, saludó vecinos y respiró aire fresco.',
    },
    {
      id: 'familia',
      icon: '👨‍👩‍👧',
      title: 'Rodearse de familia',
      desc: 'Nietos, sobremesas y fotos viejas.',
      energy: 10,
      effects: { happy: 8, social: 5, love: 3 },
      log: 'Compartió tiempo con los suyos.',
    },
    {
      id: 'jardin',
      icon: '🌱',
      title: 'Jardín y memoria',
      desc: 'Cuidar plantas y repasar historias.',
      energy: 12,
      effects: { happy: 5, health: 2, mind: 2 },
      log: 'Cuidó su jardín y ordenó recuerdos.',
    },
    {
      id: 'viajar',
      icon: '✈️',
      title: 'Viajar',
      desc: 'Ese lugar que siempre quedó pendiente.',
      energy: 14,
      moneyCost: 900,
      effects: { happy: 12, social: 3 },
      log: 'Hizo ese viaje que venía posponiendo.',
    },
  ],
};

const ACHIEVEMENTS = [
  { id: 'firstjob', icon: '💼', name: 'Primer sueldo', desc: 'Conseguir tu primer empleo', test: (s) => (s?.career ?? 0) >= 1 },
  { id: 'degree', icon: '🎓', name: 'Título en mano', desc: 'Terminar una formación', test: (s) => s?.degree === true },
  { id: 'savings', icon: '💰', name: 'Ahorrista', desc: 'Juntar $10.000', test: (s) => (s?.money ?? 0) >= 10000 },
  { id: 'tycoon', icon: '🏦', name: 'Magnate', desc: 'Juntar $100.000', test: (s) => (s?.money ?? 0) >= 100000 },
  { id: 'brilliant', icon: '🧠', name: 'Mente brillante', desc: 'Llegar a 85 de mente', test: (s) => (s?.stats?.mind ?? 0) >= 85 },
  { id: 'social', icon: '🫂', name: 'Alma social', desc: 'Llegar a 85 de social', test: (s) => (s?.stats?.social ?? 0) >= 85 },
  { id: 'joy', icon: '😄', name: 'Feliz de verdad', desc: 'Llegar a 90 de felicidad', test: (s) => (s?.stats?.happy ?? 0) >= 90 },
  { id: 'iron', icon: '💪', name: 'Cuerpo de hierro', desc: '85 de salud después de los 50', test: (s) => (s?.age ?? 0) >= 50 && (s?.stats?.health ?? 0) >= 85 },
  { id: 'love', icon: '❤️', name: 'Amor correspondido', desc: 'Formalizar una pareja', test: (s) => s?.partner === true },
  { id: 'family', icon: '👶', name: 'Familia propia', desc: 'Tener o adoptar un hijo', test: (s) => (s?.kids ?? 0) >= 1 },
  { id: 'home', icon: '🏠', name: 'Techo propio', desc: 'Comprar una casa', test: (s) => s?.house === true },
  { id: 'ceo', icon: '👑', name: 'Llegar a la cima', desc: 'Convertirte en CEO', test: (s) => (s?.career ?? 0) >= 6 },
  { id: 'legend', icon: '🌟', name: 'Leyenda humana', desc: 'Terminar con 840+ de legado', test: (s, score) => (score ?? 0) >= 840 },
];

const GOALS = [
  { id: 'mind', icon: '🧠', name: 'Mente despierta', desc: 'Llegar a 75 de mente', test: (s) => (s?.stats?.mind ?? 0) >= 75 },
  { id: 'money', icon: '💰', name: 'Independencia', desc: 'Ahorrar $5.000', test: (s) => (s?.money ?? 0) >= 5000 },
  { id: 'bonds', icon: '🫂', name: 'Vínculos fuertes', desc: 'Llegar a 75 de social', test: (s) => (s?.stats?.social ?? 0) >= 75 },
  { id: 'home', icon: '🏠', name: 'Techo propio', desc: 'Comprar una casa', test: (s) => s?.house === true },
];

const STAGE_NOTES = {
  infancia: { title: 'Infancia', text: 'La infancia define las bases: mente, salud y vínculos. Lo que sembrás ahora crece después.' },
  adolescencia: { title: 'Adolescencia', text: 'Cada decisión pesa más. El cuerpo aguanta casi todo; la cabeza y la reputación, no tanto.' },
  juventud: { title: 'Juventud', text: 'Formación, primer empleo, amor. Es la etapa de las apuestas grandes y los errores baratos.' },
  adultez: { title: 'Adultez', text: 'Carrera, familia y salud compiten por tu tiempo. Elegí qué sostener y qué soltar.' },
  vejez: { title: 'Vejez', text: 'El tiempo se acelera. La salud y los vínculos valen más que cualquier cuenta bancaria.' },
};

const RANKS = [
  { min: 0, icon: '🌱', name: 'Vida sencilla', sub: 'Una vida simple, con sus pequeños grandes momentos.' },
  { min: 420, icon: '🌿', name: 'Vida cumplida', sub: 'Supo rodearse, elegir y disfrutar lo cotidiano.' },
  { min: 560, icon: '🌟', name: 'Vida notable', sub: 'Dejó una marca en quienes lo conocieron.' },
  { min: 700, icon: '🏆', name: 'Vida extraordinaria', sub: 'Una historia que vale la pena contar.' },
  { min: 840, icon: '👑', name: 'Leyenda humana', sub: 'Hizo historia. Literalmente.' },
];
