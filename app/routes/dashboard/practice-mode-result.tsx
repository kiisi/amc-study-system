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
  FileQuestion,
  HashIcon
} from 'lucide-react';
import NavBar from '~/components/navbar';
import { practiceModeQuizResult } from './action';

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");

  const data = await practiceModeQuizResult(params.session);

  return data;
}

export default function QuizResult({ loaderData }) {

  console.log(loaderData)
  const quizResultData = loaderData.data;
  const location = useLocation();
  const navigate = useNavigate();

  const score = quizResultData.percentage;
  const totalQuestions = quizResultData.totalQuestions;
  const correctAnswers = quizResultData.correctAnswers;
  const incorrectAnswers = quizResultData.wrongAnswers;
  const timeLimit = 1800;
  const timeUsed = quizResultData.timeUsed;
  const date = quizResultData.date;
  const averageTimeUsed = quizResultData.averageTimeUsed;

  // if (!quizResults) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-pulse space-y-4">
  //           <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
  //           <div className="h-8 bg-gray-300 rounded w-48 mx-auto"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  const percentage = score;
  const formattedTime = timeUsed;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const accuracy = (correctAnswers / totalQuestions) * 100;

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getPerformanceText = (score: number) => {
    if (score >= 90) return 'Excellent Performance';
    if (score >= 70) return 'Strong Performance';
    if (score >= 60) return 'Good Performance';
    if (score >= 50) return 'Fair Performance';
    return 'Keep Practicing';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-50 to-emerald-50';
    if (score >= 70) return 'from-blue-500 to-indigo-600';
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className='py-8 px-4'>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="grid place-items-center text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 border border-gray-200">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Quiz Results</h1>
            <p className="text-gray-600">Summary of your performance</p>
            <div className="flex items-center gap-2 mt-2">
              {/* <span className="text-sm text-gray-600">{difficulty}</span>
            <span className="text-gray-300">•</span> */}
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {formattedDate}
              </div>
            </div>
          </div>

          <div className='mb-3 lg:mb-6 gap-3 lg:gap-6 grid md:grid-cols-[360px_1fr]'>
            {/* Score Circle */}
            <div className='grid place-items-center bg-white rounded-xl border border-gray-300 p-5 md:p-6'>
              <div className="relative w-fit">
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
                      className={`${percentage >= 70 ? 'text-green-500' : percentage >= 60 ? 'text-blue-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}
                      strokeDasharray={`${2 * Math.PI * 100}`}
                      strokeDashoffset={2 * Math.PI * 100 * (1 - percentage / 100)}
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* Quick Stats */}
            <div className='grid place-items-center bg-white rounded-xl border border-gray-300 p-5 md:p-6'>
              <div className="w-full bg-gray-50 rounded-lg p-5 md:p-6">
                <h3 className="font-medium text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HashIcon className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-700">Questions</span>
                    </div>
                    <span className="font-semibold text-gray-900">{incorrectAnswers}</span>
                  </div>
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

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6 mb-10">
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
                {averageTimeUsed}s
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
          {/* <div className="bg-white rounded-xl border border-gray-300 p-6 mb-8">
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
        </div> */}

          {/* Question Review Section */}



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
    </div>
  );
};
