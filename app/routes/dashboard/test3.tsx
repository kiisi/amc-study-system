import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Building2, Network, CreditCard, TrendingUp, Activity } from 'lucide-react';
import { cn } from '~/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');

  // Active Tunnels data
  const tunnelData = [
    { time: '2 pm', value: 14 },
    { time: '3 pm', value: 12 },
    { time: '4 pm', value: 16 },
    { time: '5 pm', value: 11 },
    { time: '6 pm', value: 18 },
    { time: '7 pm', value: 22 },
    { time: '8 pm', value: 24 },
    { time: '9 pm', value: 21 },
    { time: '10 pm', value: 28 },
    { time: '11 pm', value: 32 },
    { time: '12 am', value: 18 },
    { time: '1 am', value: 14 },
    { time: '2 am', value: 9 },
    { time: '3 am', value: 12 },
    { time: '4 am', value: 8 },
    { time: '5 am', value: 11 },
    { time: '6 am', value: 14 },
    { time: '7 am', value: 16 },
    { time: '8 am', value: 19 },
    { time: '9 am', value: 15 },
    { time: '10 am', value: 18 },
    { time: '11 am', value: 22 },
    { time: '12 pm', value: 26 },
    { time: '1 pm', value: 24 }
  ];

  // Plan Distribution data
  const planData = [
    { name: 'Free', value: 516, color: '#6B7280' },
    { name: 'Ray', value: 0, color: '#3B82F6' },
    { name: 'Beam', value: 1, color: '#8B5CF6' },
    { name: 'Pulse', value: 0, color: '#F97316' }
  ];

  const ranges = ['1h', '24h', '7d', '30d'];

  const activeIndex = ranges.indexOf(timeRange);

  console.log(activeIndex)

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-black rounded-full"></div>
          </div>
          <span className="text-xl font-semibold">OutRay</span>
          <span className="px-2 py-1 bg-amber-700 text-amber-100 rounded text-xs">Admin</span>
        </div>

        <button className="absolute bottom-4 left-4 right-4 flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-zinc-800 rounded-lg">
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Global system metrics and analytics</p>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Active Tunnels Chart */}
          <div className="col-span-2 bg-white border border-zinc-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="text-amber-500" size={20} />
                  <h2 className="text-xl font-semibold">Quiz attempts</h2>
                </div>
                <p className="text-zinc-400 text-sm">Attempt trends across time</p>
              </div>
              <AnimatePresence>
                <div className="p-[4px] flex gap-2 bg-[#F2F4F7] rounded-[12px] relative">
                  <motion.div
                    layoutId="active-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    animate={{ x: activeIndex * 48 }}
                    className="absolute z-2 top-[4px] left-[4px] h-[32px] w-[40px] bg-white rounded-[8px]"
                  />
                  {ranges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={cn("relative z-4 h-[32px] w-[40px] text-[14px] px-2 rounded-[8px]", timeRange === range
                        ? '-bg-white text-primary'
                        : 'text-[#475569]')}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </AnimatePresence>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={tunnelData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#52525b"
                  tick={{ fill: '#71717a' }}
                />
                <YAxis
                  stroke="#52525b"
                  tick={{ fill: '#71717a' }}
                />
                <Tooltip
                  contentStyle={{
                    border: '1px solid #f1f2f3',
                    borderRadius: '6px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Plan Distribution Chart */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Plan Distribution</h2>
              <p className="text-zinc-400 text-sm">518 organizations by plan</p>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3f3f46"
                    strokeWidth="30"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="30"
                    strokeDasharray={`${(516 / 518) * 502.65} 502.65`}
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="30"
                    strokeDasharray={`${(1 / 518) * 502.65} 502.65`}
                    strokeDashoffset={`-${(516 / 518) * 502.65}`}
                    transform="rotate(-90 100 100)"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              {planData.map((plan, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    ></div>
                    <span className="text-zinc-300">{plan.name}</span>
                  </div>
                  <span className="font-semibold">{plan.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;