let currentLevel = 'Secundaria';
let currentDifficulty = 'Básico';
let currentSubject = 'Matemáticas';
let studentName = 'Estudiante';
let schoolName = '';
let userRole = 'student';

function switchRole(role) {
    userRole = role;
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    
    if(role === 'student') {
        document.querySelectorAll('.role-btn')[0].classList.add('active');
        goToView('viewRegister');
    } else {
        document.querySelectorAll('.role-btn')[1].classList.add('active');
        goToView('viewTeacherRegister');
    }
}
function handleRegister() {
    const nameInput = document.getElementById('regName').value.trim();
    const schoolInput = document.getElementById('regSchool').value.trim();
    const emailInput = document.getElementById('regEmail').value.trim();

    if(!nameInput || !schoolInput || !emailInput) {
        alert('Por favor completa todos los datos de registro (Nombre, Escuela y Correo).');
        return;
    }

    studentName = nameInput;
    schoolName = schoolInput;

    document.getElementById('userBadge').innerText = studentName + ' (' + schoolName + ')';
    
    // Inicializar el saludo personalizado fluido de Sined con el nombre del usuario registrado
    const messages = document.getElementById('sinedMessages');
    messages.innerHTML = `<div class="msg bot">¡Hola ${studentName}! Soy Sined, mucho gusto, seré tu Asistente Virtual en Kallpa. ¿En qué te puedo apoyar hoy con tus materias?</div>`;

    goToView('viewLevels');
}

function goToView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
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
    document.getElementById('badgeMath').innerText = 'Nivel ' + diff;
    document.getElementById('badgeHuman').innerText = 'Nivel ' + diff;
    document.getElementById('badgeAI').innerText = 'Nivel ' + diff;
    document.getElementById('badgeRobot').innerText = 'Nivel ' + diff;
    document.getElementById('badgeProg').innerText = 'Nivel ' + diff;
    document.getElementById('badgeEng').innerText = 'Nivel ' + diff;
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

function toggleSined() {
    const box = document.getElementById('sinedChatBox');
    box.classList.toggle('open');
}

function sendSinedMsg() {
    const input = document.getElementById('sinedInput');
    const text = input.value.trim();
    if(!text) return;

    const messages = document.getElementById('sinedMessages');
    messages.innerHTML += `<div class="msg user">${text}</div>`;
    input.value = '';

    setTimeout(() => {
        let reply = 'Claro que sí, ' + studentName + '. Como tu asistente Sined, te sugiero repasar la teoría del nivel ' + currentDifficulty + ' y practicar con calma.';
        if(text.toLowerCase().includes('matemáticas')) {
            reply = 'Las matemáticas requieren práctica constante, ' + studentName + '. ¿En qué operación te puedo ayudar hoy?';
        } else if(text.toLowerCase().includes('inglés') || text.toLowerCase().includes('english')) {
            reply = 'Learning English is amazing, ' + studentName + '! Practiquemos vocabulario o estructura básica.';
        } else if(text.toLowerCase().includes('ia') || text.toLowerCase().includes('programación')) {
            reply = '¡Excelente iniciativa tecnológica! La programación y la IA son clave para nuestros proyectos.';
        }
        messages.innerHTML += `<div class="msg bot">${reply}</div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 500);
}

function handleSinedKey(e) {
    if(e.key === 'Enter') sendSinedMsg();
}


