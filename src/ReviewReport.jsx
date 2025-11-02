import React from 'react';
import { ArrowLeft, CheckCircle, Download } from 'lucide-react';

export default function ReviewReport({ reportData, userLocation, onBack, onConfirm }) {
  const { photos, category, trainLine, station, description, userName } = reportData;

  // Generate report JSON
  const generateReportJSON = () => {
    const timestamp = new Date().toISOString();
    const reportId = `tmp-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${new Date().toTimeString().slice(0, 8).replace(/:/g, '')}`;
    const userId = `anon_${Math.floor(Math.random() * 10000)}`;

    const reportJSON = {
      report_id: reportId,
      timestamp: timestamp,
      user_id: userId,
      
      report_details: {
        category: category,
        train_line: trainLine,
        station: station,
        description: description,
        severity_hint: null
      },
      
      photos: photos.map((photo, index) => ({
        id: `photo_${index + 1}`,
        source: "camera",
        url: photo, // In production, this would be uploaded to CDN
        metadata: {
          width: 1024,
          height: 768,
          format: "jpg",
          size_kb: Math.round(photo.length * 0.75 / 1024) // Approximate size
        }
      })),
      
      geo: {
        lat: userLocation?.lat || reportData.userLocation?.lat || 53.5444,
        lon: userLocation?.lon || reportData.userLocation?.lon || -113.4909,
        accuracy_m: userLocation?.accuracy || reportData.userLocation?.accuracy || 10
      },
      
      device_info: {
        os: navigator.platform.includes('Win') ? 'Windows' : 
            navigator.platform.includes('Mac') ? 'MacOS' : 
            navigator.platform.includes('Linux') ? 'Linux' : 
            navigator.userAgent.includes('Android') ? 'Android' : 
            navigator.userAgent.includes('iPhone') ? 'iOS' : 'Unknown',
        app_version: "1.0.5",
        device_model: "Web Browser"
      },
      
      validation_flags: {
        has_minimum_photo: photos.length >= 1,
        has_valid_category: category !== '',
        has_valid_train_line: trainLine !== '',
        has_valid_station: station !== '',
        has_description: description.trim() !== ''
      },
      
      ui_flow: {
        photo_capture_flow: {
          min_required: 1,
          max_allowed: 3,
          current_count: photos.length
        },
        category_exclusivity: {
          safety: category === 'Safety',
          accessibility: category === 'Accessibility'
        },
        review_step_completed: true,
        submission_status: "pending",
        confirmation_message: "Report successfully submitted. Thank you for keeping our LRT safe!"
      },
      
      backend_flags: {
        is_structured: false,
        ai_summary_generated: false,
        embedding_created: false,
        duplicate_checked: false,
        severity_scored: false
      }
    };

    return reportJSON;
  };

  // Download JSON file
  const downloadJSON = () => {
    const json = generateReportJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${json.report_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle final submission
  const handleConfirmSubmit = () => {
    const json = generateReportJSON();
    console.log('Report JSON:', json);
    
    // Download the JSON file
    downloadJSON();
    
    // Show success and navigate
    onConfirm(json);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex flex-col">
      
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-blue-800/50">
        <button
          onClick={onBack}
          className="p-3 rounded-full bg-blue-700 hover:bg-blue-600 text-white transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Review Your Report</h1>
      </div>

      {/* Review Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Photos Preview */}
        <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50">
          <h2 className="text-lg font-semibold text-white mb-4">Photos ({photos.length})</h2>
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden">
                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 rounded text-xs text-white font-semibold">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Report Details */}
        <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Report Details</h2>
          
          <div>
            <p className="text-sm text-blue-300 mb-1">Category</p>
            <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
              category === 'Safety' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
            }`}>
              {category}
            </div>
          </div>

          <div>
            <p className="text-sm text-blue-300 mb-1">Train Line</p>
            <p className="text-white font-medium">{trainLine} Line</p>
          </div>

          <div>
            <p className="text-sm text-blue-300 mb-1">Station</p>
            <p className="text-white font-medium">{station}</p>
          </div>

          <div>
            <p className="text-sm text-blue-300 mb-1">Description</p>
            <p className="text-white">{description}</p>
          </div>
        </div>

        {/* Validation Status */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-700/50">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h2 className="text-lg font-semibold text-white">All Requirements Met</h2>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4" />
              At least 1 photo included ({photos.length}/3)
            </li>
            <li className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4" />
              Category selected: {category}
            </li>
            <li className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4" />
              Train line selected: {trainLine}
            </li>
            <li className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4" />
              Station selected: {station}
            </li>
            <li className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4" />
              Description provided
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleConfirmSubmit}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Submit Report
          </button>

          <button
            onClick={onBack}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300"
          >
            Edit Report
          </button>
        </div>
      </div>
    </div>
  );
}
