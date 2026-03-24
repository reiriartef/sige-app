import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await api.post("/login", { email, password });
        set({ user: data.user, token: data.token, isAuthenticated: true });
        return data;
      },

      logout: async () => {
        try {
          await api.post("/logout");
        } catch {
          // ignore — token may already be invalid
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "sige-auth",
    },
  ),
);

export default useAuthStore;
