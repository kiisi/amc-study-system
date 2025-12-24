import { data, Link, redirect } from "react-router";
// import { useQuery } from "@tanstack/react-query";
// import { useAuth } from "@/hooks/use-auth";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { authManager } from "@/lib/auth";
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
  GraduationCap
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import NavBar from "~/components/navbar";
import { destroySession, getSession } from "~/.server/sessions";
import { loadDashboardInfo } from "./loader";

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

  // return data(
  //   { success: session.get("userId") },
  //   {
  //     headers: {
  //       "Set-Cookie": await commitSession(session),
  //     },
  //   },
  // );
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

  console.log(loaderData)
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
              <Link to="/exam" className="mt-auto">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-start-exam">
                  Start Exam Simulation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

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
