import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, GraduationCap, BookOpen } from "lucide-react";
import {
  chatBotResponsesProfesor,
  chatBotResponsesAlumno,
  recentAlerts,
} from "../data/mockData";

function getProfesorResponse(input) {
  const lower = input.toLowerCase();
  if (
    lower.includes("inasistencia") ||
    lower.includes("falta") ||
    lower.includes("ausencia")
  ) {
    return chatBotResponsesProfesor.inasistencias;
  }
  if (
    lower.includes("riesgo") ||
    lower.includes("alerta") ||
    lower.includes("reprobar")
  ) {
    return chatBotResponsesProfesor.riesgo;
  }
  if (
    lower.includes("resumen") ||
    lower.includes("progreso") ||
    lower.includes("general") ||
    lower.includes("clase")
  ) {
    return chatBotResponsesProfesor.resumen;
  }
  return chatBotResponsesProfesor.default;
}

function getAlumnoResponse(input) {
  const lower = input.toLowerCase();
  if (
    lower.includes("rendimiento") ||
    lower.includes("nota") ||
    lower.includes("promedio") ||
    lower.includes("estado")
  ) {
    return chatBotResponsesAlumno.rendimiento;
  }
  if (
    lower.includes("recurso") ||
    lower.includes("estudiar") ||
    lower.includes("material") ||
    lower.includes("recomend")
  ) {
    return chatBotResponsesAlumno.recursos;
  }
  if (
    lower.includes("asesor") ||
    lower.includes("agendar") ||
    lower.includes("cita") ||
    lower.includes("tutor")
  ) {
    return chatBotResponsesAlumno.asesoria;
  }
  if (
    lower.includes("predicci") ||
    lower.includes("proyecci") ||
    lower.includes("final") ||
    lower.includes("riesgo")
  ) {
    return chatBotResponsesAlumno.prediccion;
  }
  return chatBotResponsesAlumno.default;
}

const profesorSuggestions = [
  "¿Qué alumnos tienen más del 20% de inasistencias?",
  "¿Qué alumnos están en riesgo?",
  "Genera un resumen del progreso de la clase",
];

const alumnoSuggestions = [
  "¿Cuál es mi rendimiento actual?",
  "Recomiéndame recursos de estudio",
  "Quiero agendar una asesoría con un profesor",
  "¿Cuál es mi predicción de nota final?",
];

export default function ChatBotPage() {
  const [userRole, setUserRole] = useState(null); // null | "profesor" | "alumno"
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectRole = (role) => {
    const responses =
      role === "profesor" ? chatBotResponsesProfesor : chatBotResponsesAlumno;
    const initialMessages = [{ role: "bot", text: responses.greeting }];

    // GAP 5: Proactive alerts for profesor
    if (role === "profesor" && recentAlerts.length > 0) {
      const dangerAlerts = recentAlerts.filter((a) => a.type === "danger");
      if (dangerAlerts.length > 0) {
        const alertText =
          `⚠️ Alerta automática: Se han detectado ${dangerAlerts.length} alumno(s) en riesgo crítico:\n\n` +
          dangerAlerts
            .map((a) => `• ${a.studentName}: ${a.message}`)
            .join("\n") +
          "\n\nTe recomiendo revisar sus perfiles y considerar una intervención temprana.";
        initialMessages.push({ role: "bot", text: alertText });
      }
    }

    // Proactive alert for alumno (simulated as student Luis Martínez)
    if (role === "alumno") {
      initialMessages.push({
        role: "bot",
        text: "⚠️ Aviso importante: Tu predicción de nota final en Matemáticas es 6.5, por debajo del mínimo aprobatorio (10). Te sugiero revisar los recursos de estudio disponibles y agendar una asesoría con tu profesor.",
      });
    }

    setUserRole(role);
    setMessages(initialMessages);
  };

  const getResponse = (text) =>
    userRole === "profesor"
      ? getProfesorResponse(text)
      : getAlumnoResponse(text);

  const suggestions =
    userRole === "profesor" ? profesorSuggestions : alumnoSuggestions;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { role: "user", text: trimmed };
    const botMsg = { role: "bot", text: getResponse(trimmed) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (s) => {
    const userMsg = { role: "user", text: s };
    const botMsg = { role: "bot", text: getResponse(s) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  // Role selection screen
  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <Bot size={28} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Asistente SIGE
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Selecciona tu rol para personalizar la asistencia que recibirás.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => selectRole("profesor")}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-primary-500 hover:shadow-md transition-all w-44"
            >
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                <GraduationCap size={24} className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Profesor</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Consultas de clase y reportes
                </p>
              </div>
            </button>
            <button
              onClick={() => selectRole("alumno")}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-primary-500 hover:shadow-md transition-all w-44"
            >
              <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center">
                <BookOpen size={24} className="text-success-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Alumno</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recursos, asesorías y notas
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const showSuggestions =
    messages.filter((m) => m.role === "user").length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Role indicator */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {userRole === "profesor" ? (
            <GraduationCap size={16} className="text-primary-500" />
          ) : (
            <BookOpen size={16} className="text-success-500" />
          )}
          Modo:{" "}
          <span className="font-medium text-slate-700 capitalize">
            {userRole}
          </span>
        </div>
        <button
          onClick={() => {
            setUserRole(null);
            setMessages([]);
          }}
          className="text-xs text-slate-400 hover:text-primary-600 transition-colors"
        >
          Cambiar rol
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={16} className="text-primary-600" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-primary-600 text-white rounded-br-md"
                  : "bg-white border border-slate-200 text-slate-700 rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} className="text-slate-600" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 pb-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s)}
              className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-end gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta..."
          className="flex-1 resize-none text-sm p-2 focus:outline-none max-h-32"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
