import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, ArrowLeft, Sun, Moon, ChevronDown } from 'lucide-react';

export default function ManagerWelcome({ onBack, onSignIn }) {
  const [isDark, setIsDark] = useState(true);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const departments = [
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'safety', label: 'Safety' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDepartment = (value, label) => {
    setDepartment(value);
    setIsDropdownOpen(false);
  };

  const handleSignIn = () => {
    if (name.trim() && department.trim()) {
      if (onSignIn) {
        onSignIn(name, department);
      }
    }
  };

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900' 
        : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'
    } transition-colors duration-500 flex items-center justify-center p-4`}>
      
      <div className="w-full max-w-md">
        {/* Header with back button and theme toggle */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-teal-700 hover:bg-teal-600 text-white' 
                : 'bg-teal-200 hover:bg-teal-300 text-gray-900'
            } transition-all duration-300`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-teal-700 hover:bg-teal-600 text-white' 
                : 'bg-teal-200 hover:bg-teal-300 text-gray-900'
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
            LRT <span className="text-teal-400">buddies</span>
          </h2>
          <div className="h-1 w-16 bg-teal-500 mx-auto mt-2 rounded-full" />
        </div>

        {/* Main card - Different design for managers */}
        <div className={`${
          isDark ? 'bg-teal-800/50 border-teal-700' : 'bg-white/80 border-teal-200'
        } backdrop-blur-sm rounded-3xl shadow-2xl p-8 border`}>
          
          {/* Briefcase icon - Different from passenger and officer */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-teal-700 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Briefcase className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Welcome message */}
          <h1 className={`text-3xl font-bold text-center mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Manager!
          </h1>
          
          <p className={`text-center mb-8 ${
            isDark ? 'text-teal-200' : 'text-teal-600'
          }`}>
            Management Onboarding Portal
          </p>

          {/* Name input */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-teal-200' : 'text-gray-600'
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
                  ? 'bg-teal-900 border-teal-600 text-white placeholder-teal-300' 
                  : 'bg-white border-teal-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300`}
            />
          </div>

          {/* Department select - Custom dropdown for managers */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-teal-200' : 'text-gray-600'
            }`}>
              Department
            </label>
            <div className="relative" ref={dropdownRef}>
              {/* Dropdown button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-3 pr-10 rounded-xl border-2 text-left ${
                  isDark 
                    ? 'bg-teal-900 border-teal-600 text-white' 
                    : 'bg-white border-teal-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300`}
              >
                {department 
                  ? departments.find(d => d.value === department)?.label 
                  : <span className={isDark ? 'text-teal-300' : 'text-gray-500'}>Select your department</span>
                }
              </button>
              
              {/* Dropdown icon */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                } ${isDark ? 'text-teal-300' : 'text-gray-500'}`} />
              </div>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className={`absolute z-10 w-full mt-2 rounded-xl border-2 shadow-xl overflow-hidden ${
                  isDark 
                    ? 'bg-teal-900 border-teal-600' 
                    : 'bg-white border-teal-300'
                }`}>
                  {departments.map((dept) => (
                    <button
                      key={dept.value}
                      type="button"
                      onClick={() => handleSelectDepartment(dept.value, dept.label)}
                      className={`w-full px-4 py-3 text-left transition-all duration-200 ${
                        department === dept.value
                          ? isDark 
                            ? 'bg-teal-700 text-white' 
                            : 'bg-teal-100 text-teal-900'
                          : isDark
                            ? 'text-white hover:bg-teal-800'
                            : 'text-gray-900 hover:bg-teal-50'
                      }`}
                    >
                      {dept.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sign In button */}
          <button
            onClick={handleSignIn}
            disabled={!name.trim() || !department.trim()}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Access Dashboard
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className={`text-xs ${
            isDark ? 'text-teal-300' : 'text-gray-600'
          } tracking-wide`}>
            powered by <span className="font-semibold text-teal-400">empower</span>
          </p>
        </div>
      </div>
    </div>
  );
}
