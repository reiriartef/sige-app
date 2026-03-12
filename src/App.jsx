import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import ChatBotPage from "./pages/ChatBot";
import Teachers from "./pages/Teachers";
import Login from "./pages/Login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/estudiantes" element={<Students />} />
              <Route path="/estudiantes/:id" element={<StudentDetail />} />
              <Route path="/materias" element={<Subjects />} />
              <Route path="/materias/:id" element={<SubjectDetail />} />
              <Route path="/profesores" element={<Teachers />} />
              <Route path="/chatbot" element={<ChatBotPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
