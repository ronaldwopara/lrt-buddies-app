import React from 'react';
import { CheckCircle, Home } from 'lucide-react';

export default function ReportSuccess({ userName, reportData, onBackToHome }) {
  const firstName = userName ? userName.split(' ')[0] : 'Guest';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-block animate-bounce">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">Report Submitted!</h1>
          <p className="text-blue-200 text-lg">
            Thank you, {firstName}!
          </p>
        </div>

        {/* Success Message Card */}
        <div className="bg-blue-800/50 backdrop-blur-sm rounded-3xl p-8 border border-blue-700 mb-6">
          <p className="text-white text-center mb-6">
            Your {reportData?.category} report for <span className="font-semibold">{reportData?.station} Station</span> on the {reportData?.trainLine} Line has been successfully submitted.
          </p>
          
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4">
            <p className="text-green-300 text-sm text-center">
              Thank you for keeping our LRT safe and accessible!
            </p>
          </div>
        </div>

        {/* Report ID */}
        {reportData?.report_id && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-700">
            <p className="text-xs text-gray-400 text-center mb-1">Report ID</p>
            <p className="text-white font-mono text-sm text-center">{reportData.report_id}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onBackToHome}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-blue-300">
            Your report JSON has been downloaded to your device.
          </p>
        </div>
      </div>
    </div>
  );
}
