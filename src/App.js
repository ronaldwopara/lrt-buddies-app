import React, { useState, useEffect } from 'react';
import PassengerWelcome from './PassengerWelcome';
import PassengerHome from './PassengerHome';
import ReportForm from './ReportForm';
import ReviewReport from './ReviewReport';
import ReportSuccess from './ReportSuccess';
import MapView from './MapView';
import OfficerWelcome from './OfficerWelcome';
import OfficerHome from './OfficerHome'; // Import OfficerHome
import ManagerWelcome from './ManagerWelcome';
import ManagerHome from './ManagerHome'; // Import ManagerHome

function App() {
  // This keeps track of which page to show
  const [currentPage, setCurrentPage] = useState('passenger');
  
  // States for all users
  const [userName, setUserName] = useState('');
  
  // States for Passenger flow
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // States for Officer/Manager flow
  const [badgeNumber, setBadgeNumber] = useState('');
  const [department, setDepartment] = useState('');

  // Request location on app load for passenger reporting
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

  // --- Passenger Welcome ---
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

  // --- Passenger Home ---
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
        // Add a sign out on passenger home just in case
        onSignOut={() => {
          setCurrentPage('passenger');
          setUserName('');
        }}
      />
    );
  }

  // --- Passenger Map View ---
  if (currentPage === 'map-view') {
    return (
      <MapView
        userName={userName}
        userLocation={userLocation}
        onBack={() => setCurrentPage('passenger-home')}
      />
    );
  }

  // --- Passenger Report Form ---
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

  // --- Passenger Review Report ---
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

  // --- Passenger Report Success ---
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

  // --- Officer Welcome ---
  if (currentPage === 'officer') {
    return (
      <OfficerWelcome 
        onBack={() => setCurrentPage('passenger')}
        onSignIn={(name, badge) => {
          setUserName(name);
          setBadgeNumber(badge);
          setCurrentPage('officer-home');
        }}
      />
    );
  }

  // --- Officer Home ---
  if (currentPage === 'officer-home') {
    return (
      <OfficerHome 
        userName={userName}
        badgeNumber={badgeNumber}
        onSignOut={() => {
          setCurrentPage('passenger');
          setUserName('');
          setBadgeNumber('');
        }}
      />
    );
  }

  // --- Manager Welcome ---
  if (currentPage === 'manager') {
    return (
      <ManagerWelcome 
        onBack={() => setCurrentPage('passenger')}
        onSignIn={(name, dept) => {
          setUserName(name);
          setDepartment(dept);
          setCurrentPage('manager-home');
        }}
      />
    );
  }

  // --- Manager Home ---
  if (currentPage === 'manager-home') {
    return (
      <ManagerHome 
        userName={userName}
        department={department}
        onSignOut={() => {
          setCurrentPage('passenger');
          setUserName('');
          setDepartment('');
        }}
      />
    );
  }
}

export default App;

