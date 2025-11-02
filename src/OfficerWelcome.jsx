import React, { useState } from 'react';
import { Shield, ArrowLeft, Sun, Moon } from 'lucide-react';

export default function OfficerWelcome({ onBack, onSignIn }) {
  const [isDark, setIsDark] = useState(true);
  const [name, setName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');

  const handleSignIn = () => {
    if (name.trim() && badgeNumber.trim()) {
      if (onSignIn) {
        onSignIn(name, badgeNumber);
      }
    }
  };

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    } transition-colors duration-500 flex items-center justify-center p-4`}>
      
      <div className="w-full max-w-md">
        {/* Header with back button and theme toggle */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                : 'bg-purple-200 hover:bg-purple-300 text-gray-900'
            } transition-all duration-300`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                : 'bg-purple-200 hover:bg-purple-300 text-gray-900'
            } transition-all duration-300`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Brand name */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          } tracking-wide`}>
            LRT <span className="text-purple-400">buddies</span>
          </h2>
          <div className="h-1 w-16 bg-purple-500 mx-auto mt-2 rounded-full" />
        </div>

        {/* Main card - Different design for officers */}
        <div className={`${
          isDark ? 'bg-purple-800/50 border-purple-700' : 'bg-white/80 border-purple-200'
        } backdrop-blur-sm rounded-3xl shadow-2xl p-8 border`}>
          
          {/* Shield icon - Different from passenger */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-purple-700 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Shield className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Welcome message */}
          <h1 className={`text-3xl font-bold text-center mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Officer!
          </h1>
          
          <p className={`text-center mb-8 ${
            isDark ? 'text-purple-200' : 'text-purple-600'
          }`}>
            Officer Onboarding Portal
          </p>

          {/* Name input */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-purple-200' : 'text-gray-600'
            }`}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                isDark 
                  ? 'bg-purple-900 border-purple-600 text-white placeholder-purple-300' 
                  : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
            />
          </div>

          {/* Badge Number input - Unique to officers */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-purple-200' : 'text-gray-600'
            }`}>
              Badge Number
            </label>
            <input
              type="text"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              placeholder="Enter your badge number"
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                isDark 
                  ? 'bg-purple-900 border-purple-600 text-white placeholder-purple-300' 
                  : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
              onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
            />
          </div>

          {/* Sign In button */}
          <button
            onClick={handleSignIn}
            disabled={!name.trim() || !badgeNumber.trim()}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Access Dashboard
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className={`text-xs ${
            isDark ? 'text-purple-300' : 'text-gray-600'
          } tracking-wide`}>
            powered by <span className="font-semibold text-purple-400">empower</span>
          </p>
        </div>
      </div>
    </div>
  );
}
