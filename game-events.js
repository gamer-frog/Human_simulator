'use strict';

/* ============================================================
   HUMAN.SIM — catálogo de eventos de vida
   ============================================================ */

const EVENTS = [
  /* ---------------- INFANCIA ---------------- */
  {
    id: 'teacher',
    stages: ['infancia'],
    icon: '🏫',
    title: 'La seño te felicita',
    text: 'Leíste en voz alta sin equivocarte y toda la clase aplaudió. Todos te miran.',
    choices: [
      { label: 'Sonreír y seguir leyendo', effects: { mind: 4, happy: 3, social: 1 }, result: 'La confianza te creció un poquito ese día.' },
      { label: 'Compartir el mérito con tu compañero', effects: { social: 5, happy: 2, mind: 1 }, result: 'Tu compañero nunca se olvidó de ese gesto.' },
    ],
  },
  {
    id: 'bully',
    stages: ['infancia'],
    icon: '🛡️',
    title: 'Alguien necesita ayuda',
    text: 'En el recreo, un compañero está siendo acosado por un grupo. Podés intervenir o mirar para otro lado.',
    choices: [
      { label: 'Defenderlo', effects: { health: -3, social: 8, happy: 5 }, result: 'Te llevaste un empujón, pero ganaste un amigo para siempre.' },
      { label: 'Avisar a un adulto', effects: { mind: 3, social: 4, happy: 2 }, result: 'Un docente intervino rápido. Supiste pedir ayuda.' },
      { label: 'Mirar para otro lado', effects: { happy: -6, social: -2 }, result: 'Esa tarde te costó dormir.' },
    ],
  },
  {
    id: 'wallet',
    stages: ['infancia'],
    icon: '👛',
    title: 'Una billetera en la vereda',
    text: 'Encontraste una billetera con $50 y el documento de una señora mayor.',
    choices: [
      { label: 'Devolverla', effects: { social: 4, happy: 3 }, result: 'La señora te dio $10 de recompensa y un abrazo enorme.' },
      { label: 'Quedártela', effects: { social: -2, happy: 1 }, result: 'Te compraste golosinas. El gusto duró poco.' },
    ],
  },
  {
    id: 'move',
    stages: ['infancia'],
    icon: '📦',
    title: 'Tu mejor amigo se muda',
    text: 'Su familia se va a otra ciudad y el patio queda raro sin él.',
    choices: [
      { label: 'Prometer que seguirán en contacto', effects: { social: 2, happy: -3 }, result: 'Se escribieron unas semanas. La distancia pesó.' },
      { label: 'Salir a hacer nuevos amigos', effects: { social: 5, happy: 2 }, result: 'Descubriste que siempre hay lugar para alguien más.' },
      { label: 'Encerrarte un tiempo', effects: { happy: -4, mind: 1 }, result: 'Te refugiaste en tus cosas. Aprendiste a estar solo.' },
    ],
  },
  {
    id: 'talent',
    stages: ['infancia'],
    icon: '🎤',
    title: 'Acto escolar',
    text: 'Buscan voluntarios para el acto de fin de año. El escenario te da un poco de miedo.',
    choices: [
      { label: 'Anotarte', effects: { social: 6, happy: 4 }, result: 'Olvidaste una frase, pero el aplauso final lo valió todo.' },
      { label: 'Ayudar detrás de escena', effects: { social: 3, mind: 2 }, result: 'Armaste el decorado y descubriste que te gusta crear.' },
      { label: 'No participar', effects: { happy: -1 }, result: 'Miraste el acto desde la última fila.' },
    ],
  },

  /* ---------------- ADOLESCENCIA ---------------- */
  {
    id: 'exam',
    stages: ['adolescencia'],
    icon: '📝',
    title: 'Examen mañana',
    text: 'No estudiaste nada. Tenés una noche entera y muchas tentaciones.',
    choices: [
      { label: 'Estudiar toda la noche', effects: { mind: 6, health: -3, happy: -2 }, result: 'Aprobaste con lo justo y ojeras hasta el viernes.' },
      {
        label: 'Copiar a escondidas',
        hint: '55% 🧠 +2 · 45% 😊 −8 💬 −5',
        outcomes: [
          { p: 0.55, effects: { mind: 2, happy: 2 }, result: 'Nadie te vio. El alivio duró poco, pero zafaste.' },
          { p: 0.45, effects: { happy: -8, social: -5 }, result: 'Te descubrieron. La sanción y la vergüenza duraron más que el examen.' },
        ],
      },
      { label: 'Presentarte con lo que sabés', effects: { mind: 1, happy: 2 }, result: 'No te fue perfecto, pero dormiste tranquilo.' },
    ],
  },
  {
    id: 'party',
    stages: ['adolescencia'],
    icon: '🪩',
    title: 'La fiesta del año',
    text: 'Todo el curso va a la fiesta del año. Tus viejos esperan que estudies.',
    choices: [
      { label: 'Ir y bailar hasta el final', effects: { social: 7, happy: 5, health: -1 }, result: 'Volviste a las cuatro de la mañana con una sonrisa enorme.' },
      { label: 'Ir un rato y volver temprano', effects: { social: 3, happy: 2, mind: 1 }, result: 'Equilibrista: viste a todos y al día siguiente rendiste.' },
      { label: 'Quedarte a estudiar', effects: { mind: 4, happy: -3 }, result: 'Estudiaste muchísimo. Las fotos de la fiesta te dolieron un poco.' },
    ],
  },
  {
    id: 'firstlove',
    stages: ['adolescencia'],
    icon: '💌',
    title: 'Alguien te mira distinto',
    text: 'Una persona de tu clase empezó a buscarte. Hay electricidad en el aire.',
    choices: [
      {
        label: 'Decirle lo que sentís',
        hint: '65% ❤️ +14 😊 +7 · 35% 😊 −6 🧠 +2',
        outcomes: [
          { p: 0.65, effects: { love: 14, happy: 7, social: 3 }, result: 'Te dijo que sí. Ese recreo quedó grabado para siempre.' },
          { p: 0.35, effects: { love: 3, happy: -6, mind: 2 }, result: 'No era mutuo. Te dolió, pero aprendiste a decir lo que sentís.' },
        ],
      },
      { label: 'Esperar una señal', effects: { love: 5, happy: 1 }, result: 'La señal nunca llegó del todo. Quedó la duda.' },
      { label: 'Concentrarte en vos', effects: { mind: 3, happy: 1 }, result: 'Elegiste cuidarte. No es una mala decisión.' },
    ],
  },
  {
    id: 'summerjob',
    stages: ['adolescencia'],
    icon: '🧰',
    title: 'Oferta de verano',
    text: 'Un vecino te ofrece trabajo en su negocio durante el verano.',
    choices: [
      { label: 'Aceptar', effects: { social: 3, happy: 1, money: 700 }, result: 'Terminaste el verano con plata propia y callos en las manos.' },
      {
        label: 'Negociar mejor pago',
        hint: '60% 💰 +$1.000 🧠 +2 · 40% 💰 +$400 😊 −1',
        outcomes: [
          { p: 0.6, effects: { money: 1000, mind: 2 }, result: 'Negociaste bien y te pagaron más. Aprendiste tu valor.' },
          { p: 0.4, effects: { money: 400, happy: -1 }, result: 'Te dijo que no. Igual trabajaste, por menos.' },
        ],
      },
      { label: 'Rechazar para descansar', effects: { happy: 3 }, result: 'Tuviste el verano más tranquilo de tu vida. Y el más pobre.' },
    ],
  },
  {
    id: 'vape',
    stages: ['adolescencia'],
    icon: '💨',
    title: 'Presión de grupo',
    text: 'En una juntada aparece un vape y empieza a circular. Te lo pasan a vos.',
    choices: [
      { label: 'Probar', effects: { happy: 4, health: -7 }, result: 'Tosiste. La curiosidad se fue, el hábito quedó un tiempo.' },
      { label: 'Pasar de largo', effects: { social: -2, happy: 2, health: 1 }, result: 'Algunos se rieron. No te importó demasiado.' },
      { label: 'Convencer al grupo de dejarlo', effects: { social: 4, mind: 3, happy: 2 }, result: 'Terminaron jugando a las cartas. Ganaste respeto.' },
    ],
  },
  {
    id: 'olympiad',
    stages: ['adolescencia'],
    icon: '🏅',
    title: 'Olimpiada de matemática',
    text: 'Te seleccionaron para representar al colegio. Hay que entrenar bastante.',
    choices: [
      { label: 'Competir', effects: { mind: 7, happy: 3, energy: -10 }, result: 'No ganaste el oro, pero resolviste problemas que parecían imposibles.' },
      { label: 'Entrenar con un amigo', effects: { mind: 4, social: 4 }, result: 'Estudiar de a dos fue mucho más divertido.' },
      { label: 'Bajarte por nervios', effects: { happy: -3, mind: 1 }, result: 'Te quedó la espina de saber qué habría pasado.' },
    ],
  },

  /* ---------------- JUVENTUD / ADULTEZ ---------------- */
  {
    id: 'formalize',
    stages: ['juventud', 'adultez'],
    icon: '💞',
    title: 'La charla pendiente',
    text: 'La persona con la que salís quiere algo serio. Vos también sentís algo, pero da vértigo.',
    condition: (s) => !s?.partner && (s?.love ?? 0) >= 50 && (s?.age ?? 0) >= 20,
    choices: [
      { label: 'Formalizar la relación', effects: { partner: true, love: 15, happy: 8, social: 3 }, result: 'Se animaron. Empezó una historia de las importantes.' },
      { label: 'Ir despacio', effects: { love: -5, happy: -2 }, result: 'La otra persona se enfrió un poco. Quedó la puerta abierta.' },
      { label: 'Cortar por lo sano', effects: { love: -10, happy: -4, mind: 2 }, result: 'Fue incómodo, pero honesto.' },
    ],
  },
  {
    id: 'dreamjob',
    stages: ['juventud'],
    icon: '🚀',
    title: 'El trabajo soñado (mal pago)',
    text: 'Te ofrecen entrar a un proyecto que te encanta, pero el sueldo es bajo.',
    choices: [
      { label: 'Aceptar y aprender', effects: { careerXp: 1, happy: 6, money: 200 }, result: 'Entraste por la puerta chica. La experiencia no se compra.' },
      {
        label: 'Negociar el sueldo',
        hint: '60% 🚀 +1 💰 +$900 · 40% 😊 −3 🧠 +2',
        outcomes: [
          { p: 0.6, effects: { careerXp: 1, money: 900, mind: 3 }, result: 'Negociaste con datos y te mejoraron la oferta. Entraste igual.' },
          { p: 0.4, effects: { happy: -3, mind: 2 }, result: 'No hubo margen. Perdiste el puesto por insistir, pero aprendiste a negociar.' },
        ],
      },
      { label: 'Rechazar y buscar algo mejor', effects: { happy: -2, mind: 3 }, result: 'Dijiste que no. Las semanas siguientes fueron de búsqueda intensa.' },
    ],
  },
  {
    id: 'apartment',
    stages: ['juventud'],
    icon: '🔑',
    title: 'Departamento compartido',
    text: 'Tus amigos alquilan un departamento y te ofrecen una habitación.',
    choices: [
      { label: 'Mudarte', effects: { money: -1200, happy: 7, social: 5 }, result: 'Platos sucios, risas y libertad. Valió la pena.' },
      { label: 'Quedarte con tus viejos y ahorrar', effects: { money: 800, happy: -3, social: -2 }, result: 'Ahorraste, pero la casa empezó a quedarte chica.' },
    ],
  },
  {
    id: 'crypto',
    stages: ['juventud', 'adultez'],
    icon: '🪙',
    title: 'La cripto milagrosa',
    text: 'Un amigo asegura que una moneda “va a explotar”. Todos están poniendo plata.',
    choices: [
      {
        label: 'Meter $1.000',
        requires: { money: 1000 },
        hint: '40% 💰 +$2.500 · 60% 💰 −$1.000 😊 −5',
        outcomes: [
          { p: 0.4, effects: { money: 2500, happy: 4 }, result: 'Vendiste a tiempo. El grupo te miró como a un genio.' },
          { p: 0.6, effects: { money: -1000, happy: -5, mind: 3 }, result: 'La moneda se derrumbó. Aprendiste que la codicia también cuesta.' },
        ],
      },
      {
        label: 'Meter solo $200',
        requires: { money: 200 },
        hint: '50% 💰 +$400 · 50% 💰 −$200 🧠 +2',
        outcomes: [
          { p: 0.5, effects: { money: 400, happy: 2 }, result: 'Doblaste la apuesta sin arriesgar el alquiler.' },
          { p: 0.5, effects: { money: -200, mind: 2 }, result: 'Perdiste poco. La lección salió barata.' },
        ],
      },
      { label: 'No invertir', effects: { mind: 2, happy: 1 }, result: 'Miraste desde afuera. A veces el mejor trade es no operar.' },
    ],
  },
  {
    id: 'trip',
    stages: ['juventud'],
    icon: '🏖️',
    title: 'Viaje con amigos',
    text: 'Se organizó un viaje a la costa. La plata está justa, pero las ganas sobran.',
    choices: [
      { label: 'Ir', requires: { money: 900 }, effects: { money: -900, happy: 10, social: 6 }, result: 'Volviste con fotos, anécdotas y la billetera flaca.' },
      { label: 'Quedarte y ahorrar', effects: { money: 300, happy: -4, mind: 2 }, result: 'Ahorraste. Las historias del viaje te llegaron por audio.' },
      { label: 'Proponer un plan barato', effects: { money: -200, happy: 6, social: 4, mind: 2 }, result: 'Armaste un plan económico y todos la pasaron genial.' },
    ],
  },
  {
    id: 'burnout',
    stages: ['juventud', 'adultez'],
    icon: '🕯️',
    title: 'Se te está apagando la chispa',
    text: 'Dormís mal, no disfrutás nada y el domingo ya te pesa. Algo tiene que cambiar.',
    choices: [
      { label: 'Pedir unos días', effects: { money: -500, happy: 7, health: 4 }, result: 'Paraste. Al volver, todo se vio un poco más manejable.' },
      { label: 'Aguantar un poco más', effects: { money: 700, health: -6, happy: -5 }, result: 'El cuerpo empezó a pasar factura.' },
      { label: 'Cambiar hábitos', effects: { health: 5, happy: 4, mind: 3 }, result: 'Dormir, caminar, poner límites. Nada mágico, todo real.' },
    ],
  },
  {
    id: 'ex',
    stages: ['juventud'],
    icon: '📱',
    title: 'Mensaje del pasado',
    text: 'Tu ex te escribe después de meses y propone encontrarse.',
    choices: [
      {
        label: 'Encontrarte',
        hint: '50% ❤️ +10 😊 +5 · 50% 😊 −7 ❤️ −3',
        outcomes: [
          { p: 0.5, effects: { love: 10, happy: 5 }, result: 'La charla fue linda. Quizás había algo para reconstruir.' },
          { p: 0.5, effects: { happy: -7, love: -3 }, result: 'Volviste a casa con la sensación de que ya estaba cerrado.' },
        ],
      },
      { label: 'Cortar el contacto', effects: { happy: 2, mind: 3 }, result: 'Bloqueaste, respiraste y seguiste.' },
      { label: 'Quedar como amigos', effects: { social: 4, happy: 1 }, result: 'Se vieron una vez. Después la vida siguió.' },
    ],
  },
  {
    id: 'startup',
    stages: ['juventud'],
    icon: '💡',
    title: 'Propuesta de sociedad',
    text: 'Un conocido te ofrece invertir $2.000 en su emprendimiento. Suena bien, pero también suena a riesgo.',
    choices: [
      {
        label: 'Invertir $2.000',
        requires: { money: 2000 },
        hint: '55% 💰 +$4.500 🧠 +3 · 45% 💰 −$2.000 😊 −4',
        outcomes: [
          { p: 0.55, effects: { money: 4500, mind: 3 }, result: 'El negocio despegó. Recuperaste la inversión con creces.' },
          { p: 0.45, effects: { money: -2000, happy: -4, mind: 4 }, result: 'El emprendimiento no cerró. Perdiste plata, pero entendiste cómo funciona el riesgo.' },
        ],
      },
      { label: 'Ofrecer tu tiempo en vez de plata', effects: { careerXp: 1, social: 3 }, result: 'Ayudaste con lo que sabías y ganaste experiencia sin arriesgar.' },
      { label: 'Declinar', effects: { mind: 1 }, result: 'Preferiste no mezclar amigos con dinero.' },
    ],
  },
  {
    id: 'pet',
    stages: ['juventud'],
    icon: '🐶',
    title: 'Una perra en la calle',
    text: 'Encontrás una perra flaca y asustada cerca de tu casa. Te mira como si supiera que podés ayudar.',
    choices: [
      { label: 'Adoptarla', effects: { money: -350, happy: 10, social: 2 }, result: 'La llamaste Pancha. Desde ese día te espera en la puerta.' },
      { label: 'Llevarla a un refugio', effects: { happy: 4, social: 3 }, result: 'El refugio se hizo cargo. Te mandaron fotos con su nueva familia.' },
      { label: 'Seguir de largo', effects: { happy: -3 }, result: 'Pensaste en ella varios días.' },
    ],
  },

  /* ---------------- ADULTEZ ---------------- */
  {
    id: 'promotion',
    stages: ['adultez'],
    icon: '📈',
    title: '¿Ascenso o equilibrio?',
    text: 'Te ofrecen el ascenso que buscabas, pero con más horas y menos vida.',
    choices: [
      { label: 'Aceptar', effects: { careerXp: 2, money: 1200, health: -3, happy: -4 }, result: 'El título cambió. Tu agenda también.' },
      {
        label: 'Negociar límites',
        hint: '65% 🚀 +1 💰 +$400 😊 +4 · 35% 😊 −2',
        outcomes: [
          { p: 0.65, effects: { careerXp: 1, money: 400, happy: 4 }, result: 'Te dieron el puesto con condiciones. Ganaste las dos cosas.' },
          { p: 0.35, effects: { happy: -2 }, result: 'Dijeron que no había margen. El puesto quedó para otro.' },
        ],
      },
      { label: 'Rechazar', effects: { happy: 3, health: 1 }, result: 'Dijiste que no. Por primera vez, el tiempo valió más.' },
    ],
  },
  {
    id: 'wedding',
    stages: ['adultez'],
    icon: '💍',
    title: 'La pregunta',
    text: 'Tu pareja saca el tema de casarse. No es una propuesta formal, pero casi.',
    condition: (s) => s?.partner === true,
    choices: [
      { label: 'Casarse', effects: { money: -2500, happy: 12, love: 12 }, result: 'Fiesta, abrazo largo y un “sí” que se escuchó en toda la cuadra.' },
      { label: 'Esperar un poco', effects: { love: -6, happy: -3 }, result: 'La charla quedó flotando. Nada se rompió, pero algo se enfrió.' },
      { label: 'Hablar de lo que cada uno quiere', effects: { social: 4, happy: 3, mind: 2 }, result: 'Hablar claro les hizo mejor que cualquier ceremonia.' },
    ],
  },
  {
    id: 'kids',
    stages: ['adultez'],
    icon: '🍼',
    title: '¿Tener un hijo?',
    text: 'Con tu pareja evalúan agrandar la familia. No hay respuesta correcta.',
    condition: (s) => s?.partner === true && (s?.kids ?? 0) < 2,
    choices: [
      { label: 'Tenerlo', effects: { kids: 1, happy: 10, money: -800, health: -2 }, result: 'Noches sin dormir, pañales y un amor que no sabías que existía.' },
      { label: 'Adoptar', effects: { kids: 1, happy: 12, money: -1500, social: 3 }, result: 'El papeleo fue eterno. La primera vez que te dijo “pa” o “ma”, también.' },
      { label: 'Decidir que no', effects: { happy: 2, love: -2 }, result: 'Eligieron su propio camino. La charla fue madura.' },
    ],
  },
  {
    id: 'parents',
    stages: ['adultez'],
    icon: '🏥',
    title: 'Tus padres necesitan ayuda',
    text: 'Ya no pueden resolver todo solos. Hay que decidir cómo acompañarlos.',
    choices: [
      { label: 'Cuidarlos vos', effects: { money: -500, happy: 5, social: 5, health: -2 }, result: 'Te cansaste, pero no te arrepentiste.' },
      { label: 'Pagar una residencia', effects: { money: -1800, happy: -2, social: 1 }, result: 'Están cuidados. La culpa aparece de vez en cuando.' },
      { label: 'Turnarse con hermanos', effects: { social: 4, happy: 3, money: -600 }, result: 'Entre todos fue más liviano.' },
    ],
  },
  {
    id: 'crisis40',
    stages: ['adultez'],
    icon: '🏍️',
    title: 'Crisis de los cuarenta',
    text: 'Sentís que algo falta. Las opciones son varias y ninguna es gratis.',
    choices: [
      { label: 'Comprar ese auto', effects: { money: -6000, happy: 6 }, result: 'El motor ruge. La cuenta bancaria también se queja.' },
      { label: 'Empezar terapia', effects: { money: -900, happy: 8, mind: 4 }, result: 'Hablar de lo que duele te ordenó la cabeza.' },
      { label: 'Arrancar un hobby', effects: { money: -300, happy: 5, health: 3 }, result: 'Descubriste que todavía hay cosas que te entusiasman.' },
    ],
  },
  {
    id: 'house',
    stages: ['adultez'],
    icon: '🏠',
    title: 'La casa justa',
    text: 'Aparece una casa a buen precio, con patio y una cocina enorme.',
    choices: [
      { label: 'Comprarla', requires: { money: 15000 }, effects: { money: -15000, house: true, happy: 10 }, result: 'Firmaste, recibiste las llaves y lloraste un poquito en el auto.' },
      { label: 'Seguir ahorrando', effects: { mind: 2, happy: -2 }, result: 'La dejaste pasar. Ahorrar también es una decisión.' },
      {
        label: 'Invertir en otra cosa',
        hint: '50% 💰 +$3.000 · 50% 💰 −$2.000 🧠 +2',
        outcomes: [
          { p: 0.5, effects: { money: 3000, happy: 2 }, result: 'La inversión salió bien. La casa quedó para otra vida.' },
          { p: 0.5, effects: { money: -2000, mind: 2 }, result: 'No salió como esperabas. La casa tenía razón.' },
        ],
      },
    ],
  },
  {
    id: 'scam',
    stages: ['adultez'],
    icon: '📞',
    title: 'Llamada sospechosa',
    text: 'Alguien dice ser de tu banco y pide datos para “bloquear un fraude”.',
    choices: [
      { label: 'Dar tus datos', effects: { money: -1500, mind: 3, happy: -4 }, result: 'Te vaciaron una parte de la cuenta. La vergüenza duró más que la plata.' },
      { label: 'Cortar y denunciar', effects: { happy: 2, mind: 1 }, result: 'Cortaste y avisaste al banco. Ningún drama.' },
      { label: 'Hacerte el confundido y hacerlos perder tiempo', effects: { happy: 4, mind: 2 }, result: 'Los tuviste veinte minutos al teléfono. Después los denunciaste.' },
    ],
  },
  {
    id: 'homework',
    stages: ['adultez'],
    icon: '🧮',
    title: 'Tarea imposible',
    text: 'Tu hijo necesita ayuda con una tarea de matemática que parece de otro planeta.',
    condition: (s) => (s?.kids ?? 0) >= 1,
    choices: [
      { label: 'Ayudarlo toda la tarde', effects: { happy: 7, social: 4 }, result: 'No entendían nada, pero se rieron mucho. Al final salió.' },
      { label: 'Pagarle a un tutor', effects: { money: -250, happy: 2 }, result: 'El tutor lo resolvió en media hora. Vos también aprendiste algo.' },
      { label: 'Decirle que se arregle', effects: { happy: -4, social: -2 }, result: 'Se encerró en su cuarto. Esa noche no cenaron juntos.' },
    ],
  },

  /* ---------------- VEJEZ ---------------- */
  {
    id: 'retirement',
    stages: ['vejez'],
    icon: '🛋️',
    title: 'La jubilación',
    text: 'Llegó la edad de decidir cómo seguir. El trabajo fue una parte enorme de tu vida.',
    condition: (s) => s?.retired !== true && (s?.age ?? 0) >= 60 && (s?.age ?? 0) < 65,
    choices: [
      { label: 'Jubilarte', effects: { retired: true, happy: 8, health: 2 }, result: 'Apagaste el despertador. El primer lunes fue raro y hermoso.' },
      { label: 'Seguir trabajando un tiempo', effects: { money: 2000, health: -4, happy: -2 }, result: 'Seguiste en la rueda. La cuenta creció, el cuerpo se quejó.' },
      { label: 'Trabajar medio tiempo', effects: { retired: true, money: 800, happy: 4, health: 1 }, result: 'Encontraste un equilibrio entre seguir útil y descansar.' },
    ],
  },
  {
    id: 'grandkids',
    stages: ['vejez'],
    icon: '🍪',
    title: 'Los nietos',
    text: 'Tus nietos te piden quedarse el fin de semana. La casa vuelve a tener ruido.',
    condition: (s) => (s?.kids ?? 0) >= 1,
    choices: [
      { label: 'Cuidarlos', effects: { happy: 10, health: -2, social: 4 }, result: 'Galletitas, cuentos y una siesta compartida. Felicidad pura.' },
      { label: 'Hacer una visita corta', effects: { happy: 5, social: 2 }, result: 'Un rato lindo, sin agotarte.' },
      { label: 'Decir que estás muy cansado', effects: { happy: -5, social: -2 }, result: 'Entendieron, pero se fueron calladitos.' },
    ],
  },
  {
    id: 'knee',
    stages: ['vejez'],
    icon: '🦵',
    title: 'La rodilla dijo basta',
    text: 'Subir escaleras se volvió una expedición. Hay que decidir qué hacer.',
    choices: [
      { label: 'Operarte', requires: { money: 1800 }, effects: { money: -1800, health: 8 }, result: 'La recuperación fue larga, pero volviste a caminar sin pensar en cada paso.' },
      { label: 'Fisioterapia', effects: { money: -500, health: 5 }, result: 'Ejercicios todos los días. Mejoró de a poco.' },
      { label: 'Aguantar', effects: { health: -5, happy: -2 }, result: 'El dolor se instaló como un invitado que no se va.' },
    ],
  },
  {
    id: 'dreamtrip',
    stages: ['vejez'],
    icon: '🗺️',
    title: 'El viaje pendiente',
    text: 'Siempre soñaste con ese lugar. Ahora hay tiempo, pero el cuerpo y la plata tienen opinión.',
    choices: [
      { label: 'Ir', requires: { money: 2500 }, effects: { money: -2500, happy: 14, health: -2 }, result: 'Volviste con los ojos brillantes y mil fotos para mostrar.' },
      { label: 'Hacerlo más cerca', effects: { money: -600, happy: 7 }, result: 'Un destino cercano, un fin de semana largo. Alcanzó.' },
      { label: 'Dejarlo para nunca', effects: { happy: -4 }, result: 'Guardaste el folleto en un cajón. A veces lo mirás.' },
    ],
  },
  {
    id: 'volunteer',
    stages: ['vejez'],
    icon: '🤝',
    title: 'Manos que hacen falta',
    text: 'El comedor del barrio busca voluntarios. Tenés tiempo y ganas de ser útil.',
    choices: [
      { label: 'Sumarte', effects: { social: 8, happy: 8, health: 1 }, result: 'Servir comida te devolvió una rutina con sentido.' },
      { label: 'Donar', effects: { money: -400, happy: 5, social: 2 }, result: 'No pudiste ir, pero tu aporte llegó igual.' },
      { label: 'Pasar', effects: { happy: -2 }, result: 'Viste el cartel cada mañana. Alguna vez te dio culpa.' },
    ],
  },
  {
    id: 'will',
    stages: ['vejez'],
    icon: '📜',
    title: 'Ordenar el final',
    text: 'Es momento de decidir qué pasa con lo que construiste.',
    choices: [
      { label: 'Dejarlo todo a tu familia', effects: { happy: 5, social: 2 }, result: 'Hablaste con todos. Quedaron las cosas claras y los abrazos dados.' },
      { label: 'Donar parte a una causa', effects: { happy: 8, social: 4 }, result: 'Elegiste una causa que te importa. Tu nombre va a seguir haciendo algo.' },
      { label: 'No querés pensar en eso', effects: { happy: -1, mind: 1 }, result: 'Lo dejaste para después. Después nunca es un buen día.' },
    ],
  },
];
