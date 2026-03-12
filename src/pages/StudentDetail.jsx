import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  BookOpen,
  AlertTriangle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import useAcademicStore from "../stores/academicStore";
import Modal from "../components/Modal";

const riskConfig = {
  danger: {
    label: "Alto Riesgo",
    cls: "bg-danger-100 text-danger-700 border-danger-200",
  },
  warning: {
    label: "Advertencia",
    cls: "bg-warning-100 text-warning-600 border-warning-200",
  },
  normal: {
    label: "Normal",
    cls: "bg-success-100 text-success-600 border-success-200",
  },
};

export default function StudentDetail() {
  const { id } = useParams();
  const students = useAcademicStore((s) => s.students);
  const subjects = useAcademicStore((s) => s.subjects);
  const updateGrade = useAcademicStore((s) => s.updateGrade);
  const updateSubjectAttendance = useAcademicStore(
    (s) => s.updateSubjectAttendance,
  );
  const enrollStudent = useAcademicStore((s) => s.enrollStudent);
  const unenrollStudent = useAcademicStore((s) => s.unenrollStudent);
  const student = students.find((s) => s.id === Number(id));

  const [editModal, setEditModal] = useState(null);
  const [enrollModal, setEnrollModal] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Estudiante no encontrado.</p>
        <Link
          to="/estudiantes"
          className="text-primary-600 text-sm mt-2 inline-block"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  const risk = riskConfig[student.riskLevel];

  const gradeEvolution = student.subjects.flatMap((ss) => {
    const subj = subjects.find((s) => s.id === ss.subjectId);
    const grades = [ss.grade1, ss.grade2, ss.grade3].filter((g) => g !== null);
    return grades.map((g, i) => ({
      label: `${subj?.name || "Materia"} - Eval ${i + 1}`,
      grade: g,
    }));
  });

  const subjectComparison = student.subjects.map((ss) => {
    const subj = subjects.find((s) => s.id === ss.subjectId);
    const grades = [ss.grade1, ss.grade2, ss.grade3].filter((g) => g !== null);
    const avg = +(grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
    return {
      name: subj?.name || "Materia",
      promedio: avg,
      asistencia: ss.attendance,
    };
  });

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          to="/estudiantes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Volver a Estudiantes
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold">
                {student.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {student.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {student.cedula} — {student.year}, Sección {student.section}
                </p>
                <p className="text-xs text-slate-400">{student.email}</p>
              </div>
            </div>
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${risk.cls}`}
            >
              {risk.label}
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <TrendingUp size={20} className="mx-auto text-primary-500 mb-1" />
          <p className="text-2xl font-bold text-slate-800">{student.average}</p>
          <p className="text-xs text-slate-500">Promedio Actual</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <AlertTriangle
            size={20}
            className={`mx-auto mb-1 ${
              student.predictedFinal < 10
                ? "text-danger-500"
                : "text-success-500"
            }`}
          />
          <p
            className={`text-2xl font-bold ${
              student.predictedFinal < 10 ? "text-danger-600" : "text-slate-800"
            }`}
          >
            {student.predictedFinal}
          </p>
          <p className="text-xs text-slate-500">Nota Predicha (Final)</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <Clock size={20} className="mx-auto text-green-500 mb-1" />
          <p className="text-2xl font-bold text-slate-800">
            {student.attendance}%
          </p>
          <p className="text-xs text-slate-500">Asistencia</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <BookOpen size={20} className="mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-bold text-slate-800">
            {student.studyHours}h
          </p>
          <p className="text-xs text-slate-500">Horas de Estudio / sem</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade evolution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Evolución de Calificaciones
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={gradeEvolution}
              margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                angle={-15}
                textAnchor="end"
                height={50}
              />
              <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <ReferenceLine
                y={10}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: "Mín.", fontSize: 11, fill: "#ef4444" }}
              />
              <Line
                type="monotone"
                dataKey="grade"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 5 }}
                name="Calificación"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Comparativa por Materia — Promedio vs Asistencia
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={subjectComparison}
              margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="promedio"
                fill="#3b82f6"
                name="Promedio"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="asistencia"
                fill="#22c55e"
                name="Asistencia %"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grades table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">
            Detalle de Calificaciones
          </h3>
          <button
            onClick={() => {
              setSelectedSubjectId("");
              setEnrollModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={14} />
            Inscribir en materia
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">
                  Materia
                </th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">
                  Eval 1
                </th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">
                  Eval 2
                </th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">
                  Eval 3
                </th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">
                  Asistencia
                </th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">
                  Promedio
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((ss) => {
                const subj = subjects.find((s) => s.id === ss.subjectId);
                const grades = [ss.grade1, ss.grade2, ss.grade3].filter(
                  (g) => g !== null,
                );
                const avg =
                  grades.length > 0
                    ? +(
                        grades.reduce((a, b) => a + b, 0) / grades.length
                      ).toFixed(1)
                    : 0;
                return (
                  <tr key={ss.subjectId} className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-medium text-slate-700">
                      {subj?.name}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-600">
                      {ss.grade1 ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-600">
                      {ss.grade2 ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-600">
                      {ss.grade3 ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={
                          ss.attendance < 75
                            ? "text-danger-600 font-semibold"
                            : "text-slate-600"
                        }
                      >
                        {ss.attendance}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={
                          avg < 10
                            ? "text-danger-600 font-bold"
                            : "text-slate-800 font-semibold"
                        }
                      >
                        {avg}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            setEditModal({
                              subjectId: ss.subjectId,
                              subjectName: subj?.name || "Materia",
                              grade1: ss.grade1 ?? "",
                              grade2: ss.grade2 ?? "",
                              grade3: ss.grade3 ?? "",
                              attendance: ss.attendance,
                            })
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700"
                        >
                          <Pencil size={13} />
                          Notas
                        </button>
                        <button
                          onClick={() =>
                            unenrollStudent(student.id, ss.subjectId)
                          }
                          className="p-1 rounded-md hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                          title="Desinscribir de esta materia"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit grades/attendance modal */}
      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title={`Editar notas — ${editModal?.subjectName || ""}`}
      >
        {editModal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { subjectId, grade1, grade2, grade3, attendance } =
                editModal;
              updateGrade(student.id, subjectId, "grade1", grade1);
              updateGrade(student.id, subjectId, "grade2", grade2);
              updateGrade(student.id, subjectId, "grade3", grade3);
              updateSubjectAttendance(student.id, subjectId, attendance);
              setEditModal(null);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-3">
              {["grade1", "grade2", "grade3"].map((field, i) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Evaluación {i + 1}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={editModal[field]}
                    onChange={(e) =>
                      setEditModal({ ...editModal, [field]: e.target.value })
                    }
                    placeholder="—"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Asistencia (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editModal.attendance}
                onChange={(e) =>
                  setEditModal({ ...editModal, attendance: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Enroll in subject modal */}
      <Modal
        open={enrollModal}
        onClose={() => setEnrollModal(false)}
        title="Inscribir en materia"
      >
        {(() => {
          const enrolledIds = student.subjects.map((ss) => ss.subjectId);
          const available = subjects.filter((s) => !enrolledIds.includes(s.id));
          if (available.length === 0) {
            return (
              <p className="text-sm text-slate-500 py-4 text-center">
                Este estudiante ya está inscrito en todas las materias.
              </p>
            );
          }
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Seleccionar materia
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                >
                  <option value="">— Seleccionar —</option>
                  {available.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-400">
                Se inscribirá con notas vacías y 80% de asistencia por defecto.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEnrollModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!selectedSubjectId) return;
                    enrollStudent(student.id, Number(selectedSubjectId));
                    setSelectedSubjectId("");
                    setEnrollModal(false);
                  }}
                  disabled={!selectedSubjectId}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Inscribir
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
