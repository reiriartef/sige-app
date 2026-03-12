export default function StatCard({ icon: Icon, label, value, color, subtitle }) {
  const colorMap = {
    blue: "bg-primary-50 text-primary-600",
    red: "bg-danger-50 text-danger-600",
    yellow: "bg-warning-50 text-warning-600",
    green: "bg-success-50 text-success-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.blue}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
