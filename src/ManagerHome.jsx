import React, { useState } from 'react';
import { Map, List, User, Sun, Moon, LogOut, MapPin, AlertTriangle, Clock, Check, X, Send } from 'lucide-react';

// Mock data for incidents
const mockIncidents = [
  { id: 1, type: 'Safety', location: 'Station 12', time: '5m ago', description: 'Reported obstruction on platform 2.', status: 'New' },
  { id: 2, type: 'Accessibility', location: 'Train 104', time: '12m ago', description: 'Wheelchair ramp reported as stuck.', status: 'Viewed' },
  { id: 3, type: 'Safety', location: 'Station 9', time: '30m ago', description: 'Suspicious individual reported near ticketing.', status: 'In Progress' },
  { id: 4, type: 'Accessibility', location: 'Station 12', time: '45m ago', description: 'Elevator E2 not functioning.', status: 'New' },
];

export default function ManagerHome({ userName, department, onSignOut }) {
  const [isDark, setIsDark] = useState(true);
  
  // Extract first name
  const firstName = userName ? userName.split(' ')[0] : 'Manager';
  // Fallback for department prop to prevent crash
  const deptLabel = department ? department.charAt(0).toUpperCase() + department.slice(1) : 'General';

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'Safety':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Accessibility':
        return <User className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-red-500 text-white';
      case 'Viewed':
        return 'bg-blue-500 text-white';
      case 'In Progress':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900' 
        : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'
    } transition-colors duration-500 flex flex-col`}>
      
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-teal-900'
        }`}>
          Welcome Manager {firstName}
          <span className={`text-lg font-normal ml-2 ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
            ({deptLabel})
          </span>
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-teal-700 hover:bg-teal-600 text-white' 
                : 'bg-teal-200 hover:bg-teal-300 text-gray-900'
            } transition-all duration-300`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onSignOut}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-teal-700 hover:bg-teal-600 text-white' 
                : 'bg-teal-200 hover:bg-teal-300 text-gray-900'
            } transition-all duration-300`}
            aria-label="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
        
        {/* Map View Placeholder */}
        <div className={`rounded-3xl shadow-2xl border ${
          isDark ? 'bg-teal-800/50 border-teal-700' : 'bg-white/80 border-teal-200'
        } backdrop-blur-sm flex flex-col items-center justify-center`}>
          <MapPin className={`w-24 h-24 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} strokeWidth={1} />
          <h2 className={`text-2xl font-semibold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Live Incident Map
          </h2>
          <p className={`${isDark ? 'text-teal-200' : 'text-teal-700'} mt-2`}>
            Map view will be displayed here.
          </p>
        </div>

        {/* Nearby Incidents List */}
        <div className={`rounded-3xl shadow-2xl border ${
          isDark ? 'bg-teal-800/50 border-teal-700' : 'bg-white/80 border-teal-200'
        } backdrop-blur-sm flex flex-col overflow-hidden`}>
          <h2 className={`text-2xl font-semibold p-6 border-b ${
            isDark ? 'text-white border-teal-700' : 'text-gray-900 border-teal-200'
          }`}>
            Manage Reports
          </h2>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mockIncidents.map((incident) => (
              <div key={incident.id} className={`rounded-2xl p-4 border ${
                isDark ? 'bg-teal-900/70 border-teal-700' : 'bg-white border-teal-200'
              } shadow-lg`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {getIncidentIcon(incident.type)}
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {incident.type} Report
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                <p className={`mb-4 ${isDark ? 'text-teal-100' : 'text-gray-800'}`}>
                  {incident.description}
                </p>
                <div className={`flex justify-between items-center text-sm mb-4 ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{incident.time}</span>
                  </div>
                </div>
                {/* Managerial Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-1 transition-all duration-200">
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1 transition-all duration-200">
                    <X className="w-4 h-4" />
                    Deny
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1 transition-all duration-200">
                    <Send className="w-4 h-4" />
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="p-6">
        <div className={`${
          isDark ? 'bg-gray-800/80' : 'bg-white/90'
        } backdrop-blur-sm rounded-3xl shadow-2xl p-4 border-2 ${
          isDark ? 'border-gray-700' : 'border-blue-200'
        }`}>
          <div className="flex items-center justify-around">
            <button
              className={`p-4 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-blue-700/50 text-white' 
                  : 'bg-blue-100 text-blue-900'
              }`}
              aria-label="Map"
            >
              <Map className="w-7 h-7" strokeWidth={2} />
            </button>
            <button
              className={`p-4 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'hover:bg-blue-700/50 text-white' 
                  : 'hover:bg-blue-100 text-blue-900'
              }`}
              aria-label="Reports"
            >
              <List className="w-7 h-7" strokeWidth={2} />
            </button>
            <button
              className={`p-4 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'hover:bg-blue-700/50 text-white' 
                  : 'hover:bg-blue-100 text-blue-900'
              }`}
              aria-label="Profile"
            >
              <User className="w-7 h-7" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

