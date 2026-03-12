import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import useAcademicStore from "../stores/academicStore";
import Modal from "../components/Modal";

const riskBadge = {
  danger: { label: "Alto Riesgo", cls: "bg-danger-100 text-danger-700" },
  warning: { label: "Advertencia", cls: "bg-warning-100 text-warning-600" },
  normal: { label: "Normal", cls: "bg-success-100 text-success-600" },
};

const emptyForm = {
  name: "",
  cedula: "",
  year: "1er Año",
  section: "A",
  email: "",
  attendance: 80,
  average: 10,
  predictedFinal: 10,
  riskLevel: "normal",
  studyHours: 5,
};

export default function Students() {
  const studentList = useAcademicStore((s) => s.students);
  const addStudent = useAcademicStore((s) => s.addStudent);
  const updateStudent = useAcademicStore((s) => s.updateStudent);
  const deleteStudent = useAcademicStore((s) => s.deleteStudent);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = studentList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.cedula.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = filterRisk === "all" || s.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const openCreate = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      cedula: student.cedula,
      year: student.year,
      section: student.section,
      email: student.email,
      attendance: student.attendance,
      average: student.average,
      predictedFinal: student.predictedFinal,
      riskLevel: student.riskLevel,
      studyHours: student.studyHours,
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, form);
    } else {
      addStudent(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteStudent(id);
    setDeleteConfirm(null);
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          >
            <option value="all">Todos los niveles</option>
            <option value="danger">Alto Riesgo</option>
            <option value="warning">Advertencia</option>
            <option value="normal">Normal</option>
          </select>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} />
            Nuevo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-slate-600">
                  Estudiante
                </th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">
                  Cédula
                </th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">
                  Año / Sección
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Asistencia
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Promedio
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Predicción
                </th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600">
                  Estado
                </th>
                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const badge = riskBadge[s.riskLevel];
                return (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {s.name}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{s.cedula}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {s.year} — {s.section}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={
                          s.attendance < 75
                            ? "text-danger-600 font-semibold"
                            : "text-slate-600"
                        }
                      >
                        {s.attendance}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-slate-600">
                      {s.average}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={
                          s.predictedFinal < 10
                            ? "text-danger-600 font-bold"
                            : "text-slate-600"
                        }
                      >
                        {s.predictedFinal}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/estudiantes/${s.id}`}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                          title="Ver detalle"
                        >
                          <ChevronRight size={15} />
                        </Link>
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(s.id)}
                          className="p-1.5 rounded-md hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    No se encontraron estudiantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? "Editar Estudiante" : "Nuevo Estudiante"}
        wide
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Nombre completo
              </label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Cédula
              </label>
              <input
                className={inputCls}
                value={form.cedula}
                onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                required
                placeholder="V-00.000.000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                className={inputCls}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
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
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Horas de estudio / semana
              </label>
              <input
                type="number"
                min={0}
                max={40}
                className={inputCls}
                value={form.studyHours}
                onChange={(e) =>
                  setForm({ ...form, studyHours: e.target.value })
                }
              />
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
              {editingStudent ? "Guardar cambios" : "Crear estudiante"}
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
        <p className="text-sm text-slate-600 mb-6">
          ¿Estás seguro de que deseas eliminar este estudiante? Esta acción no
          se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm)}
            className="px-5 py-2 text-sm font-medium bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}
