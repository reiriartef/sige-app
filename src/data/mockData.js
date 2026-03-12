// ============================================================
// Datos estáticos de prueba para el frontend
// ============================================================

export const currentUser = {
  id: 1,
  name: "Prof. María González",
  email: "maria.gonzalez@instituto.edu",
  role: "profesor",
  avatar: null,
};

// ---------- Materias ----------
export const subjects = [
  {
    id: 1,
    name: "Matemáticas",
    code: "MAT-301",
    year: "3er Año",
    section: "A",
  },
  { id: 2, name: "Física", code: "FIS-301", year: "3er Año", section: "A" },
  { id: 3, name: "Química", code: "QUI-201", year: "2do Año", section: "B" },
  {
    id: 4,
    name: "Lengua y Literatura",
    code: "LEN-101",
    year: "1er Año",
    section: "A",
  },
  { id: 5, name: "Historia", code: "HIS-201", year: "2do Año", section: "A" },
];

// ---------- Estudiantes ----------
export const students = [
  {
    id: 1,
    name: "Carlos Pérez",
    cedula: "V-28.123.456",
    year: "3er Año",
    section: "A",
    email: "carlos.perez@correo.com",
    attendance: 92,
    average: 16.5,
    predictedFinal: 17.1,
    riskLevel: "normal",
    studyHours: 12,
    subjects: [
      { subjectId: 1, grade1: 17, grade2: 16, grade3: 17, attendance: 95 },
      { subjectId: 2, grade1: 15, grade2: 16, grade3: null, attendance: 90 },
    ],
  },
  {
    id: 2,
    name: "Ana Rodríguez",
    cedula: "V-29.234.567",
    year: "3er Año",
    section: "A",
    email: "ana.rodriguez@correo.com",
    attendance: 78,
    average: 12.3,
    predictedFinal: 11.0,
    riskLevel: "warning",
    studyHours: 7,
    subjects: [
      { subjectId: 1, grade1: 12, grade2: 11, grade3: 13, attendance: 80 },
      { subjectId: 2, grade1: 13, grade2: 12, grade3: null, attendance: 75 },
    ],
  },
  {
    id: 3,
    name: "Luis Martínez",
    cedula: "V-28.345.678",
    year: "3er Año",
    section: "A",
    email: "luis.martinez@correo.com",
    attendance: 55,
    average: 8.2,
    predictedFinal: 6.5,
    riskLevel: "danger",
    studyHours: 3,
    subjects: [
      { subjectId: 1, grade1: 8, grade2: 7, grade3: 9, attendance: 50 },
      { subjectId: 2, grade1: 9, grade2: 8, grade3: null, attendance: 60 },
    ],
  },
  {
    id: 4,
    name: "María Fernández",
    cedula: "V-29.456.789",
    year: "2do Año",
    section: "B",
    email: "maria.fernandez@correo.com",
    attendance: 88,
    average: 15.0,
    predictedFinal: 15.8,
    riskLevel: "normal",
    studyHours: 10,
    subjects: [
      { subjectId: 3, grade1: 15, grade2: 16, grade3: 14, attendance: 88 },
      { subjectId: 5, grade1: 14, grade2: 15, grade3: null, attendance: 88 },
    ],
  },
  {
    id: 5,
    name: "José García",
    cedula: "V-28.567.890",
    year: "2do Año",
    section: "A",
    email: "jose.garcia@correo.com",
    attendance: 65,
    average: 9.8,
    predictedFinal: 8.2,
    riskLevel: "danger",
    studyHours: 4,
    subjects: [
      { subjectId: 5, grade1: 10, grade2: 9, grade3: 10, attendance: 65 },
    ],
  },
  {
    id: 6,
    name: "Valentina López",
    cedula: "V-29.678.901",
    year: "1er Año",
    section: "A",
    email: "valentina.lopez@correo.com",
    attendance: 95,
    average: 18.2,
    predictedFinal: 18.9,
    riskLevel: "normal",
    studyHours: 15,
    subjects: [
      { subjectId: 4, grade1: 18, grade2: 19, grade3: 18, attendance: 95 },
    ],
  },
  {
    id: 7,
    name: "Diego Ramírez",
    cedula: "V-28.789.012",
    year: "3er Año",
    section: "A",
    email: "diego.ramirez@correo.com",
    attendance: 72,
    average: 11.0,
    predictedFinal: 9.5,
    riskLevel: "warning",
    studyHours: 6,
    subjects: [
      { subjectId: 1, grade1: 11, grade2: 10, grade3: 12, attendance: 70 },
      { subjectId: 2, grade1: 12, grade2: 10, grade3: null, attendance: 74 },
    ],
  },
  {
    id: 8,
    name: "Camila Torres",
    cedula: "V-29.890.123",
    year: "2do Año",
    section: "B",
    email: "camila.torres@correo.com",
    attendance: 82,
    average: 14.0,
    predictedFinal: 13.5,
    riskLevel: "normal",
    studyHours: 9,
    subjects: [
      { subjectId: 3, grade1: 14, grade2: 13, grade3: 15, attendance: 82 },
    ],
  },
  {
    id: 9,
    name: "Andrés Morales",
    cedula: "V-28.901.234",
    year: "1er Año",
    section: "A",
    email: "andres.morales@correo.com",
    attendance: 60,
    average: 9.0,
    predictedFinal: 7.8,
    riskLevel: "danger",
    studyHours: 3,
    subjects: [
      { subjectId: 4, grade1: 9, grade2: 8, grade3: 10, attendance: 60 },
    ],
  },
  {
    id: 10,
    name: "Sofía Herrera",
    cedula: "V-29.012.345",
    year: "3er Año",
    section: "A",
    email: "sofia.herrera@correo.com",
    attendance: 90,
    average: 17.0,
    predictedFinal: 17.5,
    riskLevel: "normal",
    studyHours: 13,
    subjects: [
      { subjectId: 1, grade1: 17, grade2: 18, grade3: 16, attendance: 92 },
      { subjectId: 2, grade1: 16, grade2: 17, grade3: null, attendance: 88 },
    ],
  },
];

// ---------- Datos para gráfico de dispersión (regresión) ----------
export const regressionData = students.map((s) => ({
  name: s.name,
  attendance: s.attendance,
  average: s.average,
  predicted: s.predictedFinal,
  studyHours: s.studyHours,
}));

// ---------- Línea de regresión calculada (asistencia → promedio) ----------
function computeRegressionLine(data) {
  const n = data.length;
  const sumX = data.reduce((a, d) => a + d.attendance, 0);
  const sumY = data.reduce((a, d) => a + d.average, 0);
  const sumXY = data.reduce((a, d) => a + d.attendance * d.average, 0);
  const sumX2 = data.reduce((a, d) => a + d.attendance * d.attendance, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const minX = Math.min(...data.map((d) => d.attendance));
  const maxX = Math.max(...data.map((d) => d.attendance));
  return [
    { attendance: minX, trend: +(slope * minX + intercept).toFixed(1) },
    { attendance: maxX, trend: +(slope * maxX + intercept).toFixed(1) },
  ];
}
export const regressionLine = computeRegressionLine(regressionData);

// ---------- Datos de tendencia mensual ----------
export const monthlyTrend = [
  { month: "Sep", avgGrade: 13.5, avgAttendance: 85 },
  { month: "Oct", avgGrade: 13.2, avgAttendance: 83 },
  { month: "Nov", avgGrade: 12.8, avgAttendance: 80 },
  { month: "Dic", avgGrade: 12.5, avgAttendance: 78 },
  { month: "Ene", avgGrade: 13.0, avgAttendance: 81 },
  { month: "Feb", avgGrade: 13.4, avgAttendance: 82 },
  { month: "Mar", avgGrade: 13.1, avgAttendance: 80 },
];

// ---------- Stats resumen ----------
export const dashboardStats = {
  totalStudents: students.length,
  atRisk: students.filter((s) => s.riskLevel === "danger").length,
  warning: students.filter((s) => s.riskLevel === "warning").length,
  averageAttendance: Math.round(
    students.reduce((acc, s) => acc + s.attendance, 0) / students.length,
  ),
  generalAverage: +(
    students.reduce((acc, s) => acc + s.average, 0) / students.length
  ).toFixed(1),
};

// ---------- Alertas recientes ----------
export const recentAlerts = [
  {
    id: 1,
    studentId: 3,
    studentName: "Luis Martínez",
    type: "danger",
    message:
      "Predicción de nota final: 6.5 — por debajo del mínimo aprobatorio (10).",
    date: "2026-03-12",
  },
  {
    id: 2,
    studentId: 5,
    studentName: "José García",
    type: "danger",
    message: "Asistencia al 65% e inasistencias superiores al 20%.",
    date: "2026-03-11",
  },
  {
    id: 3,
    studentId: 9,
    studentName: "Andrés Morales",
    type: "danger",
    message: "Predicción de nota final: 7.8 — riesgo alto de reprobación.",
    date: "2026-03-11",
  },
  {
    id: 4,
    studentId: 2,
    studentName: "Ana Rodríguez",
    type: "warning",
    message:
      "Tendencia descendente en calificaciones durante los últimos 2 meses.",
    date: "2026-03-10",
  },
  {
    id: 5,
    studentId: 7,
    studentName: "Diego Ramírez",
    type: "warning",
    message: "Asistencia al 72% — acercándose al umbral de riesgo.",
    date: "2026-03-10",
  },
];

// ---------- Profesores ----------
export const teachers = [
  {
    id: 1,
    name: "Prof. María González",
    email: "maria.gonzalez@instituto.edu",
    phone: "0414-555-0001",
    subjectIds: [1, 2],
    status: "activo",
  },
  {
    id: 2,
    name: "Prof. Carlos Mendoza",
    email: "carlos.mendoza@instituto.edu",
    phone: "0414-555-0002",
    subjectIds: [3],
    status: "activo",
  },
  {
    id: 3,
    name: "Prof. Ana Beltrán",
    email: "ana.beltran@instituto.edu",
    phone: "0414-555-0003",
    subjectIds: [4],
    status: "activo",
  },
  {
    id: 4,
    name: "Prof. Luis Paredes",
    email: "luis.paredes@instituto.edu",
    phone: "0414-555-0004",
    subjectIds: [5],
    status: "activo",
  },
  {
    id: 5,
    name: "Prof. Rosa Díaz",
    email: "rosa.diaz@instituto.edu",
    phone: "0414-555-0005",
    subjectIds: [],
    status: "inactivo",
  },
];

// ---------- Respuestas del ChatBot (Profesor) ----------
export const chatBotResponsesProfesor = {
  greeting:
    "¡Hola, profesor! Soy el asistente SIGE. Puedo ayudarte con información sobre el rendimiento de tus estudiantes. ¿Qué necesitas saber?",
  inasistencias:
    "Los alumnos con más del 20% de inasistencias son:\n• Luis Martínez — 45% de inasistencias\n• José García — 35% de inasistencias\n• Andrés Morales — 40% de inasistencias",
  riesgo:
    "Actualmente hay 3 alumnos en Alerta Roja (alto riesgo de reprobación):\n• Luis Martínez (predicción: 6.5)\n• José García (predicción: 8.2)\n• Andrés Morales (predicción: 7.8)",
  resumen:
    "Resumen general de la clase:\n• Total de estudiantes: 10\n• Promedio general: 13.1\n• Asistencia promedio: 78.7%\n• En riesgo: 3 alumnos\n• En advertencia: 2 alumnos\n• Sin riesgo: 5 alumnos",
  default:
    "No entiendo tu consulta. Puedes preguntarme sobre:\n• Alumnos con inasistencias\n• Alumnos en riesgo\n• Resumen de la clase\n• Estado de un alumno específico",
};

// ---------- Respuestas del ChatBot (Alumno) ----------
export const chatBotResponsesAlumno = {
  greeting:
    "¡Hola! Soy tu tutor virtual SIGE. Puedo ayudarte a revisar tu rendimiento, sugerirte recursos de estudio y agendar asesorías con tus profesores.",
  rendimiento:
    "Tu estado actual:\n• Promedio general: 8.2\n• Asistencia: 55%\n• Predicción de nota final: 6.5 (⚠️ por debajo del mínimo aprobatorio)\n\nEs importante que mejores tu asistencia y dediques más horas de estudio.",
  recursos:
    'Basado en tu rendimiento en Matemáticas, te recomiendo:\n\n📚 Recursos sugeridos:\n• Khan Academy — Álgebra y Funciones\n• Ejercicios resueltos del tema 3 (disponibles en la biblioteca virtual)\n• Videos de repaso: canal "Matemáticas Profe Alex"\n\n📝 Plan de estudio sugerido:\n• Dedicar al menos 2 horas diarias a ejercicios prácticos\n• Repasar los temas de las evaluaciones 1 y 2 antes del próximo parcial',
  asesoria:
    "📅 Asesoría agendada exitosamente:\n\n• Profesor: Prof. María González\n• Materia: Matemáticas\n• Fecha: Próximo martes, 2:00 PM\n• Lugar: Aula 204\n\nRecibirás un recordatorio el día anterior. ¡No faltes!",
  prediccion:
    "📊 Tu proyección de nota final:\n\n• Matemáticas: predicción 6.5 — ⚠️ Riesgo alto\n• Física: predicción 8.0 — ⚠️ Riesgo moderado\n\nSi mejoras tu asistencia al 80% y subes tus calificaciones parciales a 12+, tu predicción podría subir a 11.2 (aprobado).",
  default:
    "No entiendo tu consulta. Puedes preguntarme sobre:\n• Mi rendimiento actual\n• Recursos de estudio recomendados\n• Agendar una asesoría con un profesor\n• Mi predicción de nota final",
};
