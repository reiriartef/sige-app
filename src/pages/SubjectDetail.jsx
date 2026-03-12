import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  ArrowLeft,
  Users,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  Pencil,
  Plus,
  UserMinus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import useAcademicStore from "../stores/academicStore";
import Modal from "../components/Modal";

const riskBadge = {
  danger: { label: "Alto Riesgo", cls: "bg-danger-100 text-danger-700" },
  warning: { label: "Advertencia", cls: "bg-warning-100 text-warning-600" },
  normal: { label: "Normal", cls: "bg-success-100 text-success-600" },
};

export default function SubjectDetail() {
  const { id } = useParams();
  const subjects = useAcademicStore((s) => s.subjects);
  const students = useAcademicStore((s) => s.students);
  const updateGrade = useAcademicStore((s) => s.updateGrade);
  const updateSubjectAttendance = useAcademicStore(
    (s) => s.updateSubjectAttendance,
  );
  const enrollStudent = useAcademicStore((s) => s.enrollStudent);
  const unenrollStudent = useAcademicStore((s) => s.unenrollStudent);

  const subject = subjects.find((s) => s.id === Number(id));

  const [editModal, setEditModal] = useState(null);
  const [enrollModal, setEnrollModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  if (!subject) {
    return (
      <div className="text-center py-20 text-slate-400">
        Materia no encontrada.
      </div>
    );
  }

  // Students enrolled in this subject
  const enrolled = students.filter((s) =>
    s.subjects.some((ss) => ss.subjectId === subject.id),
  );
  // Students NOT enrolled (for the enroll modal)
  const notEnrolled = students.filter(
    (s) => !s.subjects.some((ss) => ss.subjectId === subject.id),
  );

  // Compute stats
  const avgGrade =
    enrolled.length > 0
      ? +(
          enrolled.reduce((a, s) => a + s.average, 0) / enrolled.length
        ).toFixed(1)
      : 0;
  const avgAttendance =
    enrolled.length > 0
      ? Math.round(
          enrolled.reduce((a, s) => {
            const ss = s.subjects.find((x) => x.subjectId === subject.id);
            return a + (ss?.attendance || 0);
          }, 0) / enrolled.length,
        )
      : 0;
  const atRisk = enrolled.filter((s) => s.riskLevel === "danger").length;

  // Chart data
  const gradeChartData = enrolled.map((s) => {
    const ss = s.subjects.find((x) => x.subjectId === subject.id);
    return {
      name: s.name.split(" ")[0],
      "Eval 1": ss?.grade1 ?? 0,
      "Eval 2": ss?.grade2 ?? 0,
      "Eval 3": ss?.grade3 ?? null,
    };
  });

  const statCards = [
    {
      label: "Inscritos",
      value: enrolled.length,
      icon: Users,
      color: "text-primary-600 bg-primary-50",
    },
    {
      label: "Promedio",
      value: avgGrade,
      icon: TrendingUp,
      color: "text-success-600 bg-success-50",
    },
    {
      label: "Asistencia",
      value: `${avgAttendance}%`,
      icon: BarChart3,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "En riesgo",
      value: atRisk,
      icon: AlertTriangle,
      color: "text-danger-600 bg-danger-50",
    },
  ];

  const openEdit = (s) => {
    const ss = s.subjects.find((x) => x.subjectId === subject.id);
    setEditModal({
      studentId: s.id,
      studentName: s.name,
      subjectId: subject.id,
      grade1: ss?.grade1 ?? "",
      grade2: ss?.grade2 ?? "",
      grade3: ss?.grade3 ?? "",
      attendance: ss?.attendance ?? 80,
    });
  };

  const saveEdit = () => {
    if (!editModal) return;
    const { studentId, subjectId, grade1, grade2, grade3, attendance } =
      editModal;
    updateGrade(studentId, subjectId, "grade1", grade1);
    updateGrade(studentId, subjectId, "grade2", grade2);
    updateGrade(studentId, subjectId, "grade3", grade3);
    updateSubjectAttendance(studentId, subjectId, attendance);
    setEditModal(null);
  };

  const handleEnroll = () => {
    if (!selectedStudentId) return;
    enrollStudent(Number(selectedStudentId), subject.id);
    setSelectedStudentId("");
    setEnrollModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          to="/materias"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-3"
        >
          <ArrowLeft size={15} />
          Volver a Materias
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{subject.name}</h2>
            <p className="text-sm text-slate-400">
              {subject.code} — {subject.year} — Sección {subject.section}
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
            >
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-400">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {enrolled.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Calificaciones por estudiante
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeChartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine
                y={10}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: "Mín.", fontSize: 11, fill: "#ef4444" }}
              />
              <Bar dataKey="Eval 1" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Eval 2" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Eval 3" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Enrolled students table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            Estudiantes inscritos ({enrolled.length})
          </h3>
          <button
            onClick={() => {
              setSelectedStudentId("");
              setEnrollModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={14} />
            Inscribir alumno
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 font-semibold text-slate-600">
                  Estudiante
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Eval 1
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Eval 2
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Eval 3
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Asistencia
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Estado
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {enrolled.map((s) => {
                const ss = s.subjects.find((x) => x.subjectId === subject.id);
                const badge = riskBadge[s.riskLevel];
                return (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {s.name}
                    </td>
                    <td className="px-5 py-3 text-center text-slate-600">
                      {ss?.grade1 ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-center text-slate-600">
                      {ss?.grade2 ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-center text-slate-600">
                      {ss?.grade3 ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={
                          ss?.attendance < 75
                            ? "text-danger-600 font-semibold"
                            : "text-slate-600"
                        }
                      >
                        {ss?.attendance ?? 0}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700"
                          title="Editar notas"
                        >
                          <Pencil size={13} />
                          Notas
                        </button>
                        <button
                          onClick={() => unenrollStudent(s.id, subject.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-danger-500 hover:text-danger-700"
                          title="Desinscribir"
                        >
                          <UserMinus size={13} />
                        </button>
                        <Link
                          to={`/estudiantes/${s.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                          Ver
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {enrolled.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    No hay estudiantes inscritos. Usa el botón "Inscribir
                    alumno" para agregar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit grades/attendance modal */}
      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title={`Editar notas — ${editModal?.studentName || ""}`}
      >
        {editModal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEdit();
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

      {/* Enroll student modal */}
      <Modal
        open={enrollModal}
        onClose={() => setEnrollModal(false)}
        title="Inscribir alumno en esta materia"
      >
        {notEnrolled.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">
            Todos los estudiantes ya están inscritos en esta materia.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Seleccionar estudiante
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              >
                <option value="">— Seleccionar —</option>
                {notEnrolled.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.cedula})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-400">
              El alumno se inscribirá con notas vacías y 80% de asistencia por
              defecto. Podrás editarlas después.
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
                onClick={handleEnroll}
                disabled={!selectedStudentId}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Inscribir
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
