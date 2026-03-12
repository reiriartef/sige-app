import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Plus, Pencil, Trash2 } from "lucide-react";
import useAcademicStore from "../stores/academicStore";
import Modal from "../components/Modal";

const emptyForm = { name: "", code: "", year: "1er Año", section: "A" };

export default function Subjects() {
  const subjects = useAcademicStore((s) => s.subjects);
  const students = useAcademicStore((s) => s.students);
  const addSubject = useAcademicStore((s) => s.addSubject);
  const updateSubject = useAcademicStore((s) => s.updateSubject);
  const deleteSubject = useAcademicStore((s) => s.deleteSubject);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (e, subj) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();
    setEditing(subj);
    setForm({
      name: subj.name,
      code: subj.code,
      year: subj.year,
      section: subj.section,
    });
    setModalOpen(true);
  };

  const openDelete = (e, subj) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm(subj);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editing) {
      updateSubject(editing.id, form);
    } else {
      addSubject(form);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    deleteSubject(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} />
          Nueva Materia
        </button>
      </div>

      {/* Cards grid */}
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
              <div className="flex items-center gap-1">
                {subj.atRisk > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-700 mr-1">
                    {subj.atRisk} en riesgo
                  </span>
                )}
                <button
                  onClick={(e) => openEdit(e, subj)}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                  title="Editar materia"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => openDelete(e, subj)}
                  className="p-1.5 rounded-md hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                  title="Eliminar materia"
                >
                  <Trash2 size={14} />
                </button>
              </div>
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
        {subjectCards.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400 text-sm">
            No hay materias registradas.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar Materia" : "Nueva Materia"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Nombre
            </label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Matemáticas"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Código
            </label>
            <input
              className={inputCls}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="Ej: MAT-301"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Año
              </label>
              <select
                className={inputCls}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              >
                <option>1er Año</option>
                <option>2do Año</option>
                <option>3er Año</option>
                <option>4to Año</option>
                <option>5to Año</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Sección
              </label>
              <select
                className={inputCls}
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {editing ? "Guardar cambios" : "Crear materia"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar eliminación"
      >
        <p className="text-sm text-slate-600 mb-2">
          ¿Estás seguro de que deseas eliminar la materia{" "}
          <strong>{deleteConfirm?.name}</strong>?
        </p>
        <p className="text-xs text-slate-400 mb-6">
          Se desvinculará a todos los estudiantes inscritos en esta materia.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 text-sm font-medium bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}
