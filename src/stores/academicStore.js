import { create } from "zustand";
import api from "../services/api";

const useAcademicStore = create((set, get) => ({
  students: [],
  subjects: [],
  loading: false,

  // ---------- Fetch data from API ----------

  fetchStudents: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/students");
      set({ students: data });
    } finally {
      set({ loading: false });
    }
  },

  fetchSubjects: async () => {
    try {
      const { data } = await api.get("/subjects");
      set({ subjects: data });
    } catch {
      // ignore
    }
  },

  // ---------- Student CRUD ----------

  addStudent: async (student) => {
    const { data } = await api.post("/students", {
      cedula: student.cedula,
      name: student.name,
      email: student.email || null,
      year: student.year,
      section: student.section,
      study_hours: Number(student.studyHours) || 0,
    });
    set((state) => ({ students: [...state.students, data] }));
    return data;
  },

  updateStudent: async (studentId, payload) => {
    const { data } = await api.put(`/students/${studentId}`, {
      cedula: payload.cedula,
      name: payload.name,
      email: payload.email || null,
      year: payload.year,
      section: payload.section,
      study_hours: Number(payload.studyHours) || 0,
    });
    set((state) => ({
      students: state.students.map((s) => (s.id === studentId ? data : s)),
    }));
    return data;
  },

  deleteStudent: async (studentId) => {
    await api.delete(`/students/${studentId}`);
    set((state) => ({
      students: state.students.filter((s) => s.id !== studentId),
    }));
  },

  // ---------- Enrollment ----------

  enrollStudent: async (studentId, subjectId) => {
    const { data } = await api.post(`/students/${studentId}/enroll`, {
      subject_id: subjectId,
    });
    set((state) => ({
      students: state.students.map((s) => (s.id === studentId ? data : s)),
    }));
  },

  unenrollStudent: async (studentId, subjectId) => {
    const { data } = await api.delete(
      `/students/${studentId}/unenroll/${subjectId}`,
    );
    set((state) => ({
      students: state.students.map((s) => (s.id === studentId ? data : s)),
    }));
  },

  // ---------- Grades / Attendance ----------

  updateGrades: async (studentId, subjectId, grades) => {
    const { data } = await api.put(
      `/students/${studentId}/grades/${subjectId}`,
      grades,
    );
    set((state) => ({
      students: state.students.map((s) => (s.id === studentId ? data : s)),
    }));
  },

  // ---------- Subject CRUD ----------

  addSubject: async (subject) => {
    const { data } = await api.post("/subjects", subject);
    set((state) => ({ subjects: [...state.subjects, data] }));
    return data;
  },

  updateSubject: async (subjectId, payload) => {
    const { data } = await api.put(`/subjects/${subjectId}`, payload);
    set((state) => ({
      subjects: state.subjects.map((s) => (s.id === subjectId ? data : s)),
    }));
    return data;
  },

  deleteSubject: async (subjectId) => {
    await api.delete(`/subjects/${subjectId}`);
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== subjectId),
    }));
    // Refresh students since enrollments may have been removed
    get().fetchStudents();
  },
}));

export default useAcademicStore;
