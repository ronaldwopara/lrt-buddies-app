import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, X, Camera, Image as ImageIcon } from 'lucide-react';

export default function ReportForm({ userName, initialPhoto, userLocation, onBack, onSubmit }) {
  const [photos, setPhotos] = useState(initialPhoto ? [initialPhoto] : []);
  const [category, setCategory] = useState('');
  const [trainLine, setTrainLine] = useState('');
  const [station, setStation] = useState('');
  const [description, setDescription] = useState('');
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);

  const firstName = userName ? userName.split(' ')[0] : 'Guest';

  // Station data organized by train line
  const stationsByLine = {
    Capital: ["Clareview", "Belvedere", "Coliseum", "Stadium", "Churchill", "Central",
      "Bay/Enterprise Square", "Corona", "Government Centre", "University",
      "Health Sciences/Jubilee", "McKernan/Belgravia", "South Campus/Fort Edmonton Park",
      "Southgate", "Century Park"],
    Metro: ["NAIT", "Kingsway", "MacEwan", "Churchill", "Central", "Bay/Enterprise Square",
      "Corona", "Government Centre", "University", "Health Sciences/Jubilee"],
    Valley: ["Mill Woods", "Davies", "Muttart", "Downtown", "West Edmonton Mall"]
  };

  // Get available stations based on selected train line
  const availableStations = trainLine ? stationsByLine[trainLine] || [] : [];

  // Handle train line change - reset station when line changes
  const handleTrainLineChange = (line) => {
    setTrainLine(line);
    setStation(''); // Reset station selection
  };

  // Open camera to take another photo
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
      setShowPhotoOptions(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    if (!video) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setPhotos([...photos, photoData]);
    setIsCameraActive(false);
    setStream(null);
  };

  // Open device gallery
  const openGallery = () => {
    fileInputRef.current?.click();
    setShowPhotoOptions(false);
  };

  // Handle file selection from gallery
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 3 - photos.length;
    
    files.slice(0, remainingSlots).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Delete a photo
  const deletePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // Cancel camera
  const cancelCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
    setStream(null);
  };

  // Validate form
  const isFormValid = () => {
    return photos.length > 0 && 
           category !== '' && 
           trainLine !== '' && 
           station !== '' && 
           description.trim() !== '';
  };

  // Handle back with confirmation
  const handleBackClick = () => {
    if (photos.length > 0 || category || trainLine || station || description) {
      const confirmed = window.confirm(
        'Are you sure you want to go back? You will lose all your progress including photos and form data.'
      );
      if (confirmed) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields and add at least one photo.');
      return;
    }
    
    // Pass data to review screen
    onSubmit({
      photos,
      category,
      trainLine,
      station,
      description,
      userName,
      userLocation
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex flex-col">
      
      {/* Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <video
            ref={videoRef}
            className="flex-1 w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />
          
          {/* Camera controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center">
            <button
              onClick={cancelCamera}
              className="px-6 py-3 bg-gray-800/80 text-white rounded-xl font-semibold"
            >
              Cancel
            </button>
            
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20"
            >
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>
            
            <div className="w-20" />
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 flex items-center gap-4 border-b border-blue-800/50">
          <button
            onClick={handleBackClick}
            className="p-3 rounded-full bg-blue-700 hover:bg-blue-600 text-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Create Report</h1>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          
          {/* Photos Section */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-3">
              Photos ({photos.length}/3) *
            </label>
            
            {photos.length === 0 && (
              <div className="mb-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-xl">
                <p className="text-yellow-300 text-sm">
                  At least 1 photo is required. Click "Add Photo" below to get started.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-4">
              {/* Existing photos */}
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => deletePhoto(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 rounded text-xs text-white font-semibold">
                      Main
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add more photos button */}
              {photos.length < 3 && (
                <button
                  onClick={() => setShowPhotoOptions(true)}
                  className="aspect-square bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-800/70 hover:border-blue-500 transition-all duration-300"
                >
                  <Plus className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-400">Add Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Photo Options Modal */}
          {showPhotoOptions && (
            <div className="fixed inset-0 z-40 bg-black/50 flex items-end">
              <div className="w-full bg-gray-900 rounded-t-3xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Add Photo</h3>
                
                <button
                  onClick={openCamera}
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-3 text-white font-semibold"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>
                
                <button
                  onClick={openGallery}
                  className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center gap-3 text-white font-semibold"
                >
                  <ImageIcon className="w-5 h-5" />
                  Choose from Gallery
                </button>
                
                <button
                  onClick={() => setShowPhotoOptions(false)}
                  className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-3">
              Category *
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setCategory('Accessibility')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  category === 'Accessibility'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                }`}
              >
                Accessibility
              </button>
              <button
                onClick={() => setCategory('Safety')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  category === 'Safety'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                }`}
              >
                Safety
              </button>
            </div>
          </div>

          {/* Train Line Selection */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Select Train Line *
            </label>
            <select
              value={trainLine}
              onChange={(e) => handleTrainLineChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 bg-blue-900 border-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">Select train line</option>
              <option value="Capital">Capital Line</option>
              <option value="Metro">Metro Line</option>
              <option value="Valley">Valley Line</option>
            </select>
          </div>

          {/* Station Selection */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Select Station *
            </label>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              disabled={!trainLine}
              className="w-full px-4 py-3 rounded-xl border-2 bg-blue-900 border-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select station</option>
              {availableStations.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Describe Your Issue *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border-2 bg-blue-900 border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            Review Report
          </button>
        </div>
      </div>
    </div>
  );
}
