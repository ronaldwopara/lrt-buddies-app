import React, { useState, useEffect } from 'react';
import PassengerWelcome from './PassengerWelcome';
import PassengerHome from './PassengerHome';
import ReportForm from './ReportForm';
import ReviewReport from './ReviewReport';
import ReportSuccess from './ReportSuccess';
import MapView from './MapView';
import OfficerWelcome from './OfficerWelcome';
import ManagerWelcome from './ManagerWelcome';

function App() {
  // This keeps track of which page to show
  const [currentPage, setCurrentPage] = useState('passenger');
  const [userName, setUserName] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Request location on app load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          console.log('User location obtained:', position.coords);
        },
        (error) => {
          console.error('Location error:', error);
          // Continue without location
        }
      );
    }
  }, []);

  // Show passenger page by default
  if (currentPage === 'passenger') {
    return (
      <PassengerWelcome 
        onRoleSelect={(role) => setCurrentPage(role)}
        onSignIn={(name) => {
          setUserName(name);
          setCurrentPage('passenger-home');
        }}
      />
    );
  }

  // Show passenger home page after sign in
  if (currentPage === 'passenger-home') {
    return (
      <PassengerHome 
        userName={userName}
        onNavigateToReport={(photoData) => {
          setCapturedPhoto(photoData);
          setCurrentPage('report-form');
        }}
        onNavigateToMap={() => {
          setCurrentPage('map-view');
        }}
      />
    );
  }

  // Show map view
  if (currentPage === 'map-view') {
    return (
      <MapView
        userName={userName}
        userLocation={userLocation}
        onBack={() => setCurrentPage('passenger-home')}
      />
    );
  }

  // Show report form after capturing photo
  if (currentPage === 'report-form') {
    return (
      <ReportForm
        userName={userName}
        initialPhoto={capturedPhoto}
        userLocation={userLocation}
        onBack={() => {
          setCapturedPhoto(null);
          setCurrentPage('passenger-home');
        }}
        onSubmit={(data) => {
          setReportData(data);
          setCurrentPage('review-report');
        }}
      />
    );
  }

  // Show review report screen
  if (currentPage === 'review-report') {
    return (
      <ReviewReport
        reportData={reportData}
        userLocation={userLocation}
        onBack={() => setCurrentPage('report-form')}
        onConfirm={(jsonData) => {
          setSubmittedReport(jsonData);
          setCurrentPage('report-success');
        }}
      />
    );
  }

  // Show success screen
  if (currentPage === 'report-success') {
    return (
      <ReportSuccess
        userName={userName}
        reportData={submittedReport}
        onBackToHome={() => {
          setCapturedPhoto(null);
          setReportData(null);
          setSubmittedReport(null);
          setCurrentPage('passenger-home');
        }}
      />
    );
  }

  // Show officer page when they click "Are You an Officer?"
  if (currentPage === 'officer') {
    return (
      <OfficerWelcome 
        onBack={() => setCurrentPage('passenger')}
      />
    );
  }

  // Show manager page when they click "Are You a Manager?"
  if (currentPage === 'manager') {
    return (
      <ManagerWelcome 
        onBack={() => setCurrentPage('passenger')}
      />
    );
  }
}

export default App;
