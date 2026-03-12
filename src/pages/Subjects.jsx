import { Link } from "react-router-dom";
import { BookOpen, Users } from "lucide-react";
import { subjects, students } from "../data/mockData";

export default function Subjects() {
  const subjectCards = subjects.map((subj) => {
    const enrolled = students.filter((s) =>
      s.subjects.some((ss) => ss.subjectId === subj.id),
    );
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
              const ss = s.subjects.find((x) => x.subjectId === subj.id);
              return a + (ss?.attendance || 0);
            }, 0) / enrolled.length,
          )
        : 0;
    const atRisk = enrolled.filter((s) => s.riskLevel === "danger").length;

    return {
      ...subj,
      enrolled: enrolled.length,
      avgGrade,
      avgAttendance,
      atRisk,
    };
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectCards.map((subj) => (
          <Link
            to={`/materias/${subj.id}`}
            key={subj.id}
            className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {subj.name}
                  </h3>
                  <p className="text-xs text-slate-400">{subj.code}</p>
                </div>
              </div>
              {subj.atRisk > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-700">
                  {subj.atRisk} en riesgo
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-slate-800">
                  {subj.enrolled}
                </p>
                <p className="text-[11px] text-slate-400">Inscritos</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">
                  {subj.avgGrade}
                </p>
                <p className="text-[11px] text-slate-400">Promedio</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">
                  {subj.avgAttendance}%
                </p>
                <p className="text-[11px] text-slate-400">Asistencia</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                {subj.year} — Sección {subj.section}
              </span>
              <div className="flex items-center gap-1">
                <Users size={13} />
                {subj.enrolled} estudiantes
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
