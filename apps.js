
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

// --- 2. GESTIÓN DE ROLES Y VISTAS ---
function switchRole(role) {
    userRole = role;
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(b => b.classList.remove('active'));
    
    if(role === 'student') {
        if(roleButtons[0]) roleButtons[0].classList.add('active');
        // Si ya hay registro de estudiante, va directo a los niveles; si no, al registro
        if(studentName && studentName !== 'Estudiante') {
            goToView('viewLevels');
        } else {
            goToView('viewRegister');
        }
    } else {
        if(roleButtons[1]) roleButtons[1].classList.add('active');
        // Si ya hay registro de docente, va directo al panel; si no, al registro docente
        if(teacherName && teacherName !== 'Docente') {
            loadTeacherDashboardData();
            goToView('viewTeacherDashboard');
        } else {
            goToView('viewTeacherRegister');
        }
    }
}

// --- DICCIONARIO DE CONTENIDOS POR ASIGNATURA ---
const subjectContents = {
    'Matemáticas': {
        theory: 'Estudio de patrones numéricos, álgebra y resolución de problemas lógicos aplicados al razonamiento cotidiano y comunitario.',
        practicePrompt: 'Resuelve la ecuación básica: 2x + 4 = 12. ¿Cuál es el valor de x?',
        answerKey: '4'
    },
    'Desarrollo Humano': {
        theory: 'Fomento de la inteligencia emocional, el autoconocimiento, la empatía y la convivencia comunitaria constructiva.',
        practicePrompt: 'Escribe una estrategia clave para fomentar la comunicación empática en el aula:',
        answerKey: 'empatia'
    },
    'Inteligencia Artificial': {
        theory: 'Introducción al aprendizaje automático (Machine Learning), procesamiento de datos y uso ético de asistentes inteligentes.',
        practicePrompt: '¿Cómo se le llama al subcampo de la IA que permite a las computadoras aprender a partir de datos?',
        answerKey: 'machine learning'
    },
    'Robótica': {
        theory: 'Principios de circuitería, sensores, actuadores y lógica de control para la automatización de prototipos físicos.',
        practicePrompt: '¿Qué componente electrónico actúa habitualmente como el cerebro programable de un robot educativo?',
        answerKey: 'microcontrolador'
    },
    'Lenguaje de Programación': {
        theory: 'Fundamentos de sintaxis, variables, estructuras de control y desarrollo de software utilizando JavaScript, HTML y CSS.',
        practicePrompt: 'Escribe la instrucción en JavaScript para mostrar un mensaje en consola con la frase "Hola Kallpa":',
        answerKey: 'console.log'
    },
    'Inglés': {
        theory: 'Desarrollo de habilidades comunicativas, gramática estructural y comprensión de textos técnicos e informativos.',
        practicePrompt: 'Traduce al inglés la frase: "La educación es fuerza y energía":',
        answerKey: 'education is strength and energy'
    }
};

function openModule(subj) {
    currentSubject = subj;
    const content = subjectContents[subj] || {
        theory: 'Contenido especializado para ' + subj + ' adaptado al nivel ' + currentDifficulty + '.',
        practicePrompt: 'Resuelve el desafío conceptual de ' + subj + ':',
        answerKey: ''
    };

    document.getElementById('moduleSubtitle').innerText = currentLevel + ' > ' + subj + ' (' + currentDifficulty + ')';
    document.getElementById('theoryTitle').innerText = subj + ' - Nivel ' + currentDifficulty;
    document.getElementById('theoryText').innerText = content.theory;
    
    // Actualizar dinámicamente el texto de la práctica interactiva
    const promptEl = document.getElementById('practicePrompt');
    if(promptEl) promptEl.innerText = content.practicePrompt;
    
    // Limpiar input anterior
    const inputAns = document.getElementById('practiceAnswer');
    if(inputAns) inputAns.value = '';
    const resAns = document.getElementById('practiceResult');
    if(resAns) resAns.innerText = '';

    goToView('viewModule');
}
function goToView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if(target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    } else {
        console.error("No se encontró la vista con ID:", viewId);
    }
}

// --- 3. REGISTRO Y ACCESO DOCENTE ---
function handleTeacherRegister() {
    const nameInput = document.getElementById('teachName').value.trim();
    const cedulaInput = document.getElementById('teachCedula').value.trim();
    const schoolInput = document.getElementById('teachSchool').value.trim();

    if(!nameInput || !cedulaInput || !schoolInput) {
        alert('Por favor completa los datos obligatorios del docente.');
        return;
    }

    teacherName = nameInput;
    teacherSchool = schoolInput;

    document.getElementById('userBadge').innerText = teacherName + ' (Docente)';

    loadTeacherDashboardData();
    goToView('viewTeacherDashboard');
}

function loadTeacherDashboardData() {
    const tbody = document.getElementById('studentReportTableBody');
    if (!tbody) return;
    
    // Datos de ejemplo para la tabla de avances por categoría
    const mockStudents = [
        { name: studentName !== 'Estudiante' ? studentName : 'Ana López Hernández', grade: '9.2', attendance: '95%', improvement: 'Alta en Programación', diffSubject: currentLevel === 'Primaria' ? 'Matemáticas' : 'Programación e IA', guidance: 'Reforzar lógica algorítmica' },
        { name: 'Carlos Mendoza Ruiz', grade: '8.5', attendance: '90%', improvement: 'Constante', diffSubject: 'Inglés', guidance: 'Práctica de vocabulario diario' },
        { name: 'Sofía Ramirez G.', grade: '9.8', attendance: '100%', improvement: 'Sobresaliente', diffSubject: 'Desarrollo Humano', guidance: 'Mantener liderazgo positivo' }
    ];

    tbody.innerHTML = mockStudents.map(s => `
        <tr>
            <td>${s.name}</td>
            <td><strong>${s.grade}</strong></td>
            <td>${s.attendance}</td>
            <td><span style="color: #0a4d3c; font-weight: 600;">${s.improvement}</span></td>
            <td>${s.diffSubject}</td>
            <td><em>${s.guidance}</em></td>
        </tr>
    `).join('');

    const dashTitle = document.getElementById('teacherDashTitle');
    const subInfo = document.getElementById('teacherSubInfo');
    if (dashTitle) dashTitle.innerText = 'Panel de Monitoreo Docente - ' + teacherSchool;
    if (subInfo) subInfo.innerText = 'Supervisión y reporte institucional - Categoría: ' + currentLevel;
}

function submitIEBEMReport() {
    const text = document.getElementById('iebemReportText').value.trim();
    const status = document.getElementById('iebemStatus');
    if (!text) {
        alert('Por favor escribe el informe institucional para el IEBEM.');
        return;
    }
    if (status) {
        status.innerText = '¡Informe enviado al IEBEM con éxito por ' + teacherName + '!';
    }
    alert('Informe registrado correctamente para la supervisión educativa de Morelos.');
}

// --- 4. REGISTRO Y ACCESO ESTUDIANTE ---
async function handleRegister() {
    const nameInput = document.getElementById('regName').value.trim();
    const schoolInput = document.getElementById('regSchool').value.trim();
    const emailInput = document.getElementById('regEmail').value.trim();

    if(!nameInput || !schoolInput || !emailInput) {
        alert('Por favor completa todos los datos de registro (Nombre, Escuela y Correo).');
        return;
    }

    studentName = nameInput;
    schoolName = schoolInput;

    if (supabaseClient) {
        const { error } = await supabaseClient
            .from('estudiantes_kallpa')
            .insert([{ nombre: studentName, escuela: schoolName, correo: emailInput, nivel: currentLevel, fecha_registro: new Date() }]);
        if (error) {
            console.warn('Aviso de base de datos: ' + error.message);
        }
    }

    document.getElementById('userBadge').innerText = studentName + ' (' + schoolName + ')';
    
    const messages = document.getElementById('sinedMessages');
    if (messages) {
        messages.innerHTML = `<div class="msg bot">¡Hola ${studentName}! Soy Sined, mucho gusto, seré tu Asistente Virtual en Kallpa. ¿En qué te puedo apoyar hoy con tus materias?</div>`;
    }

    goToView('viewLevels');
}

function selectLevel(level) {
    currentLevel = level;
    document.getElementById('hubTitle').innerText = 'Asignaturas - ' + level;
    goToView('viewHub');
}

function setDifficulty(btn, diff) {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentDifficulty = diff;
    
    const badges = ['badgeMath', 'badgeHuman', 'badgeAI', 'badgeRobot', 'badgeProg', 'badgeEng'];
    badges.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerText = 'Nivel ' + diff;
    });
}

function openModule(subj) {
    currentSubject = subj;
    document.getElementById('moduleSubtitle').innerText = currentLevel + ' > ' + subj + ' (' + currentDifficulty + ')';
    document.getElementById('theoryTitle').innerText = subj + ' - Nivel ' + currentDifficulty;
    document.getElementById('theoryText').innerText = 'Estudiando ' + subj + ' en nivel ' + currentDifficulty + ' (' + currentLevel + '). Este módulo incluye teoría, práctica guiada y evaluación diseñada para agilizar el aprendizaje en áreas con mayor dificultad.';
    goToView('viewModule');
}

function switchTab(evt, paneId) {
    document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.module-pane').forEach(p => p.classList.remove('active'));
    evt.currentTarget.classList.add('active');
    document.getElementById(paneId).classList.add('active');
}

function checkPractice() {
    const val = document.getElementById('practiceAnswer').value;
    const res = document.getElementById('practiceResult');
    if(val.trim() !== '') {
        res.style.color = '#0a4d3c';
        res.innerText = '¡Excelente trabajo ' + studentName + '! Tu respuesta ha sido validada correctamente.';
    } else {
        res.style.color = '#c0392b';
        res.innerText = 'Por favor ingresa una respuesta antes de comprobar.';
    }
}

// --- 5. RETO TÉCNICO INTERACTIVO ---
function validarRetoKallpa() {
    const codigoInput = document.getElementById('codigoEstudiante');
    const resultado = document.getElementById('resultadoReto');
    if (!codigoInput || !resultado) return;

    const codigo = codigoInput.value.trim();

    if (codigo.includes("alert") || codigo.includes("console.log") || codigo.length > 3) {
        resultado.style.color = "#0a4d3c";
        resultado.innerHTML = "¡Desafío superado con éxito, " + studentName + "! Tu lógica computacional en Kallpa está activa.";
    } else {
        resultado.style.color = "#c0392b";
        resultado.innerHTML = "Inténtalo de nuevo. Escribe una sentencia válida en el área de práctica.";
    }
}

let selectedQuizOption = null;
function selectQuiz(el) {
    document.querySelectorAll('.quiz-option').forEach(o => o.style.background = '#f8f9fa');
    el.style.background = '#e2ede8';
    selectedQuizOption = el;
}

function submitEval() {
    const fb = document.getElementById('evalFeedback');
    if(selectedQuizOption) {
        fb.style.color = '#0a4d3c';
        fb.innerText = '¡Evaluación completada con éxito, ' + studentName + '! Has superado el desafío de retroalimentación.';
    } else {
        fb.style.color = '#c0392b';
        fb.innerText = 'Por favor selecciona una opción de respuesta.';
    }
}

// --- 6. ASISTENTE VIRTUAL SINED ---
function toggleSined() {
    const box = document.getElementById('sinedChatBox') || document.getElementById('chatSined');
    if(box) box.classList.toggle('open');
}

function toggleChat() {
    toggleSined();
}

function sendSinedMsg() {
    const input = document.getElementById('sinedInput') || document.getElementById('userInputText');
    if(!input) return;
    const text = input.value.trim();
    if(!text) return;

    const messages = document.getElementById('sinedMessages') || document.getElementById('chatMessages');
    if(messages) {
        messages.innerHTML += `<div class="msg user">${text}</div>`;
    }
    input.value = '';

    setTimeout(() => {
        let reply = 'Claro que sí, ' + studentName + '. Como tu asistente Sined, te sugiero repasar la teoría del nivel ' + currentDifficulty + ' y practicar con calma.';
        const lower = text.toLowerCase();

        if(lower.includes('matemáticas')) {
            reply = 'Las matemáticas requieren práctica constante, ' + studentName + '. ¿En qué operación te puedo ayudar hoy?';
        } else if(lower.includes('inglés') || lower.includes('english')) {
            reply = 'Learning English is amazing, ' + studentName + '! Practiquemos vocabulario o estructura básica.';
        } else if(lower.includes('ia') || lower.includes('programación') || lower.includes('html') || lower.includes('javascript')) {
            reply = '¡Excelente iniciativa tecnológica! La programación, el desarrollo web y la IA son pilares clave para nuestros proyectos en Morelos.';
        }

        if(messages) {
            messages.innerHTML += `<div class="msg bot">${reply}</div>`;
            messages.scrollTop = messages.scrollHeight;
        }
    }, 500);
}

function enviarMensajeSined() {
    sendSinedMsg();
}

function handleSinedKey(e) {
    if(e.key === 'Enter') sendSinedMsg();
}

// --- 7. REGISTRO SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/kallpa/sw.js')
            .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
            .catch(err => console.log('Error al registrar Service Worker:', err));
    });
}

function logoutKallpa() {
    studentName = 'Estudiante';
    schoolName = '';
    teacherName = 'Docente';
    teacherSchool = '';
    userRole = 'student';
    
    const badge = document.getElementById('userBadge');
    if(badge) {
        badge.innerText = 'Invitado / Registro Pendiente';
    }
    
    // Regresa al formulario de registro de estudiante
    switchRole('student');
}