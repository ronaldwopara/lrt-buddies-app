import React, { useState, useRef, useEffect } from 'react';
import { User, Edit, MapPin, Sun, Moon, Camera } from 'lucide-react';

export default function PassengerHome({ userName, onNavigateToReport, onNavigateToMap }) {
  const [isDark, setIsDark] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [cameraError, setCameraError] = useState(null);
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

  // Attach stream to video element
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
      };
    }
  }, [stream]);

  // Activate camera when viewfinder is clicked
  const activateCamera = async () => {
    setCameraError(null);
    
    try {
      // Try environment (back) camera first with common resolution
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false 
        });
      } catch (err) {
        // Fallback to user (front) camera if environment fails
        console.log('Environment camera not available, trying front camera');
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false 
        });
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
      console.log('Camera activated successfully!');
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      // Set user-friendly error messages
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError({
          title: 'Camera Permission Denied',
          message: 'Please allow camera access in your browser settings.',
          instructions: navigator.userAgent.includes('Safari') 
            ? 'Safari: Settings → Privacy & Security → Camera → Allow this website'
            : 'Chrome/Edge: Click the camera icon in the address bar and allow access'
        });
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError({
          title: 'No Camera Found',
          message: 'Please connect a camera to your device.',
          instructions: null
        });
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError({
          title: 'Camera In Use',
          message: 'The camera is being used by another application.',
          instructions: 'Please close other apps using the camera and try again.'
        });
      } else {
        setCameraError({
          title: 'Camera Error',
          message: 'Unable to access camera: ' + err.message,
          instructions: 'Please refresh the page and try again.'
        });
      }
    }
  };

  const handleCapture = () => {
    if (!isCameraActive) {
      alert('Please activate the camera first by tapping the viewfinder area.');
      return;
    }
    
    // Capture photo from video stream
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    if (!video) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    console.log('Photo captured successfully!');
    
    // Navigate to report form with the photo
    handleNavClick('compose', photoData);
  };

  const handleNavClick = (nav, photoData = null) => {
    console.log(`Navigating to: ${nav}`);
    
    if (nav === 'compose') {
      // Navigate to report form (with or without photo)
      if (onNavigateToReport) {
        onNavigateToReport(photoData); // photoData will be null if no photo
      }
    } else if (nav === 'map') {
      // Navigate to map view
      if (onNavigateToMap) {
        onNavigateToMap();
      }
    }
  };

  return (
    <div className={`h-screen overflow-hidden ${
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
            disabled={!!cameraError}
            className={`absolute inset-0 ${
              isDark ? 'bg-gray-900/80' : 'bg-blue-100/60'
            } ${!cameraError ? 'cursor-pointer hover:bg-opacity-70' : 'cursor-default'} transition-all duration-300 flex flex-col items-center justify-center gap-6`}
          >
            {cameraError ? (
              // Show error message
              <div className="px-6 max-w-md">
                <div className="bg-red-900/50 border-2 border-red-500 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-red-300 mb-3">{cameraError.title}</h3>
                  <p className="text-red-200 mb-4">{cameraError.message}</p>
                  {cameraError.instructions && (
                    <div className="bg-red-800/50 rounded-xl p-4">
                      <p className="text-sm text-red-100">{cameraError.instructions}</p>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCameraError(null);
                    }}
                    className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              // Show camera activation prompt
              <>
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
              </>
            )}
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
