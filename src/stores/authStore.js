import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email) => {
        // Mock: accept any credentials, assign role based on email
        const isStudent = email.includes("alumno") || email.includes("estudiante");
        const mockUser = isStudent
          ? {
              id: 99,
              name: "Luis Martínez",
              email,
              role: "alumno",
            }
          : {
              id: 1,
              name: "Prof. María González",
              email,
              role: "profesor",
            };

        set({ user: mockUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "sige-auth",
    }
  )
);

export default useAuthStore;
