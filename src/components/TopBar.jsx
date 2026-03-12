import { Bell, Search } from "lucide-react";
import useAuthStore from "../stores/authStore";

export default function TopBar({ title }) {
  const user = useAuthStore((s) => s.user);

  const initials = user?.name
    ? user.name
        .replace("Prof. ", "")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
    : "??";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 w-56"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-slate-700 leading-tight">
              {user?.name ?? "Usuario"}
            </p>
            <p className="text-xs text-slate-400 leading-tight capitalize">
              {user?.role ?? ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
