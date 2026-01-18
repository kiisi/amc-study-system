import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Building2, Link2, CreditCard } from "lucide-react";

const tunnelData = [
  { time: "2pm", value: 16 },
  { time: "4pm", value: 14 },
  { time: "6pm", value: 22 },
  { time: "8pm", value: 24 },
  { time: "10pm", value: 30 },
  { time: "12am", value: 12 },
  { time: "2am", value: 15 },
  { time: "4am", value: 8 },
  { time: "6am", value: 9 },
  { time: "8am", value: 12 },
  { time: "10am", value: 16 },
  { time: "12pm", value: 18 }
];

const planData = [
  { name: "Free", value: 516 },
  { name: "Ray", value: 0 },
  { name: "Beam", value: 1 },
  { name: "Pulse", value: 0 }
];

const COLORS = ["#9ca3af", "#3b82f6", "#a855f7", "#f59e0b"];

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <Icon className="h-6 w-6 text-zinc-400" />
        <span className="text-green-400 text-sm">↑ +74.2%</span>
      </div>
      <h3 className="mt-6 text-3xl font-bold text-white">{value}</h3>
      <p className="text-sm text-zinc-400">{label} {sub && <span className="text-zinc-500">• {sub}</span>}</p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6">
        <h1 className="text-xl font-bold mb-8">OutRay <span className="text-amber-400 text-sm">Admin</span></h1>
        <nav className="space-y-3 text-zinc-400">
          <p className="text-white">Overview</p>
          <p>Users</p>
          <p>Organizations</p>
          <p>Subscriptions</p>
          <p>Tunnels</p>
          <p>Charts</p>
        </nav>
        <div className="absolute bottom-6 text-zinc-500">Logout</div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <p className="text-zinc-400 mb-8">Global system metrics and analytics</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} label="Total Users" value="555" sub="109 today" />
          <StatCard icon={Building2} label="Organizations" value="518" />
          <StatCard icon={Link2} label="Active Tunnels" value="18" sub="600 total" />
          <StatCard icon={CreditCard} label="Monthly Revenue" value="$15" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Area Chart */}
          <div className="lg:col-span-2 rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
            <h3 className="font-semibold mb-1">⚡ Active Tunnels</h3>
            <p className="text-sm text-zinc-400 mb-4">Tunnel activity over time</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tunnelData}>
                  <defs>
                    <linearGradient id="colorTunnel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#52525b" />
                  <YAxis stroke="#52525b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#colorTunnel)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
            <h3 className="font-semibold mb-1">Plan Distribution</h3>
            <p className="text-sm text-zinc-400 mb-4">518 organizations by plan</p>
            <div className="h-72 flex items-center justify-center">
              <PieChart width={220} height={220}>
                <Pie
                  data={planData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {planData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <ul className="space-y-2 text-sm">
              {planData.map((p, i) => (
                <li key={p.name} className="flex justify-between text-zinc-300">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                    {p.name}
                  </span>
                  <span>{p.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
