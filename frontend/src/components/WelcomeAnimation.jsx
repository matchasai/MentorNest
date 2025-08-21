import React, { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaGraduationCap, FaUserGraduate } from 'react-icons/fa';

const WelcomeAnimation = ({ userName = "Sai Sujan" }) => {
  const [welcomeText, setWelcomeText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const fullText = `Welcome back, ${userName}! 👋`;

  useEffect(() => {
    // Animated welcome text
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < fullText.length) {
          setWelcomeText(fullText.substring(0, prev + 1));
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 100);

    // Blinking cursor effect
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [fullText]);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaGraduationCap className="text-white text-2xl" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <FaUserGraduate className="text-gray-800 text-xs" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-blue-200 mb-2">
            {welcomeText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
              |
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Here's what's happening with MentorNest today</p>
        </div>
      </div>
      
      {/* Animated stats preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <FaUserGraduate className="text-blue-400 text-xl" />
            <div>
              <div className="text-blue-200 text-sm font-medium">Active Learners</div>
              <div className="text-white text-lg font-bold">Growing daily</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center gap-3">
            <FaChalkboardTeacher className="text-green-400 text-xl" />
            <div>
              <div className="text-green-200 text-sm font-medium">Expert Mentors</div>
              <div className="text-white text-lg font-bold">Sharing knowledge</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <FaGraduationCap className="text-purple-400 text-xl" />
            <div>
              <div className="text-purple-200 text-sm font-medium">Certificates</div>
              <div className="text-white text-lg font-bold">Being earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation; 