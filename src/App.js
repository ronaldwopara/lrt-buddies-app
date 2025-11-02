import React, { useState } from 'react';
import PassengerWelcome from './PassengerWelcome';
import PassengerHome from './PassengerHome';
import OfficerWelcome from './OfficerWelcome';
import ManagerWelcome from './ManagerWelcome';

function App() {
  // This keeps track of which page to show
  const [currentPage, setCurrentPage] = useState('passenger');
  const [userName, setUserName] = useState('');

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
