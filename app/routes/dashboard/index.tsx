import { data, Link, redirect } from "react-router";
import {
  Brain,
  Clock,
  Stethoscope,
  RotateCcw,
  Bookmark as BookmarkIcon,
  TrendingUp,
  Target,
  Calendar,
  Timer,
  GraduationCap,
  Activity,
  LayoutList,
  CircleCheckBig,
  CalendarDays,
  Flag,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  History
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import NavBar from "~/components/navbar";
import { destroySession, getSession } from "~/.server/sessions";
import { loadDashboardInfo } from "./loader";
import { lazy, Suspense, useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '~/utils';
import { motion, AnimatePresence } from 'framer-motion';

export async function loader({
  request,
}: Route.LoaderArgs) {
  const session = await getSession(
    request.headers.get("Cookie"),
  );

  if (!session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/login");
  }

  const data = await loadDashboardInfo(session.get("userId") as string, session);

  return data;
}

export async function action({
  request,
}: Route.ActionArgs) {
  const session = await getSession(
    request.headers.get("Cookie"),
  );

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function Dashboard({ loaderData }) {

  const data = loaderData.data;

  const firstName = data.firstName;
  const sessions = data.sessions;
  const questionsAttempted = data.questionsAttempted;
  const overallAccuracy = data.overallAccuracy;
  const bookmarked = data.bookmarked;
  const quizAttemptTrend = data.quizAttemptTrend ?? [];
  const questionBreakdown = data.questionBreakdown ?? [];

  return (
    <div>
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {firstName}!
          </h2>
          <p className="text-muted-foreground">Continue your AMC preparation journey. Your next session awaits.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="rounded-2xl border border-border/50 bg-card px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center">
                <LayoutList className="text-blue-500 w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Questions</p>
            <p className="text-2xl font-bold text-foreground tracking-tight" data-testid="stat-questions-attempted">
              {questionsAttempted}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center">
                <CircleCheckBig className="text-emerald-500 w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-foreground tracking-tight text-emerald-500" data-testid="stat-accuracy">
              {overallAccuracy}%
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center">
                <CalendarDays className="text-amber-500 w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Sessions</p>
            <p className="text-2xl font-bold text-foreground tracking-tight text-amber-500" data-testid="stat-sessions">
              {sessions}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-rose-50 w-10 h-10 rounded-xl flex items-center justify-center">
                <Flag className="text-rose-500 w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Bookmarked</p>
            <p className="text-2xl font-bold text-foreground tracking-tight text-rose-500" data-testid="stat-bookmarked">
              {bookmarked}
            </p>
          </div>
        </div>

        {/* Study Modes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Practice Mode */}
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Sparkles className="text-white w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Practice Mode</h3>
                  <p className="text-sm text-muted-foreground">Learn with immediate feedback</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Interactive learning sessions with instant feedback and detailed explanations.
                Perfect for reinforcing knowledge and identifying weak areas.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span>Immediate answer feedback</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span>Detailed explanations</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span>Adaptive question selection</span>
                </div>
              </div>
              <Link to="/practice-mode-start">
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30" data-testid="button-start-practice">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Practice Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Exam Mode */}
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
            <div className="p-8 flex flex-col h-full">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Timer className="text-white w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Exam Simulation</h3>
                  <p className="text-sm text-muted-foreground">Full timed examination</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Complete 3.5-hour examination simulation with 150 questions.
                Experience real AMC conditions with comprehensive score analysis.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span>150 questions, 3.5 hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span>Real exam conditions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span>Comprehensive analysis</span>
                </div>
              </div>
              <Link to="/exam-mode-start" className="mt-auto">
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30" data-testid="button-start-exam">
                  <Timer className="w-4 h-4 mr-2" />
                  Start Exam Simulation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Analytical Charts */}
        <QuizAnalytics
          quizAttemptTrend={quizAttemptTrend}
          questionBreakdown={questionBreakdown}
        />

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Subject Practice */}
          <Link to="/subjects" className="group">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-full">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <BookOpen className="text-white w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-1.5">Subject Practice</h4>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">Focus on specific medical specialties</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 group-hover:text-blue-600 transition-colors" data-testid="button-browse-subjects">
                Browse Subjects
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Review Sessions */}
          <Link to="/progress" className="group">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-full">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <History className="text-white w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-1.5">Review & Redo</h4>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">Revisit previous sessions and mistakes</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 group-hover:text-blue-600 transition-colors" data-testid="button-view-sessions">
                View Sessions
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Bookmarked Questions */}
          <Link to="/bookmarks" className="group">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-full">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-rose-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Flag className="text-white w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-1.5">Flagged Questions</h4>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">Practice your saved difficult questions</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 group-hover:text-blue-600 transition-colors" data-testid="button-view-bookmarks">
                View Bookmarks
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface QuizAnalyticsProps {
  quizAttemptTrend: { time: string; value: number; date: string }[];
  questionBreakdown: { name: string; value: number }[];
}

const QuizAnalytics: React.FC<QuizAnalyticsProps> = ({ quizAttemptTrend, questionBreakdown }) => {

  const [timeRange, setTimeRange] = useState('All');

  const ranges = ['7d', '30d', '90d', 'All'];

  const activeIndex = ranges.indexOf(timeRange);

  // Filter trend data by selected time range using the ISO date field
  const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
  const chartData = timeRange === 'All'
    ? quizAttemptTrend
    : (() => {
      const cutoff = new Date(Date.now() - daysMap[timeRange] * 86400000);
      const filtered = quizAttemptTrend.filter(item => new Date(item.date) >= cutoff);
      return filtered.length > 0 ? filtered : quizAttemptTrend;
    })();

  // Plan Distribution data
  // const planData = [
  //   { name: 'Free', value: 516, color: '#6B7280' },
  //   { name: 'Ray', value: 0, color: '#3B82F6' },
  //   { name: 'Beam', value: 1, color: '#8B5CF6' },
  //   { name: 'Pulse', value: 0, color: '#F97316' }
  // ];

  const PRIMARY = "hsl(221.2, 83.2%, 53.3%)";

  // const COLORS = ["#9ca3af", PRIMARY, "#a855f7", "#f59e0b"];
  const COLORS = ["#22c55e", "#ef4444", "#a855f7", "#f59e0b"];

  return (
    // <Suspense fallback={<div className="mb-8 h-[400px]">Loading chart...</div>}>
    //   
    // </Suspense>
    <div className="grid lg:grid-cols-3 gap-8 mb-8 overflow-x-hidden">
      {/* Active Chart */}
      <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl py-6">
        <div className="flex items-center justify-between mb-6 px-6">
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
                  className={cn("cursor-pointer relative z-4 h-[32px] w-[40px] text-[14px] px-2 rounded-[8px]", timeRange === range
                    ? '-bg-white text-primary'
                    : 'text-[#475569]')}
                >
                  {range}
                </button>
              ))}
            </div>
          </AnimatePresence>
        </div>

        <ResponsiveContainer width="100%" height={400} className="pr-5">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 11 }}
            />
            <YAxis
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 11 }}
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

      {/* Donut Chart */}
      <div className="rounded-2xl bg-white border border-zinc-200 p-6">
        <h3 className="font-semibold mb-1">Question Attempts Overview</h3>
        <p className="text-sm text-zinc-500 mb-4">Distribution of user interactions per session</p>
        <div className="h-72 flex items-center justify-center">
          <PieChart width={220} height={220}>
            <Pie
              data={questionBreakdown}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="#e5e7eb"
              strokeWidth={1}
            >
              {questionBreakdown.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i]}
                  fillOpacity={entry.value === 0 ? 0.25 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                color: "#111827"
              }}
            />
          </PieChart>
        </div>
        <ul className="space-y-2 text-sm">
          {questionBreakdown.map((p, i) => (
            <li key={p.name} className="flex justify-between text-zinc-600">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                {p.name}
              </span>
              <span className="font-medium">{p.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};