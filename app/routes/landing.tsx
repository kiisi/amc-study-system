// import { Redirect } from "wouter";
import {
  GraduationCap,
  Brain,
  Clock,
  Stethoscope,
  TrendingUp,
  Bookmark as BookmarkIcon,
  RotateCcw
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";

export default function Landing() {

  const navigate = useNavigate()
  // const { isAuthenticated } = useAuth();

  //   if (isAuthenticated) {
  //     return <Redirect to="/dashboard" />;
  //   }

  const features = [
    {
      icon: Brain,
      title: "Practice Mode",
      description: "Interactive learning with immediate feedback. 150 random questions with detailed explanations after each answer.",
      highlights: ["Immediate answer feedback", "Detailed explanations", "Adaptive question selection"]
    },
    {
      icon: Clock,
      title: "Exam Simulation",
      description: "Full 3.5-hour timed examinations that perfectly simulate real AMC test conditions.",
      highlights: ["150 questions, 3.5 hours", "Real exam conditions", "Complete score analysis"]
    },
    {
      icon: Stethoscope,
      title: "Subject Training",
      description: "Focus on specific medical specialties with targeted practice and progress tracking.",
      highlights: ["Medicine, Surgery, Pediatrics", "OBGYN, Psychiatry & more", "Subject-specific analytics"]
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Comprehensive tracking of your performance with detailed insights and improvement suggestions.",
      highlights: ["Overall accuracy tracking", "Subject-wise performance", "Improvement trends"]
    },
    {
      icon: BookmarkIcon,
      title: "Smart Bookmarks",
      description: "Flag difficult questions for focused review and create personalized study sets.",
      highlights: ["Flag challenging questions", "Custom review sessions", "Priority question lists"]
    },
    {
      icon: RotateCcw,
      title: "Review & Redo",
      description: "Reinforce learning by reviewing sessions and redoing questions you got wrong.",
      highlights: ["Session-specific reviews", "Wrong answers focus", "Spaced repetition"]
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-foreground">AMC <span className="hidden lg:inline">Study System</span></h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                data-testid="button-login-header"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/register')}
                data-testid="button-signup-header"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section h-[600px] bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Master the <span className="text-primary">AMC Exams</span> with Confidence
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Comprehensive practice system with 150+ questions, timed exams, subject-specific training,
              and detailed progress tracking. Prepare efficiently for your Medical Council examinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                data-testid="button-start-practicing"
              >
                Start Practicing Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-view-features"
              >
                View Features
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="/landing/medical.jpg"
              alt="Medical students studying"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Complete Study System</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in your AMC examinations, designed by medical professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="text-primary text-xl" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx}>• {highlight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
