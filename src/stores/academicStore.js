import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  students as initialStudents,
  subjects as initialSubjects,
} from "../data/mockData";

const useAcademicStore = create(
  persist(
    (set, get) => ({
      students: initialStudents,
      subjects: initialSubjects,

      // Update a specific grade for a student in a subject
      updateGrade: (studentId, subjectId, field, value) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  subjects: s.subjects.map((ss) =>
                    ss.subjectId === subjectId
                      ? { ...ss, [field]: value === "" ? null : Number(value) }
                      : ss,
                  ),
                }
              : s,
          ),
        }));
        // Recalculate student average after grade change
        get().recalculateStudent(studentId);
      },

      // Update attendance for a student in a subject
      updateSubjectAttendance: (studentId, subjectId, value) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  subjects: s.subjects.map((ss) =>
                    ss.subjectId === subjectId
                      ? { ...ss, attendance: Number(value) }
                      : ss,
                  ),
                }
              : s,
          ),
        }));
        get().recalculateStudent(studentId);
      },

      // Recalculate overall average and attendance for a student
      recalculateStudent: (studentId) => {
        set((state) => ({
          students: state.students.map((s) => {
            if (s.id !== studentId) return s;
            const allGrades = s.subjects.flatMap((ss) =>
              [ss.grade1, ss.grade2, ss.grade3].filter((g) => g !== null),
            );
            const average =
              allGrades.length > 0
                ? +(
                    allGrades.reduce((a, b) => a + b, 0) / allGrades.length
                  ).toFixed(1)
                : 0;
            const avgAttendance =
              s.subjects.length > 0
                ? Math.round(
                    s.subjects.reduce((a, ss) => a + ss.attendance, 0) /
                      s.subjects.length,
                  )
                : 0;
            // Simple prediction: weighted by current grades trend
            const predictedFinal = +(
              average * 0.85 +
              (avgAttendance / 100) * 3
            ).toFixed(1);
            const riskLevel =
              predictedFinal < 10
                ? "danger"
                : predictedFinal < 13
                  ? "warning"
                  : "normal";
            return {
              ...s,
              average,
              attendance: avgAttendance,
              predictedFinal,
              riskLevel,
            };
          }),
        }));
      },

      // Add a new student
      addStudent: (student) => {
        set((state) => ({
          students: [
            ...state.students,
            {
              ...student,
              id: Math.max(...state.students.map((s) => s.id), 0) + 1,
              subjects: [],
              attendance: Number(student.attendance) || 80,
              average: Number(student.average) || 10,
              predictedFinal: Number(student.predictedFinal) || 10,
              studyHours: Number(student.studyHours) || 5,
            },
          ],
        }));
      },

      // Update a student's basic info
      updateStudent: (studentId, data) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId ? { ...s, ...data } : s,
          ),
        }));
      },

      // Delete a student
      deleteStudent: (studentId) => {
        set((state) => ({
          students: state.students.filter((s) => s.id !== studentId),
        }));
      },

      // Enroll a student in a subject (add empty subject record)
      enrollStudent: (studentId, subjectId) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId &&
            !s.subjects.some((ss) => ss.subjectId === subjectId)
              ? {
                  ...s,
                  subjects: [
                    ...s.subjects,
                    {
                      subjectId,
                      grade1: null,
                      grade2: null,
                      grade3: null,
                      attendance: 80,
                    },
                  ],
                }
              : s,
          ),
        }));
      },

      // ---------- Subject CRUD ----------

      addSubject: (subject) => {
        set((state) => ({
          subjects: [
            ...state.subjects,
            {
              ...subject,
              id: Math.max(...state.subjects.map((s) => s.id), 0) + 1,
            },
          ],
        }));
      },

      updateSubject: (subjectId, data) => {
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId ? { ...s, ...data } : s,
          ),
        }));
      },

      deleteSubject: (subjectId) => {
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== subjectId),
          // Also remove this subject from all students' enrollments
          students: state.students.map((st) => ({
            ...st,
            subjects: st.subjects.filter((ss) => ss.subjectId !== subjectId),
          })),
        }));
      },

      // Unenroll a student from a subject
      unenrollStudent: (studentId, subjectId) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  subjects: s.subjects.filter(
                    (ss) => ss.subjectId !== subjectId,
                  ),
                }
              : s,
          ),
        }));
        get().recalculateStudent(studentId);
      },

      // Reset to initial data
      resetData: () => {
        set({ students: initialStudents, subjects: initialSubjects });
      },
    }),
    {
      name: "sige-academic",
    },
  ),
);

export default useAcademicStore;
