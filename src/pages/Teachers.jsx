import { useState, useEffect } from "react";
import { GraduationCap, Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import useAcademicStore from "../stores/academicStore";
import api from "../services/api";
import Modal from "../components/Modal";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  status: "activo",
};

export default function Teachers() {
  const [teacherList, setTeacherList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const subjects = useAcademicStore((s) => s.subjects);
  const fetchSubjects = useAcademicStore((s) => s.fetchSubjects);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/teachers");
        setTeacherList(data);
      } catch {
        // ignore
      }
    };
    load();
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadTeachers = async () => {
    const { data } = await api.get("/teachers");
    setTeacherList(data);
  };

  const openCreate = () => {
    setEditingTeacher(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (teacher) => {
    setEditingTeacher(teacher);
    setForm({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || "",
      status: teacher.status,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await api.put(`/teachers/${editingTeacher.id}`, form);
      } else {
        await api.post("/teachers", form);
      }
      setModalOpen(false);
      reloadTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar.");
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/teachers/${id}`);
    setDeleteConfirm(null);
    reloadTeachers();
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {teacherList.length} profesores registrados
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo Profesor
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teacherList.map((teacher) => {
          const teacherSubjects = subjects.filter((s) =>
            (teacher.subjectIds || []).includes(s.id),
          );
          return (
            <div
              key={teacher.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                    {teacher.name
                      .replace("Prof. ", "")
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {teacher.name}
                    </h3>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        teacher.status === "activo"
                          ? "bg-success-100 text-success-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(teacher)}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(teacher.id)}
                    className="p-1.5 rounded-md hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-slate-400" />
                  {teacher.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-400" />
                  {teacher.phone}
                </div>
              </div>

              {teacherSubjects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 mb-1.5">
                    Materias asignadas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacherSubjects.map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-[11px] font-medium"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {teacherSubjects.length === 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 italic">
                    Sin materias asignadas
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTeacher ? "Editar Profesor" : "Nuevo Profesor"}
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
                placeholder="Prof. Nombre Apellido"
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
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Teléfono
              </label>
              <input
                className={inputCls}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0414-000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Estado
              </label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
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
              {editingTeacher ? "Guardar cambios" : "Crear profesor"}
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
          ¿Estás seguro de que deseas eliminar este profesor? Esta acción no se
          puede deshacer.
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
