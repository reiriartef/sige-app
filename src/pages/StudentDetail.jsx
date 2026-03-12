import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Clock, BookOpen, AlertTriangle } from "lucide-react";
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
import { students, subjects } from "../data/mockData";

const riskConfig = {
  danger: { label: "Alto Riesgo", cls: "bg-danger-100 text-danger-700 border-danger-200" },
  warning: { label: "Advertencia", cls: "bg-warning-100 text-warning-600 border-warning-200" },
  normal: { label: "Normal", cls: "bg-success-100 text-success-600 border-success-200" },
};

export default function StudentDetail() {
  const { id } = useParams();
  const student = students.find((s) => s.id === Number(id));

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Estudiante no encontrado.</p>
        <Link to="/estudiantes" className="text-primary-600 text-sm mt-2 inline-block">
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
                {student.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
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
              student.predictedFinal < 10 ? "text-danger-500" : "text-success-500"
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
          <p className="text-2xl font-bold text-slate-800">{student.attendance}%</p>
          <p className="text-xs text-slate-500">Asistencia</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <BookOpen size={20} className="mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-bold text-slate-800">{student.studyHours}h</p>
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
            <LineChart data={gradeEvolution} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Mín.", fontSize: 11, fill: "#ef4444" }} />
              <Line type="monotone" dataKey="grade" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} name="Calificación" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Comparativa por Materia — Promedio vs Asistencia
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectComparison} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="promedio" fill="#3b82f6" name="Promedio" radius={[4, 4, 0, 0]} />
              <Bar dataKey="asistencia" fill="#22c55e" name="Asistencia %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grades table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Detalle de Calificaciones
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Materia</th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">Eval 1</th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">Eval 2</th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">Eval 3</th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">Asistencia</th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((ss) => {
                const subj = subjects.find((s) => s.id === ss.subjectId);
                const grades = [ss.grade1, ss.grade2, ss.grade3].filter((g) => g !== null);
                const avg = +(grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
                return (
                  <tr key={ss.subjectId} className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-medium text-slate-700">{subj?.name}</td>
                    <td className="px-4 py-2.5 text-center text-slate-600">{ss.grade1 ?? "—"}</td>
                    <td className="px-4 py-2.5 text-center text-slate-600">{ss.grade2 ?? "—"}</td>
                    <td className="px-4 py-2.5 text-center text-slate-600">{ss.grade3 ?? "—"}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={ss.attendance < 75 ? "text-danger-600 font-semibold" : "text-slate-600"}>
                        {ss.attendance}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={avg < 10 ? "text-danger-600 font-bold" : "text-slate-800 font-semibold"}>
                        {avg}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
