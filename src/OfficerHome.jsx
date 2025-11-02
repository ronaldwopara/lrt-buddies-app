import React, { useState } from 'react';
import { Map, List, User, Sun, Moon, LogOut, MapPin, AlertTriangle, Clock } from 'lucide-react';

// Mock data for incidents
const mockIncidents = [
  { id: 1, type: 'Safety', location: 'Station 12', time: '5m ago', description: 'Reported obstruction on platform 2.', status: 'New' },
  { id: 2, type: 'Accessibility', location: 'Train 104', time: '12m ago', description: 'Wheelchair ramp reported as stuck.', status: 'Viewed' },
  { id: 3, type: 'Safety', location: 'Station 9', time: '30m ago', description: 'Suspicious individual reported near ticketing.', status: 'In Progress' },
  { id: 4, type: 'Accessibility', location: 'Station 12', time: '45m ago', description: 'Elevator E2 not functioning.', status: 'New' },
];

export default function OfficerHome({ userName, badgeNumber, onSignOut }) {
  const [isDark, setIsDark] = useState(true);
  
  // Extract first name
  const firstName = userName ? userName.split(' ')[0] : 'Officer';

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
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    } transition-colors duration-500 flex flex-col`}>
      
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-indigo-900'
        }`}>
          Welcome Officer {firstName}
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                : 'bg-purple-200 hover:bg-purple-300 text-gray-900'
            } transition-all duration-300`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onSignOut}
            className={`p-3 rounded-full ${
              isDark 
                ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                : 'bg-purple-200 hover:bg-purple-300 text-gray-900'
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
          isDark ? 'bg-purple-800/50 border-purple-700' : 'bg-white/80 border-purple-200'
        } backdrop-blur-sm flex flex-col items-center justify-center`}>
          <MapPin className={`w-24 h-24 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} strokeWidth={1} />
          <h2 className={`text-2xl font-semibold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Live Incident Map
          </h2>
          <p className={`${isDark ? 'text-purple-200' : 'text-purple-700'} mt-2`}>
            Map view will be displayed here.
          </p>
        </div>

        {/* Nearby Incidents List */}
        <div className={`rounded-3xl shadow-2xl border ${
          isDark ? 'bg-purple-800/50 border-purple-700' : 'bg-white/80 border-purple-200'
        } backdrop-blur-sm flex flex-col overflow-hidden`}>
          <h2 className={`text-2xl font-semibold p-6 border-b ${
            isDark ? 'text-white border-purple-700' : 'text-gray-900 border-purple-200'
          }`}>
            Nearby Incidents
          </h2>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mockIncidents.map((incident) => (
              <div key={incident.id} className={`rounded-2xl p-4 border ${
                isDark ? 'bg-purple-900/70 border-purple-700' : 'bg-white border-purple-200'
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
                <p className={`mb-2 ${isDark ? 'text-purple-100' : 'text-gray-800'}`}>
                  {incident.description}
                </p>
                <div className={`flex justify-between items-center text-sm ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{incident.time}</span>
                  </div>
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
              aria-label="Incidents"
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
