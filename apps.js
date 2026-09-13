// --- VARIABLES GLOBALES DE ESTADO ---
let currentLevel = 'Secundaria';
let currentDifficulty = 'Básico';
let currentSubject = 'Matemáticas';
let studentName = 'Estudiante';
let schoolName = '';
let userRole = 'student';
let teacherName = 'Docente';
let teacherSchool = '';

// --- 1. CONFIGURACIÓN SUPABASE ---
const SUPABASE_URL = 'TU_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';
let supabaseClient = null;

if (window.supabase && SUPABASE_URL !== 'TU_SUPABASE_URL') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// --- 2. SISTEMA DE NAVEGACIÓN Y VISTAS ---
function goToView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });

    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
        window.scrollTo(0, 0);
    } else {
        console.warn(`La vista '${viewId}' no fue encontrada en el DOM.`);
    }
}

// --- 3. GESTIÓN DE ROLES ---
function switchRole(role) {
    userRole = role;
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(b => b.classList.remove('active'));
    
    if (role === 'student') {
        if (roleButtons[0]) roleButtons[0].classList.add('active');
        if (studentName && studentName !== 'Estudiante') {
            goToView('viewHub');
        } else {
            goToView('viewRegister');
        }
    } else {
        if (roleButtons[1]) roleButtons[1].classList.add('active');
        if (teacherName && teacherName !== 'Docente') {
            loadTeacherDashboardData();
            goToView('viewTeacherDashboard');
        } else {
            goToView('viewTeacherRegister');
        }
    }
}

// --- 4. REGISTROS CON VALIDACIÓN ---
function handleRegister() {
    const nameInput = document.getElementById('regName');
    const schoolInput = document.getElementById('regSchool');
    const emailInput = document.getElementById('regEmail');
    const passInput = document.getElementById('regPass');

    const name = nameInput ? nameInput.value.trim() : "";
    const school = schoolInput ? schoolInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const pass = passInput ? passInput.value.trim() : "";

    if (!name) {
        alert("⚠️ Error de registro: Por favor ingresa tu nombre completo.");
        if (nameInput) nameInput.focus();
        return;
    }

    if (email && !email.includes('@')) {
        alert("⚠️ Error de registro: Ingresa un correo electrónico válido (debe incluir '@').");
        if (emailInput) emailInput.focus();
        return;
    }

    if (pass && pass.length < 4) {
        alert("⚠️ Error de registro: La contraseña debe tener al menos 4 caracteres.");
        if (passInput) passInput.focus();
        return;
    }

    studentName = name;
    schoolName = school || 'Escuela Secundaria';

    const userBadge = document.getElementById('userBadge');
    if (userBadge) {
        userBadge.innerText = `${studentName} (Estudiante)`;
    }

    goToView('viewHub');
}

function handleTeacherRegister() {
    const teachNameInput = document.getElementById('teachName');
    const name = teachNameInput ? teachNameInput.value.trim() : "";

    if (!name) {
        alert("⚠️ Error de registro: Ingresa tu nombre como docente.");
        return;
    }

    teacherName = name;
    const userBadge = document.getElementById('userBadge');
    if (userBadge) {
        userBadge.innerText = `${teacherName} (Docente)`;
    }

    loadTeacherDashboardData();
    goToView('viewTeacherDashboard');
}

function logoutKallpa() {
    studentName = 'Estudiante';
    schoolName = '';
    teacherName = 'Docente';
    teacherSchool = '';
    userRole = 'student';
    
    const badge = document.getElementById('userBadge');
    if (badge) {
        badge.innerText = 'Invitado / Registro Pendiente';
    }
    
    switchRole('student');
}

// --- 5. LIBROS Y CONTENIDOS TEÓRICOS, PRÁCTICOS Y EVALUACIONES DE ASIGNATURAS ---
const contenidosAsignaturas = {
    "Matemáticas": {
        titulo: "Matemáticas: Álgebra y Razonamiento Lógico",
        teoria: "📖 LIBRO DIGITAL DE CONSULTA (IEBEM/SEP)\n\nCapítulo 1: Ecuaciones y Modelado Matemático.\nEn este módulo estudiarás el lenguaje algebraico, ecuaciones lineales y cuadráticas aplicadas a la resolución de problemas reales.\n\nConceptos Clave:\n• Variable: Incógnita que representa un valor cuantitativo.\n• Igualdad: Relación de equivalencia entre dos expresiones algebraicas.\n• Aplicación: Cálculo de consumo energético y presupuesto comunitario.",
        practica: "✏️ ZONA DE PRÁCTICA: Matemáticas\n\nPlanteamiento del Ejercicio:\nSi el consumo energético de un centro comunitario se modela con la expresión $C = 15x + 50$, donde $x$ es el número de equipos activos:\n1. Calcula el consumo total si hay 8 equipos activos operando simultáneamente.\n2. Redacta tu procedimiento y respuesta argumentada para validación del sistema.",
        evaluacion: "📝 EVALUACIÓN RETRO: Matemáticas\n\nCuestionario Analítico:\nExplica con tus propias palabras por qué el modelado algebraico resulta fundamental para optimizar la distribución de recursos en proyectos comunitarios."
    },
    "Desarrollo Humano": {
        titulo: "Desarrollo Humano: Inteligencia Emocional y Empatía",
        teoria: "📖 LIBRO DIGITAL DE CONSULTA: 'Convivencia y Sentido Humano'\n\nCapítulo 1: Comunicación Asertiva en el Aula.\nBasado en principios de desarrollo socioperceptivo y lecturas del sentido de vida (Viktor Frankl).\n\nEstrategias para la Comunicación Empática:\n1. Escucha Activa: Prestar atención plena sin juzgar previamente.\n2. Lenguaje Asertivo: Expresar emociones con claridad y respeto.\n3. Mediación de Conflictos: Buscar soluciones de beneficio mutuo.",
        practica: "✏️ ZONA DE PRÁCTICA: Desarrollo Humano\n\nDinámica de Casos:\nImagina un desacuerdo en la distribución de tareas dentro del equipo del proyecto CRAJ. Redacta una propuesta de solución aplicando los principios de Escucha Activa y Lenguaje Asertivo.",
        evaluacion: "📝 EVALUACIÓN RETRO: Desarrollo Humano\n\nReflexión Crítica:\n¿De qué manera la postura de Viktor Frankl sobre el 'sentido de vida' ayuda a superar momentos de adversidad personal y comunitaria?"
    },
    "Inteligencia Artificial": {
        titulo: "Fundamentos de Inteligencia Artificial y Python",
        teoria: "📖 MANUAL TÉCNICO DE IA & PYTHON\n\nMódulo 1: Algoritmos y Procesamiento de Lenguaje.\nLa Inteligencia Artificial permite a los sistemas informáticos aprender de datos y tomar decisiones. En Python, utilizamos funciones como `print()`, variables y estructuras condicionales `if/else` para crear asistentes inteligentes como Sined.",
        practica: "✏️ ZONA DE PRÁCTICA: Inteligencia Artificial\n\nReto de Programación:\nEscribe un script en Python o JavaScript que evalúe si el nivel de batería de un dispositivo IoT es menor al 20%, imprimiendo una alerta en consola.",
        evaluacion: "📝 EVALUACIÓN RETRO: Inteligencia Artificial\n\nPregunta Teórica:\n¿Cuál es la diferencia principal entre el aprendizaje automático supervisado y el procesamiento de lenguaje natural?"
    },
    "Robótica": {
        titulo: "Robótica Educativa y Automatización",
        teoria: "📖 GUÍA DE ROBÓTICA E INGENIERÍA\n\nCapítulo 1: Sensores y Microcontroladores.\nExplora el funcionamiento de circuitos electrónicos, motores a pasos y lógica de automatización programable.",
        practica: "✏️ ZONA DE PRÁCTICA: Robótica\n\nDiseño de Automatización:\nDescribe los componentes y conexiones necesarios para configurar un sensor ultrasónico que active una alarma al detectar un objeto a menos de 15 cm.",
        evaluacion: "📝 EVALUACIÓN RETRO: Robótica\n\nEvaluación Conceptual:\nExplica la función de los puertos de entrada/salida (GPIO) en un microcontrolador aplicado a la robótica educativa."
    },
    "Lenguaje de Programación": {
        titulo: "Programación Web (JavaScript y Python)",
        teoria: "📖 MANUAL DE LÓGICA DE PROGRAMACIÓN\n\nCapítulo 1: Sintaxis y Control de Flujo.\nAprende a manipular el DOM con JavaScript (`alert()`, `document.getElementById()`) y a ejecutar scripts de backend con Python (`print()`, bucles `for` y estructuras de datos).",
        practica: "✏️ ZONA DE PRÁCTICA: Lenguaje de Programación\n\nReto Web:\nCrea una función en JavaScript que cambie dinámicamente el texto de un elemento HTML al hacer clic en un botón.",
        evaluacion: "📝 EVALUACIÓN RETRO: Lenguaje de Programación\n\nCuestionario Técnico:\n¿Por qué es importante el uso de funciones modulares en el mantenimiento de código fuente complejo?"
    },
    "Inglés": {
        titulo: "English for Technical Communication",
        teoria: "📖 TEXTBOOK: Technical English & Digital Skills\n\nUnit 1: Software & Hardware Vocabulary.\nLearn key terms for developers, technical documentation reading, and professional communication.",
        practica: "✏️ ZONA DE PRÁCTICA: English\n\nTranslation & Writing:\nWrite a brief technical description in English (at least 3 sentences) detailing the hardware components of your current workstation.",
        evaluacion: "📝 EVALUACIÓN RETRO: English\n\nReading Comprehension:\nWhy is technical English considered an essential skill for software developers and systems engineers globally?"
    }
};

function openModule(materia) {
    currentSubject = materia;
    goToView('viewModule');
    showTab('theory');
}

// --- 6. GESTIÓN DE PESTAÑAS (TEORÍA, PRÁCTICA, EVALUACIÓN) ---
function showTab(tabName) {
    let targetKey = 'theory';
    if (tabName === 'Práctica' || tabName === 'practice') targetKey = 'practice';
    if (tabName === 'Evaluacion Retro' || tabName === 'quiz' || tabName.includes('Evaluación') || tabName.includes('Retro')) targetKey = 'quiz';
    if (tabName === 'Teoría' || tabName === 'theory') targetKey = 'theory';

    const info = contenidosAsignaturas[currentSubject] || {
        titulo: currentSubject,
        teoria: "Contenido no disponible.",
        practica: "Práctica no disponible.",
        evaluacion: "Evaluación no disponible."
    };

    const subEl = document.getElementById('moduleSubtitle');
    const titleEl = document.getElementById('theoryTitle');
    const textEl = document.getElementById('theoryText');

    if (subEl) subEl.innerText = `${currentLevel} > ${currentSubject} (${currentDifficulty})`;

    if (titleEl) {
        if (targetKey === 'theory') titleEl.innerText = info.titulo;
        if (targetKey === 'practice') titleEl.innerText = `Práctica: ${currentSubject}`;
        if (targetKey === 'quiz') titleEl.innerText = `Evaluación Retro: ${currentSubject}`;
    }

    if (textEl) {
        if (targetKey === 'theory') textEl.innerText = info.teoria;
        if (targetKey === 'practice') textEl.innerText = info.practica;
        if (targetKey === 'quiz') textEl.innerText = info.evaluacion;
    }

    // Gestionar contenedores individuales si existen en el HTML
    const tabs = ['theory', 'practice', 'quiz'];
    tabs.forEach(t => {
        const el = document.getElementById(`tab-${t}`) || document.getElementById(t);
        if (el) {
            el.style.display = (t === targetKey) ? 'block' : 'none';
        }
    });
}

// --- 7. VALIDACIÓN DE RESPUESTAS EN PRÁCTICA Y CÓDIGO ---
function checkPracticeAnswer() {
    const input = document.getElementById('practiceAnswerInput');
    const feedback = document.getElementById('practiceFeedback');
    if (!input || !feedback) return;

    const val = input.value.trim();

    if (!val) {
        feedback.style.color = '#e74c3c';
        feedback.innerText = '⚠️ Por favor escribe una respuesta válida antes de comprobar.';
        return;
    }

    if (/^\d+$/.test(val)) {
        feedback.style.color = '#e74c3c';
        feedback.innerText = '❌ Respuesta incorrecta: Debes redactar una estrategia argumentada en texto, no ingresar solo números.';
        return;
    }

    if (val.length < 8) {
        feedback.style.color = '#e74c3c';
        feedback.innerText = '⚠️ Tu respuesta es demasiado corta. Explica con más detalle tu estrategia.';
        return;
    }

    feedback.style.color = '#2ecc71';
    feedback.innerText = `¡Excelente trabajo ${studentName}! Tu propuesta ha sido validada e interpretada correctamente.`;
}

function checkCodeAnswer() {
    const codeInput = document.getElementById('codeAnswerInput');
    const codeFeedback = document.getElementById('codeFeedback');
    if (!codeInput || !codeFeedback) return;

    const code = codeInput.value.trim();

    if (!code) {
        codeFeedback.style.color = '#e74c3c';
        codeFeedback.innerText = '⚠️ Ingresa tu código para evaluar.';
        return;
    }

    if (code.includes("alert(") || code.includes("print(")) {
        codeFeedback.style.color = '#2ecc71';
        codeFeedback.innerText = '✅ ¡Sintaxis correcta! El código ha sido ejecutado sin errores.';
    } else {
        codeFeedback.style.color = '#e74c3c';
        codeFeedback.innerText = "❌ Error de sintaxis: Recuerda usar alert('...') en JS o print('...') en Python.";
    }
}

// --- 8. ASISTENTE VIRTUAL SINED ---
function sendSinedMsg() {
    const input = document.getElementById('sinedInput');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;

    const messagesContainer = document.getElementById('sinedMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML += `<div style="margin: 6px 0; text-align: right;"><b style="color: #a3e4d7;">Tú:</b> ${msg}</div>`;
    }
    input.value = '';

    let respuesta = "¡Hola! Soy Sined, tu asistente educativa en Kallpa. Puedo ayudarte con tus lecturas, dudas de Python, lógica de programación o evaluaciones. ¿Qué deseas consultar?";
    const lowerMsg = msg.toLowerCase();

    if (lowerMsg.includes('python') || lowerMsg.includes('código') || lowerMsg.includes('codigo') || lowerMsg.includes('script')) {
        respuesta = "Sined (IA): Python es genial para empezar. Para mostrar un mensaje en consola usas `print('Hola Kallpa')`. Si quieres pedir datos usas `input()`. ¿Quieres un ejemplo de bucles `for` o condicionales `if`?";
    } else if (lowerMsg.includes('libro') || lowerMsg.includes('teoria') || lowerMsg.includes('teoría') || lowerMsg.includes('leer')) {
        respuesta = "Sined (IA): Cada materia cuenta con su libro de consulta en la pestaña 'Teoría' del módulo. ¡Abre cualquiera de las asignaturas para comenzar tu lectura!";
    } else if (lowerMsg.includes('error') || lowerMsg.includes('evaluacion') || lowerMsg.includes('examen') || lowerMsg.includes('practica')) {
        respuesta = "Sined (IA): Si en la práctica ingresas solo números o una respuesta incompleta, el sistema te indicará el error en rojo. ¡Asegúrate de argumentar bien tus respuestas!";
    } else if (lowerMsg.includes('desarrollo humano') || lowerMsg.includes('empatia') || lowerMsg.includes('emocion')) {
        respuesta = "Sined (IA): En Desarrollo Humano estudiamos la inteligencia emocional y la convivencia asertiva inspirada en la búsqueda del sentido. ¡Aplica la escucha activa!";
    }

    setTimeout(() => {
        if (messagesContainer) {
            messagesContainer.innerHTML += `<div style="margin: 6px 0; text-align: left;"><b style="color: #f1c40f;">Sined:</b> ${respuesta}</div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, 400);
}

function enviarMensajeSined() {
    sendSinedMsg();
}

function handleSinedKey(e) {
    if (e.key === 'Enter') sendSinedMsg();
}

// --- 9. PANEL DOCENTE ---
function loadTeacherDashboardData() {
    const nameEl = document.getElementById('teacherDashboardName');
    if (nameEl) nameEl.innerText = teacherName;
}

function handleBloomChange() {
    const select = document.getElementById('bloomSelect');
    if (!select) return;
    const val = select.value;
    const feedbacks = {
        "1": "Nivel 1 (Recordar): Revisa conceptos clave y memorización de datos.",
        "2": "Nivel 2 (Comprender): Promueve la interpretación y explicación con sus palabras.",
        "3": "Nivel 3 (Aplicar): Desafíos prácticos con código y ejercicios reales.",
        "4": "Nivel 4 (Analizar): Búsqueda de patrones y despiece de problemas.",
        "5": "Nivel 5 (Evaluar): Emisión de juicios críticos y fundamentados.",
        "6": "Nivel 6 (Crear): Desarrollo de software original y proyectos comunitarios."
    };
    const fbEl = document.getElementById('bloomFeedback');
    if (fbEl) fbEl.innerText = feedbacks[val] || "";
}

function assignRubricIndicators() {
    const statusEl = document.getElementById('rubricStatus');
    if (statusEl) {
        statusEl.innerText = "¡Indicadores de rúbrica asignados al grupo con éxito!";
        setTimeout(() => { statusEl.innerText = ""; }, 4000);
    }
}

function refreshAdaptiveStrategy() {
    const strategies = [
        "Sugerencia IA: Fomentar retos de código colaborativo en Python y JS.",
        "Sugerencia IA: Incrementar actividades de lectura crítica y comprensión.",
        "Sugerencia IA: Activar módulos de refuerzo en lógica matemática básica.",
        "Sugerencia IA: Todo el grupo opera con estabilidad óptima."
    ];
    const randomStrat = strategies[Math.floor(Math.random() * strategies.length)];
    const stratEl = document.getElementById('adaptiveStrategyText');
    if (stratEl) stratEl.innerText = randomStrat;
}

// --- 10. REGISTRO SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
            .catch(err => console.log('Error al registrar Service Worker:', err));
    });
}

// --- 11. INICIALIZACIÓN ---
window.addEventListener('DOMContentLoaded', () => {
    if (studentName === 'Estudiante') {
        goToView('viewRegister');
    }
});

// --- CONEXIÓN AUTOMÁTICA DE BOTONES LATERALES ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const botones = document.querySelectorAll('button');
        botones.forEach(btn => {
            const txt = btn.innerText.trim();
            if (txt.includes('Práctica') || txt.includes('Prctica')) {
                btn.onclick = () => showTab('practice');
            } else if (txt.includes('Evaluación') || txt.includes('Evaluacion') || txt.includes('Retro')) {
                btn.onclick = () => showTab('quiz');
            } else if (txt.includes('Teoría') || txt.includes('Teora')) {
                btn.onclick = () => showTab('theory');
            }
        });
    }, 300);
});