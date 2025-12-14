// ResultsPage.jsx
import { useLocation, useNavigate, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  Home, 
  RefreshCw,
  Target,
  ChevronRight,
  Download,
  Share2,
  Calendar,
  Hash
} from 'lucide-react';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const mockResults = location.state || {
      score: 82,
      totalQuestions: 20,
      correctAnswers: 16,
      incorrectAnswers: 4,
      timeLimit: 1800,
      timeUsed: 1320,
      category: 'JavaScript Fundamentals',
      difficulty: 'Intermediate',
      date: new Date().toISOString(),
      questions: Array(20).fill(null).map((_, i) => ({
        id: i + 1,
        question: `What is the output of console.log(typeof null)?`,
        userAnswer: i < 16 ? 'object' : 'null',
        correctAnswer: 'object',
        isCorrect: i < 16,
        timeSpent: Math.floor(Math.random() * 60) + 20,
        category: ['Variables & Types', 'Functions', 'DOM', 'Async'][i % 4],
        topic: ['Data Types', 'Closures', 'Event Handling', 'Promises'][i % 4]
      }))
    };
    
    setQuizResults(mockResults);
    setTimeSpent(mockResults.timeUsed);
  }, [location.state]);

  if (!quizResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const {
    score,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    timeLimit,
    category,
    difficulty,
    date,
    questions
  } = quizResults;

  const percentage = score;
  const timePercentage = (timeSpent / timeLimit) * 100;
  const formattedTime = `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}`;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const accuracy = (correctAnswers / totalQuestions) * 100;

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getPerformanceText = (score) => {
    if (score >= 90) return 'Excellent Performance';
    if (score >= 75) return 'Strong Performance';
    if (score >= 60) return 'Good Performance';
    return 'Keep Practicing';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'from-emerald-500 to-teal-600';
    if (score >= 75) return 'from-blue-500 to-indigo-600';
    if (score >= 60) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-pink-600';
  };

  const handleExportResults = () => {
    // Implement export functionality
    console.log('Exporting results...');
  };

  const handleShareResults = () => {
    // Implement share functionality
    console.log('Sharing results...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 border border-gray-200">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Quiz Results</h1>
          <p className="text-gray-600">Summary of your performance</p>
        </div>

        {/* Main Score Card */}
        <div className="bg-white rounded-xl border border-gray-300 mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-1/3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{difficulty}</span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formattedDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Questions</span>
                    <span className="font-medium text-gray-900">{totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Completion Time</span>
                    <span className="font-medium text-gray-900">{formattedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Accuracy</span>
                    <span className="font-medium text-gray-900">{accuracy.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Score Circle */}
              <div className="relative">
                <div className="w-56 h-56">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${getPerformanceColor(percentage)}`}>
                        {percentage}%
                      </div>
                      <div className="text-gray-600 mt-2 text-sm">Final Score</div>
                      <div className={`text-sm font-medium ${getPerformanceColor(percentage)} mt-1`}>
                        {getPerformanceText(percentage)}
                      </div>
                    </div>
                  </div>
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-100"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className={`${getScoreColor(percentage)}`}
                      strokeDasharray={`${2 * Math.PI * 100}`}
                      strokeDashoffset={2 * Math.PI * 100 * (1 - percentage / 100)}
                    />
                  </svg>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                        <span className="text-gray-700">Correct</span>
                      </div>
                      <span className="font-semibold text-gray-900">{correctAnswers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-rose-500 mr-3" />
                        <span className="text-gray-700">Incorrect</span>
                      </div>
                      <span className="font-semibold text-gray-900">{incorrectAnswers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-blue-500 mr-3" />
                        <span className="text-gray-700">Time Used</span>
                      </div>
                      <span className="font-semibold text-gray-900">{formattedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-300 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Accuracy Rate</h4>
                <p className="text-sm text-gray-600">Questions answered correctly</p>
              </div>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {accuracy.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-300 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Time Efficiency</h4>
                <p className="text-sm text-gray-600">Time spent per question</p>
              </div>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {(timeSpent / totalQuestions).toFixed(1)}s
            </div>
            <div className="text-sm text-gray-600">
              Average time per question
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-300 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Score Distribution</h4>
                <p className="text-sm text-gray-600">Across difficulty levels</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{correctAnswers}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{incorrectAnswers}</div>
                <div className="text-xs text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{percentage}%</div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Performance */}
        <div className="bg-white rounded-xl border border-gray-300 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Performance by Topic</h3>
            </div>
            <button 
              onClick={handleExportResults}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
          
          <div className="space-y-4">
            {['Variables & Types', 'Functions', 'DOM', 'Async'].map((topic, index) => {
              const topicQuestions = questions.filter(q => q.category === topic);
              const topicCorrect = topicQuestions.filter(q => q.isCorrect).length;
              const topicTotal = topicQuestions.length;
              const topicAccuracy = topicTotal > 0 ? (topicCorrect / topicTotal) * 100 : 0;
              
              return (
                <div key={topic} className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{topic}</h4>
                      <p className="text-sm text-gray-600">{topicCorrect} of {topicTotal} correct</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {topicAccuracy.toFixed(1)}%
                      </div>
                      <div className={`text-xs ${topicAccuracy >= 70 ? 'text-emerald-600' : topicAccuracy >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {topicAccuracy >= 70 ? 'Strong' : topicAccuracy >= 50 ? 'Average' : 'Needs Work'}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        topicAccuracy >= 70 ? 'bg-emerald-500' : 
                        topicAccuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${topicAccuracy}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Review Section */}
        <div className="bg-white rounded-xl border border-gray-300 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
              <span className="ml-3 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {totalQuestions} questions
              </span>
            </div>
            <button 
              onClick={handleShareResults}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>

          <div className="space-y-4">
            {questions.slice(0, 3).map((q) => (
              <div 
                key={q.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  q.isCorrect 
                    ? 'border-l-emerald-500 bg-emerald-50' 
                    : 'border-l-rose-500 bg-rose-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-900 mr-3">
                        Question {q.id}
                      </span>
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                        {q.topic}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3">{q.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Your Answer</div>
                        <div className="font-medium text-gray-900">{q.userAnswer}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Correct Answer</div>
                        <div className="font-medium text-gray-900">{q.correctAnswer}</div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                      q.isCorrect 
                        ? 'text-emerald-700 bg-emerald-100' 
                        : 'text-rose-700 bg-rose-100'
                    }`}>
                      {q.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                    <div className="text-xs text-gray-600 mt-2">{q.timeSpent}s</div>
                  </div>
                </div>
              </div>
            ))}
            
            {questions.length > 3 && (
              <div className="text-center pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {/* Navigate to detailed review */}}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all {questions.length} questions
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <button
            onClick={() => navigate('/quizzes')}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
          >
            Browse Quizzes
          </button>
          <button
            onClick={() => navigate('/quiz/session', { state: quizResults })}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Retry Quiz
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Results are saved to your learning history. Track your progress over time.
          </p>
          <div className="text-center mt-2">
            <Link
              to="/progress"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Progress Dashboard
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;