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
  Activity
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import NavBar from "~/components/navbar";
import { destroySession, getSession } from "~/.server/sessions";
import { loadDashboardInfo } from "./loader";
import type { ApexOptions } from "apexcharts";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Questions Attempted</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-questions-attempted">
                    {questionsAttempted}
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Brain className="text-primary w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                  <p className="text-2xl font-bold text-accent" data-testid="stat-accuracy">
                    {overallAccuracy}%
                  </p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Target className="text-accent w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="text-2xl font-bold text-chart-3" data-testid="stat-sessions">
                    {sessions}
                    {/* {statsLoading ? '-' : stats?.sessionCount || 0} */}
                  </p>
                </div>
                <div className="bg-chart-3/10 p-3 rounded-lg">
                  <Calendar className="text-chart-3 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bookmarked</p>
                  <p className="text-2xl font-bold text-chart-4" data-testid="stat-bookmarked">
                    {/* {statsLoading ? '-' : stats?.bookmarkCount || 0} */}
                    {bookmarked}
                  </p>
                </div>
                <div className="bg-chart-4/10 p-3 rounded-lg">
                  <BookmarkIcon className="text-chart-4 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Modes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Practice Mode */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mr-4">
                  <Brain className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">Practice Mode</h3>
                  <p className="text-muted-foreground">Learn with immediate feedback</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Interactive learning sessions with instant feedback and detailed explanations.
                Perfect for reinforcing knowledge and identifying weak areas.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Immediate answer feedback</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Detailed explanations</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Adaptive question selection</span>
                </div>
              </div>
              <Link to="/practice-mode-start">
                <Button className="w-full" data-testid="button-start-practice">
                  Start Practice Session
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Exam Mode */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                <div className="bg-accent/10 w-16 h-16 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="text-accent w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">Exam Simulation</h3>
                  <p className="text-muted-foreground">Full timed examination</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Complete 3.5-hour examination simulation with 150 questions.
                Experience real AMC conditions with comprehensive score analysis.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  <span>150 questions, 3.5 hours</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  <span>Real exam conditions</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  <span>Comprehensive analysis</span>
                </div>
              </div>
              <Link to="/exam-mode-start" className="mt-auto">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-start-exam">
                  Start Exam Simulation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Analytical Charts */}
        <QuizAnalytics />

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Subject Practice */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="bg-chart-3/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="text-chart-3 w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Subject Practice</h4>
              <p className="text-muted-foreground mb-4">Focus on specific medical specialties</p>
              <Link to="/subjects">
                <Button variant="link" className="text-primary hover:underline font-medium p-0" data-testid="button-browse-subjects">
                  Browse Subjects →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Review Sessions */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="bg-chart-4/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <RotateCcw className="text-chart-4 w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Review & Redo</h4>
              <p className="text-muted-foreground mb-4">Revisit previous sessions and mistakes</p>
              <Link to="/progress">
                <Button variant="link" className="text-primary hover:underline font-medium p-0" data-testid="button-view-sessions">
                  View Sessions →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bookmarked Questions */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="bg-chart-5/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookmarkIcon className="text-chart-5 w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Flagged Questions</h4>
              <p className="text-muted-foreground mb-4">Practice your saved difficult questions</p>
              <Link to="/bookmarks">
                <Button variant="link" className="text-primary hover:underline font-medium p-0" data-testid="button-view-bookmarks">
                  View Bookmarks →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        {/* {recentSessions && recentSessions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Recent Study Sessions</h3>
              <Link href="/progress">
                <Button variant="link" className="text-primary hover:underline text-sm" data-testid="button-view-all-sessions">
                  View All Sessions →
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentSessions.map((session: any, index: number) => (
                <div 
                  key={session._id} 
                  className="flex items-center justify-between p-4 bg-background rounded-lg"
                  data-testid={`recent-session-${index}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                      {session.type === 'practice' ? (
                        <Brain className="text-primary w-5 h-5" />
                      ) : session.type === 'exam' ? (
                        <Clock className="text-accent w-5 h-5" />
                      ) : (
                        <Stethoscope className="text-chart-3 w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {session.type === 'practice' ? 'Practice Session' : 
                         session.type === 'exam' ? 'Exam Simulation' : 'Subject Practice'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {session.subject || 'Mixed Topics'} • {session.totalQuestions} questions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {session.score && (
                      <div className="text-center">
                        <div className="text-sm font-semibold text-accent">{session.score}%</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    )}
                    <Button variant="link" className="text-primary hover:underline text-sm" data-testid={`button-review-session-${index}`}>
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}
      </div>
    </div>
  );
}


const QuizAnalytics: React.FC = () => {

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

  const ranges = ['24h', '7d', '30d'];

  const activeIndex = ranges.indexOf(timeRange);

  return (
    // <Suspense fallback={<div className="mb-8 h-[400px]">Loading chart...</div>}>
    //   <div className="grid lg:grid-cols-2 gap-8 space-y-10 mb-2">
    //     <div className="rounded-lg border border-[#e2e8f0] h-full max-h-[400px] pt-5 bg-card text-card-foreground">
    //       <Chart
    //         options={areaChartOptions}
    //         series={areaChartSeries}
    //         type="area"
    //         className="h-full"
    //       />
    //     </div>
    //     <div className="rounded-lg border h-full max-h-[400px] border-[#e2e8f0] pt-5 bg-card text-card-foreground">
    //       <Chart
    //         options={barChartOptions}
    //         series={barChartSeries}
    //         type="bar"
    //         className="h-full"
    //       />
    //     </div>
    //   </div>
    // </Suspense>
    <div className="grid lg:grid-cols-3 gap-8 mb-8">
      {/* Active Tunnels Chart */}
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

        <ResponsiveContainer width="100%" height={400} className="pr-6">
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
  );
};