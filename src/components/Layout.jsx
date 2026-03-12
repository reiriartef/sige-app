import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/estudiantes": "Estudiantes",
  "/profesores": "Profesores",
  "/materias": "Materias",
  "/chatbot": "ChatBot Asistente",
};

export default function Layout() {
  const { pathname } = useLocation();

  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/estudiantes/")
      ? "Detalle del Estudiante"
      : pathname.startsWith("/materias/")
        ? "Detalle de Materia"
        : "SIGE");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar title={title} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
