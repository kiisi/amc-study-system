// components/Footer.jsx
import { Link } from 'react-router';
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  User,
  Award,
  HelpCircle,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Main navigation links
  const mainLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Quizzes', path: '/quizzes', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Progress', path: '/progress', icon: <TrendingUp className="w-4 h-4" /> },
    // { name: 'Leaderboard', path: '/leaderboard', icon: <Award className="w-4 h-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  // Support links
  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'FAQ', path: '/faq' },
  ];

  // Legal links
  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    // { name: 'Terms of Service', path: '/terms' },
    // { name: 'Cookie Policy', path: '/cookies' },
  ];

  // Social media links
  const socialLinks = [
    { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: 'https://github.com' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AMC Study System</h3>
                <p className="text-sm text-gray-400">Master your knowledge</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              An interactive learning platform designed to help you master concepts through practice and assessment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="mr-3 opacity-70 group-hover:opacity-100">
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <HelpCircle className="w-4 h-4 mr-3 opacity-70" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-5 pt-8">
          <div className="flex flex-col justify-between items-center space-y-2">
            
            {/* Copyright */}
            <div className="text-sm text-center text-gray-400">
              <p>© {currentYear} QuizMaster. All rights reserved.</p>
              <p className="mt-1">Made with <Heart className="w-4 h-4 inline text-red-500" /> for learners worldwide</p>
            </div>

            {/* Legal Links */}
            {/* <div className="flex flex-wrap gap-6 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <a 
                href="mailto:contact@quizmaster.com"
                className="text-gray-400 hover:text-white transition-colors flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </a>
            </div> */}

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;