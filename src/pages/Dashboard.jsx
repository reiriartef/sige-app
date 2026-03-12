import {
  Users,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Percent,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
} from "recharts";
import StatCard from "../components/StatCard";
import {
  dashboardStats,
  recentAlerts,
  regressionData,
  regressionLine,
  monthlyTrend,
} from "../data/mockData";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Estudiantes"
          value={dashboardStats.totalStudents}
          color="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="En Riesgo (Alerta Roja)"
          value={dashboardStats.atRisk}
          color="red"
          subtitle="Predicción < 10 pts"
        />
        <StatCard
          icon={AlertCircle}
          label="Advertencia"
          value={dashboardStats.warning}
          color="yellow"
          subtitle="Tendencia descendente"
        />
        <StatCard
          icon={Percent}
          label="Asistencia Promedio"
          value={`${dashboardStats.averageAttendance}%`}
          color="green"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter: Asistencia vs Promedio (Regresión) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Asistencia vs. Rendimiento — Dispersión
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="attendance"
                name="Asistencia"
                unit="%"
                domain={[40, 100]}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="average"
                name="Promedio"
                domain={[4, 20]}
                tick={{ fontSize: 12 }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white shadow-lg rounded-lg p-3 border text-xs">
                      <p className="font-semibold text-slate-700">{d.name}</p>
                      <p>Asistencia: {d.attendance}%</p>
                      <p>Promedio: {d.average}</p>
                      <p>Predicción: {d.predicted}</p>
                    </div>
                  );
                }}
              />
              <ReferenceLine
                y={10}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: "Mín. aprobatorio",
                  fontSize: 11,
                  fill: "#ef4444",
                }}
              />
              <Scatter
                data={regressionData}
                fill="#3b82f6"
                shape="circle"
                name="Alumnos"
              />
              <Scatter
                data={regressionLine}
                fill="none"
                line={{ stroke: "#f59e0b", strokeWidth: 2 }}
                shape={() => null}
                name="Línea de regresión"
                legendType="line"
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart: Tendencia mensual */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Tendencia Mensual — Promedio y Asistencia
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={monthlyTrend}
              margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 20]} />
              <Tooltip />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) =>
                  value === "avgGrade" ? "Promedio" : "Asistencia %"
                }
              />
              <Line
                type="monotone"
                dataKey="avgGrade"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="avgGrade"
              />
              <Line
                type="monotone"
                dataKey="avgAttendance"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="avgAttendance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar chart: Horas de estudio vs Promedio */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Horas de Estudio vs. Promedio por Estudiante
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={regressionData}
            margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="studyHours"
              fill="#60a5fa"
              name="Horas de Estudio"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="average"
              fill="#1d4ed8"
              name="Promedio"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent alerts */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">
            Alertas Recientes
          </h3>
          <span className="text-xs text-slate-400">Últimos 7 días</span>
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <Link
              key={alert.id}
              to={`/estudiantes/${alert.studentId}`}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div
                className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  alert.type === "danger" ? "bg-danger-500" : "bg-warning-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
                  {alert.studentName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{alert.message}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {alert.date}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
