import React, { useState } from 'react';
import { User, Sun, Moon } from 'lucide-react';

/**
 * Simple Welcome Page Component
 * Copy this entire file into your React project and use it.
 */

export default function WelcomePage() {
  const [isDark, setIsDark] = useState(true);
  const [name, setName] = useState('');

  const handleSignIn = () => {
    if (name.trim()) {
      console.log('Signing in:', name);
      // Add your navigation logic here
      // e.g., navigate('/home');
    }
  };

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    } transition-colors duration-500 flex items-center justify-center p-4`}>
      
      <div className="w-full max-w-md">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-11" />
          
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
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
            LRT <span className="text-blue-500">buddies</span>
          </h2>
          <div className="h-1 w-16 bg-blue-500 mx-auto mt-2 rounded-full" />
        </div>

        {/* Main card */}
        <div className={`${
          isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
        } backdrop-blur-sm rounded-3xl shadow-2xl p-8 border`}>
          
          {/* User icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-gray-700 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Welcome message */}
          <h1 className={`text-3xl font-bold text-center mb-8 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Passenger!
          </h1>

          {/* Name input */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
            />
          </div>

          {/* Sign In button */}
          <button
            onClick={handleSignIn}
            disabled={!name.trim()}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </div>

        {/* Role selection links */}
        <div className="mt-8 text-center">
          <div className={`flex items-center justify-center gap-4 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <button className={`${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
            } font-medium transition-all duration-300 hover:underline`}>
              Are You an Officer?
            </button>
            
            <span>or</span>
            
            <button className={`${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
            } font-medium transition-all duration-300 hover:underline`}>
              Are You a Manager?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          } tracking-wide`}>
            powered by <span className="font-semibold text-blue-500">empower</span>
          </p>
        </div>
      </div>
    </div>
  );
}
