import React, { useState, useRef, useEffect } from 'react';
import { User, Edit, MapPin, Sun, Moon, Camera } from 'lucide-react';

export default function PassengerHome({ userName }) {
  const [isDark, setIsDark] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [currentGreeting, setCurrentGreeting] = useState('');
  const videoRef = useRef(null);

  // Extract first name from full name
  const firstName = userName ? userName.split(' ')[0] : 'Guest';

  // Get greeting based on actual current time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 0 && hour < 5) return 'Night'; // 12am - 4:59am (Late night)
    if (hour >= 5 && hour < 12) return 'Morning'; // 5am - 11:59am
    if (hour >= 12 && hour < 17) return 'Afternoon'; // 12pm - 4:59pm
    if (hour >= 17 && hour < 21) return 'Evening'; // 5pm - 8:59pm
    return 'Night'; // 9pm - 11:59pm (Night time)
  };

  // Update greeting on mount and every minute
  useEffect(() => {
    // Set initial greeting
    setCurrentGreeting(getGreeting());

    // Update greeting every minute
    const interval = setInterval(() => {
      setCurrentGreeting(getGreeting());
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isCameraActive && videoRef.current) {
        // If the tab becomes visible again and the camera was active, try to play the video
        videoRef.current.play().catch(err => {
          console.error('Error resuming video play after tab visibility change:', err);
          // If playing fails (e.g., stream was lost), we might need to reactivate the camera
          // For now, just logging the error. A more robust solution might reset the view.
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCameraActive, stream]); // Depend on isCameraActive and stream

  // Activate camera when viewfinder is clicked
  const activateCamera = async () => {
    // If a stream already exists, stop it before getting a new one
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Try back camera first (mobile)
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false 
      });
      
      // Set the stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Make sure video plays
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        };
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
      console.log('Camera activated successfully!');
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      // Provide helpful error messages
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert('No camera found on this device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        alert('Camera is already in use by another application.');
      } else {
        alert('Unable to access camera: ' + err.message);
      }
      
      // Ensure we reset state if activation fails
      setIsCameraActive(false);
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!isCameraActive) {
      alert('Please activate the camera first by tapping the viewfinder area.');
      return;
    }
    
    console.log('Camera shutter clicked');
    // Add photo capture logic here
    alert('Photo captured! (Capture functionality to be implemented)');
  };

  const handleNavClick = (nav) => {
    console.log(`Navigating to: ${nav}`);
    // Add navigation logic here
  };

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    } transition-colors duration-500 flex flex-col`}>
      
      {/* Header with personalized greeting and theme toggle */}
      <div className="p-6 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-blue-900'
        }`}>
          {currentGreeting} {firstName}
        </h1>

        {/* Theme toggle button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full ${
            isDark 
              ? 'bg-blue-700 hover:bg-blue-600 text-white' 
              : 'bg-blue-200 hover:bg-blue-300 text-gray-900'
          } transition-all duration-300`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Camera Viewfinder Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        
        {/* Camera activation button - only shown when camera is NOT active */}
        {!isCameraActive && (
          <button
            onClick={activateCamera}
            className={`absolute inset-0 ${
              isDark ? 'bg-gray-900/80' : 'bg-blue-100/60'
            } cursor-pointer hover:bg-opacity-70 transition-all duration-300 flex flex-col items-center justify-center gap-6`}
          >
            <Camera className={`w-16 h-16 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} strokeWidth={1.5} />
            <div className="text-center px-6">
              <p className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Tap to Open Camera
              </p>
              <p className={`text-sm ${
                isDark ? 'text-blue-300' : 'text-blue-600'
              }`}>
                Start capturing safety and accessibility reports
              </p>
            </div>
          </button>
        )}

        {/* Video element for live camera feed - only shown when active */}
        {isCameraActive && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />
        )}

        {/* Shutter Button - only visible when camera is active */}
        {isCameraActive && (
          <button
            onClick={handleCapture}
            className="absolute bottom-32 z-20 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Capture photo"
          >
            <div className={`w-20 h-20 rounded-full border-4 ${
              isDark ? 'border-white' : 'border-blue-600'
            } flex items-center justify-center bg-white/20 hover:bg-white/30 transition-all duration-300`}>
              <div className={`w-16 h-16 rounded-full ${
                isDark ? 'bg-white' : 'bg-blue-600'
              }`} />
            </div>
          </button>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="p-6">
        <div className={`${
          isDark ? 'bg-gray-800/80' : 'bg-white/90'
        } backdrop-blur-sm rounded-3xl shadow-2xl p-4 border-2 ${
          isDark ? 'border-gray-700' : 'border-blue-200'
        }`}>
          <div className="flex items-center justify-around">
            {/* Profile Icon */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`p-4 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'hover:bg-blue-700/50 text-white' 
                  : 'hover:bg-blue-100 text-blue-900'
              }`}
              aria-label="Profile"
            >
              <User className="w-7 h-7" strokeWidth={2} />
            </button>

            {/* Edit/Compose Icon */}
            <button
              onClick={() => handleNavClick('compose')}
              className={`p-4 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'hover:bg-blue-700/50 text-white' 
                  : 'hover:bg-blue-100 text-blue-900'
              }`}
              aria-label="Compose report"
            >
              <Edit className="w-7 h-7" strokeWidth={2} />
            </button>

            {/* Location/Map Icon */}
            <button
              onClick={() => handleNavClick('map')}
              className={`p-4 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'hover:bg-blue-700/50 text-white' 
                  : 'hover:bg-blue-100 text-blue-900'
              }`}
              aria-label="Map"
            >
              <MapPin className="w-7 h-7" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
