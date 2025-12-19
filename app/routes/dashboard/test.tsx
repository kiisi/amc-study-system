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
  Hash,
  Award,
  TrendingUp,
  Users,
  BookOpen
} from 'lucide-react';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState(null);

  // Complete mock data with all necessary fields
  useEffect(() => {
    const mockResults = location.state || {
      score: 82,
      totalQuestions: 20,
      correctAnswers: 16,
      incorrectAnswers: 4,
      timeLimit: 1800, // 30 minutes in seconds
      timeUsed: 1320, // 22 minutes
      category: 'JavaScript Fundamentals',
      difficulty: 'Intermediate',
      date: new Date().toISOString(),
      quizId: 'js-fundamentals-001',
      userId: 'user123',
      rank: 45,
      totalParticipants: 200,
      averageScore: 68,
      highestScore: 98,
      percentile: 78,
      questions: Array(20).fill(null).map((_, i) => ({
        id: i + 1,
        question: `What is the output of console.log(typeof null)?`,
        userAnswer: i < 16 ? 'object' : 'null',
        correctAnswer: 'object',
        isCorrect: i < 16,
        timeSpent: Math.floor(Math.random() * 60) + 20,
        category: ['Variables & Types', 'Functions', 'DOM', 'Async'][i % 4],
        topic: ['Data Types', 'Closures', 'Event Handling', 'Promises'][i % 4],
        difficulty: i % 5 === 0 ? 'Hard' : i % 3 === 0 ? 'Medium' : 'Easy',
        points: i % 5 === 0 ? 2 : 1 // Some questions worth more points
      })),
      topics: [
        { name: 'Variables & Types', correct: 4, total: 5, accuracy: 80 },
        { name: 'Functions', correct: 5, total: 5, accuracy: 100 },
        { name: 'DOM', correct: 4, total: 5, accuracy: 80 },
        { name: 'Async', correct: 3, total: 5, accuracy: 60 }
      ],
      timeDistribution: [
        { range: '0-30s', count: 8 },
        { range: '30-60s', count: 7 },
        { range: '60-90s', count: 3 },
        { range: '90s+', count: 2 }
      ],
      streak: {
        longest: 8,
        current: 3,
        average: 5.2
      }
    };
    
    setQuizResults(mockResults);
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

  // Destructure all data
  const {
    score,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    timeLimit,
    timeUsed,
    category,
    difficulty,
    date,
    rank,
    totalParticipants,
    averageScore,
    highestScore,
    percentile,
    questions,
    topics,
    timeDistribution,
    streak
  } = quizResults;

  // Calculations
  const percentage = score;
  const timePercentage = (timeUsed / timeLimit) * 100;
  const formattedTime = `${Math.floor(timeUsed / 60)}:${(timeUsed % 60).toString().padStart(2, '0')}`;
  const formattedTimeLimit = `${Math.floor(timeLimit / 60)}:${(timeLimit % 60).toString().padStart(2, '0')}`;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const accuracy = (correctAnswers / totalQuestions) * 100;
  const averageTimePerQuestion = timeUsed / totalQuestions;

  // Performance helpers
  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getPerformanceBgColor = (score) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getPerformanceText = (score) => {
    if (score >= 90) return 'Excellent Performance';
    if (score >= 75) return 'Strong Performance';
    if (score >= 60) return 'Good Performance';
    return 'Keep Practicing';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const handleExportResults = () => {
    // Implement export functionality
    const dataStr = JSON.stringify(quizResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-results-${category.toLowerCase().replace(/\s+/g, '-')}-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: `My Quiz Results: ${category}`,
        text: `I scored ${score}% on ${category} quiz!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Results link copied to clipboard!');
    }
  };

  const handleReviewQuestions = () => {
    navigate('/quiz/review', { state: quizResults });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 border border-gray-200">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <p className="text-gray-600">Detailed analysis of your performance</p>
        </div>

        {/* Main Score Card - Three Panel Layout */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              
              {/* Left Panel - Quiz Info & Stats */}
              <div className="lg:w-2/5">
                {/* Header with category and difficulty */}
                <div className="mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium mb-4">
                    <Hash className="w-4 h-4 mr-2" />
                    {category}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Quiz Summary</h2>
                  <div className="flex items-center text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        difficulty === 'Beginner' ? 'bg-emerald-500' :
                        difficulty === 'Intermediate' ? 'bg-blue-500' :
                        difficulty === 'Advanced' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span className="text-sm font-medium">{difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Questions
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {totalQuestions}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Total attempted</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Time
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formattedTime}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Completion time</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Accuracy
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Correct answers</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Score
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {percentage}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Final score</div>
                  </div>
                </div>

                {/* Performance Indicator Bar */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Performance Level</span>
                    <span className={`text-sm font-semibold ${getPerformanceColor(percentage)}`}>
                      {getPerformanceText(percentage)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getPerformanceBgColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Center Panel - Score Circle */}
              <div className="lg:w-1/3 flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getScoreColor(percentage)} mb-2`}>
                        {percentage}%
                      </div>
                      <div className="text-gray-600 text-sm tracking-wide">FINAL SCORE</div>
                      <div className={`text-sm font-medium ${getPerformanceColor(percentage)} mt-2`}>
                        {getPerformanceText(percentage)}
                      </div>
                    </div>
                  </div>
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="116"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-100"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="116"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className={getScoreColor(percentage)}
                      strokeDasharray={`${2 * Math.PI * 116}`}
                      strokeDashoffset={2 * Math.PI * 116 * (1 - percentage / 100)}
                    />
                  </svg>
                </div>
              </div>

              {/* Right Panel - Answer Breakdown */}
              <div className="lg:w-2/5">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                    Answer Analysis
                  </h3>
                  
                  {/* Correct Answers Card */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Correct Answers</div>
                          <div className="text-2xl font-bold text-gray-900">{correctAnswers}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          +{Math.round(correctAnswers * 100 / totalQuestions)}%
                        </div>
                        <div className="text-sm text-gray-500">of total</div>
                      </div>
                    </div>
                    <div className="w-full bg-emerald-100 rounded-full h-1.5">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Incorrect Answers Card */}
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mr-4">
                          <XCircle className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Incorrect Answers</div>
                          <div className="text-2xl font-bold text-gray-900">{incorrectAnswers}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-rose-600">
                          {Math.round(incorrectAnswers * 100 / totalQuestions)}%
                        </div>
                        <div className="text-sm text-gray-500">of total</div>
                      </div>
                    </div>
                    <div className="w-full bg-rose-100 rounded-full h-1.5">
                      <div 
                        className="bg-rose-500 h-1.5 rounded-full"
                        style={{ width: `${(incorrectAnswers / totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Time Efficiency */}
                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <div className="flex items-center mb-4">
                      <Clock className="w-5 h-5 text-blue-600 mr-3" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700">Time Efficiency</div>
                        <div className="text-xs text-gray-500">Average per question</div>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {averageTimePerQuestion.toFixed(1)}s
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 flex justify-between">
                      <span>Fast</span>
                      <span>Optimal</span>
                      <span>Slow</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full ${
                          averageTimePerQuestion < 30 ? 'bg-emerald-500' :
                          averageTimePerQuestion < 60 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ 
                          width: `${Math.min(averageTimePerQuestion / 90 * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Leaderboard Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Leaderboard Position</h4>
                <p className="text-sm text-gray-600">Compared to {totalParticipants} participants</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Your Rank</span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">#{rank}</span>
                  <span className="text-sm text-purple-600 font-medium">Top {percentile}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average Score</span>
                <span className="text-xl font-bold text-gray-900">{averageScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Highest Score</span>
                <span className="text-xl font-bold text-emerald-600">{highestScore}%</span>
              </div>
            </div>
          </div>

          {/* Topic Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Topic Performance</h4>
                  <p className="text-sm text-gray-600">Accuracy by topic</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {topics.map((topic, index) => (
                <div key={topic.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">{topic.name}</span>
                    <span className={`text-sm font-medium ${
                      topic.accuracy >= 80 ? 'text-emerald-600' :
                      topic.accuracy >= 60 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {topic.accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        topic.accuracy >= 80 ? 'bg-emerald-500' :
                        topic.accuracy >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${topic.accuracy}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {topic.correct} of {topic.total} correct
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Time Distribution</h4>
                <p className="text-sm text-gray-600">Per question time spent</p>
              </div>
            </div>
            <div className="space-y-3">
              {timeDistribution.map((item, index) => (
                <div key={item.range} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.range}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-100 rounded-full h-2 mr-3">
                      <div 
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(item.count / totalQuestions) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question Review Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
              <span className="ml-3 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {totalQuestions} questions
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExportResults}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button 
                onClick={handleShareResults}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
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
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded mr-2">
                        {q.topic}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                        q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3 font-medium">{q.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Your Answer</div>
                        <div className={`font-medium ${
                          q.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {q.userAnswer}
                        </div>
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
                    <div className="text-xs text-gray-600 mt-2 flex items-center justify-end">
                      <Clock className="w-3 h-3 mr-1" />
                      {q.timeSpent}s
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {q.points} point{q.points > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {questions.length > 3 && (
              <div className="text-center pt-4 border-t border-gray-200">
                <button 
                  onClick={handleReviewQuestions}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all {questions.length} questions
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Streak and Additional Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{streak.longest}</div>
              <div className="text-sm text-gray-600">Longest Streak</div>
              <div className="text-xs text-gray-500 mt-1">Consecutive correct answers</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
              <Users className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{percentile}%</div>
              <div className="text-sm text-gray-600">Percentile</div>
              <div className="text-xs text-gray-500 mt-1">Better than {100 - percentile}% of participants</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <Target className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{streak.average}</div>
              <div className="text-sm text-gray-600">Average Streak</div>
              <div className="text-xs text-gray-500 mt-1">Typical consecutive correct answers</div>
            </div>
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