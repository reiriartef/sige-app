import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  ArrowLeft,
  Users,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  ChevronRight,
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
import { subjects, students } from "../data/mockData";

const riskBadge = {
  danger: { label: "Alto Riesgo", cls: "bg-danger-100 text-danger-700" },
  warning: { label: "Advertencia", cls: "bg-warning-100 text-warning-600" },
  normal: { label: "Normal", cls: "bg-success-100 text-success-600" },
};

export default function SubjectDetail() {
  const { id } = useParams();
  const subject = subjects.find((s) => s.id === Number(id));

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

  // Chart data: per-student grades in this subject
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

      {/* Chart: Grades per student */}
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

      {/* Enrolled students table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">
            Estudiantes inscritos ({enrolled.length})
          </h3>
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
                      <Link
                        to={`/estudiantes/${s.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        Ver
                        <ChevronRight size={14} />
                      </Link>
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
                    No hay estudiantes inscritos en esta materia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
