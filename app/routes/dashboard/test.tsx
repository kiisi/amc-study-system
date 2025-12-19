
import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Trophy, Star, Award, TrendingUp } from 'lucide-react';


const AnimatedScoreCircle = ({ score = 75, size = 224, strokeWidth = 12, animationDuration = 1.5 }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const hasAnimated = useRef(false);
  
  // Animation for the score number
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 15,
    duration: animationDuration * 1000,
  });
  
  // Transform spring value to percentage
  const animatedScore = useTransform(spring, (value) => Math.round(value));
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Get performance level and color
  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'from-emerald-500 to-green-400';
    if (percentage >= 80) return 'from-green-500 to-emerald-400';
    if (percentage >= 70) return 'from-blue-500 to-cyan-400';
    if (percentage >= 60) return 'from-yellow-500 to-amber-400';
    if (percentage >= 50) return 'from-orange-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };
  
  const getPerformanceText = (percentage) => {
    if (percentage >= 90) return 'Exceptional';
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Average';
    if (percentage >= 50) return 'Needs Work';
    return 'Review Required';
  };
  
  const getPerformanceIcon = (percentage) => {
    if (percentage >= 90) return <Star className="w-8 h-8 text-yellow-400" />;
    if (percentage >= 80) return <Award className="w-8 h-8 text-emerald-400" />;
    if (percentage >= 70) return <Trophy className="w-8 h-8 text-blue-400" />;
    return <TrendingUp className="w-8 h-8 text-amber-400" />;
  };
  
  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      spring.set(score);
      
      // Update display score as animation progresses
      const unsubscribe = animatedScore.onChange((value) => {
        setDisplayScore(value);
      });
      
      return () => unsubscribe();
    }
  }, [score, spring, animatedScore]);
  
  const performanceColor = getPerformanceColor(score);
  const performanceText = getPerformanceText(score);
  
  return (
    <div className="relative w-fit" style={{ width: size, height: size }}>
      {/* Animated rings */}
      <div className="absolute inset-0">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full blur-lg opacity-30"
          style={{ background: `linear-gradient(45deg, ${performanceColor})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: animationDuration * 0.8, duration: 0.5 }}
        />
        
        {/* Inner ring shadow */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/80 to-gray-100/50 shadow-inner" />
      </div>
      
      {/* SVG Circle */}
      <svg 
        className="w-full h-full transform -rotate-90" 
        style={{ width: size, height: size }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-100 dark:text-gray-700"
        />
        
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ 
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset 
          }}
          transition={{
            duration: animationDuration,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          filter="url(#shadow)"
        />
        
        {/* Definition for gradient */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-emerald-500" style={{ stopColor: 'currentColor' }} />
            <stop offset="100%" className="text-cyan-400" style={{ stopColor: 'currentColor' }} />
          </linearGradient>
          
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: animationDuration * 0.7, duration: 0.4 }}
        >
          {/* Score with counting animation */}
          <motion.div 
            className={`text-5xl font-bold bg-gradient-to-r ${performanceColor} bg-clip-text text-transparent`}
          >
            {displayScore}%
          </motion.div>
          
          {/* Performance text */}
          <motion.div 
            className="text-gray-600 mt-2 text-sm font-medium"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: animationDuration * 0.9, duration: 0.3 }}
          >
            Final Score
          </motion.div>
          
          {/* Performance level with icon */}
          <motion.div 
            className={`mt-2 flex items-center justify-center space-x-2`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: animationDuration, duration: 0.3 }}
          >
            {getPerformanceIcon(score)}
            <span className={`text-lg font-semibold bg-gradient-to-r ${performanceColor} bg-clip-text text-transparent`}>
              {performanceText}
            </span>
          </motion.div>
          
          {/* Subtle animation for passing score */}
          {score >= 70 && (
            <motion.div
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: animationDuration * 1.2, duration: 0.5 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                <span className="text-xs font-medium text-emerald-700">Passing Score Achieved</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Floating particles effect for high scores */}
      {score >= 80 && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-yellow-400"
              initial={{
                x: size / 2,
                y: size / 2,
                opacity: 0
              }}
              animate={{
                x: size / 2 + Math.cos((i * 45 * Math.PI) / 180) * (radius + 20),
                y: size / 2 + Math.sin((i * 45 * Math.PI) / 180) * (radius + 20),
                opacity: [0, 1, 0]
              }}
              transition={{
                delay: animationDuration + i * 0.1,
                duration: 1,
                repeat: 1,
                repeatDelay: 2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ResultsPage = () => {
  

  return (
    <div>
      <AnimatedScoreCircle score={82.5} />
    </div>
  );
};

export default ResultsPage;