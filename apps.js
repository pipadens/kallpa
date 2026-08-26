// Base de datos de calificaciones y avances por Clave de Estudiante
const baseCalificaciones = {
    'EST-P01': [
        { asignatura: 'Finanzas y Economía con IA', parcial: 9.5, avance: 100, estado: 'Completado con Éxito' },
        { asignatura: 'Robótica y Automatización Inteligente', parcial: 8.8, avance: 75, estado: 'En Progreso' },
        { asignatura: 'Desarrollo Emocional', parcial: 9.2, avance: 100, estado: 'Completado con Éxito' }
    ],
    'EST-P02': [
        { asignatura: 'Comunicación y Medios Digitales', parcial: 8.0, avance: 60, estado: 'En Progreso' },
        { asignatura: 'Aprendizaje de Lenguaje Tecnológico', parcial: 9.0, avance: 90, estado: 'En Progreso' },
        { asignatura: 'Desarrollo Humano', parcial: 9.5, avance: 100, estado: 'Completado con Éxito' }
    ],
    // Calificación por defecto para otras claves que no estén explícitas
    'default': [
        { asignatura: 'Desarrollo Emocional y Humano', parcial: 8.5, avance: 50, estado: 'En Progreso' },
        { asignatura: 'Aprendizaje de Lenguaje Tecnológico', parcial: 9.0, avance: 80, estado: 'En Progreso' }
    ]
};// Base de datos simulada de asistencias
const baseAsistencias = [
    { escuela: 'ESC-12345', grado: '2° Secundaria', clave: 'EST-P01', nombre: 'Juan Pérez', fecha: '2026-08-26', estado: 'Presente' },
    { escuela: 'ESC-12345', grado: '2° Secundaria', clave: 'EST-P02', nombre: 'Ana Gómez', fecha: '2026-08-26', estado: 'Retardo' },
    { escuela: 'ESC-99999', grado: '3° Preparatoria', clave: 'EST-PREP01', nombre: 'Carlos Ruiz', fecha: '2026-08-26', estado: 'Ausente' }
];

// Función para registrar o actualizar asistencia
function registrarAsistencia(escuela, grado, clave, nombre, estado) {
    const fechaHoy = new Date().toISOString().split('T')[0];
    baseAsistencias.push({
        escuela,
        grado,
        clave,
        nombre,
        fecha: fechaHoy,
        estado
    });
    console.log("Asistencia registrada con éxito:", baseAsistencias);
}

// Función para filtrar asistencias por Docente/Escuela/Grado
function filtrarAsistencias(filtroEscuela, filtroGrado) {
    return baseAsistencias.filter(item => 
        item.escuela === filtroEscuela && item.grado === filtroGrado
    );
}

    return cursoGenerado;
}

function ejecutarGeneracionCurso() {
    const materiaInput = document.getElementById('inputMateriaIA');
    const enfoqueSelect = document.getElementById('selectEnfoque');
    
    if (!materiaInput || !enfoqueSelect) return;

    const materia = materiaInput.value.trim();
    const enfoque = enfoqueSelect.value;

    if (!materia) {
        alert('Por favor ingresa el nombre de la asignatura.');
        return;
    }

    // Generar módulos dinámicos basados en el texto de la materia ingresada
    let modulos = [];
    const matLower = materia.toLowerCase();

    if (matLower.includes('program') || matLower.includes('javascript') || matLower.includes('web') || matLower.includes('tecnología')) {
        modulos = [
            { num: 1, nombre: `Introducción y Configuración de Entorno en ${materia}`, durac: '2 semanas' },
            { num: 2, nombre: 'Estructuras de Código y Lógica Práctica', durac: '3 semanas' },
            { num: 3, nombre: 'Pruebas y Despliegue del Proyecto Tecnológico', durac: '3 semanas' }
        ];
    } else if (matLower.includes('finanz') || matLower.includes('econom') || matLower.includes('dinero')) {
        modulos = [
            { num: 1, nombre: 'Principios Básicos y Diagnóstico Financiero', durac: '2 semanas' },
            { num: 2, nombre: 'Modelos de Simulación de Ahorro y Riesgo', durac: '3 semanas' },
            { num: 3, nombre: 'Plan de Estabilidad y Proyecto Económico', durac: '3 semanas' }
        ];
    } else {
        // Módulos personalizados genéricos pero adaptados al nombre exacto de la materia
        modulos = [
            { num: 1, nombre: `Fundamentos Teóricos y Diagnóstico de ${materia}`, durac: '2 semanas' },
            { num: 2, nombre: `Aplicación Práctica con Enfoque de ${enfoque}`, durac: '3 semanas' },
            { num: 3, nombre: `Evaluación y Proyecto Integrador de ${materia}`, durac: '3 semanas' }
        ];
    }

    // Renderizar el resultado con los módulos correctos y diferentes por materia
    const resultadoDiv = document.getElementById('resultadoCursoIA');
    if (resultadoDiv) {
        resultadoDiv.innerHTML = `
            <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px dashed var(--accent-color);">
                <h4 style="color: var(--accent-color); margin-bottom: 5px;">Programa Académico: ${materia}</h4>
                <p style="font-size: 0.85rem; margin-bottom: 10px;"><strong>Objetivo:</strong> Desarrollar competencias avanzadas en ${materia} utilizando un enfoque de ${enfoque} para nivel docente/estudiantil.</p>
                <ul style="font-size: 0.85rem; padding-left: 20px; color: var(--text-muted);">
                    ${modulos.map(m => `<li><strong>Módulo ${m.num}:</strong> ${m.nombre} (${m.durac})</li>`).join('')}
                </ul>
            </div>
        `;
    }
}
// Instalación del Service Worker
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones para funcionamiento offline
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(response => response || fetch(e.request))
    );
});

// Si es Docente: Muestra la pestaña del panel docente y oculta las de estudiante
if (tipo === 'docentes') {
    document.getElementById('tabModulos').style.display = 'none';
    document.getElementById('tabReportes').style.display = 'none';
    document.getElementById('tabDocente').style.display = 'block';
    switchTab('docente-panel', document.getElementById('tabDocente'));
} else {
    // Si es Estudiante: Muestra los módulos y sus reportes de avance individuales
    document.getElementById('tabModulos').style.display = 'block';
    document.getElementById('tabReportes').style.display = 'block';
    document.getElementById('tabDocente').style.display = 'none';
    switchTab('modulos', document.getElementById('tabModulos'));
}