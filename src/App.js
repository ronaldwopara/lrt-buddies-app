import React, { useState } from 'react';
import PassengerWelcome from './PassengerWelcome';
import PassengerHome from './PassengerHome';
import OfficerWelcome from './OfficerWelcome';
import OfficerHome from './OfficerHome'; // Import OfficerHome
import ManagerWelcome from './ManagerWelcome';
import ManagerHome from './ManagerHome'; // Import ManagerHome

function App() {
  // This keeps track of which page to show
  const [currentPage, setCurrentPage] = useState('passenger');
  const [userName, setUserName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [department, setDepartment] = useState('');

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
      />
    );
  }

  // Show officer page when they click "Are You an Officer?"
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

  // Show officer home page after sign in
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

  // Show manager page when they click "Are You a Manager?"
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

  // Show manager home page after sign in
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
