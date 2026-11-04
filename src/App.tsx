import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import HostDashboard from './pages/host/HostDashboard';
import CreateListing from './pages/host/CreateListing';
import SearchPage from './pages/renter/Search';
import Results from './pages/renter/Results';
import Checkout from './pages/renter/Checkout';
import Success from './pages/renter/Success';
import SavedGuests from './pages/renter/SavedGuests';

function AppRouter() {
  const { currentView } = useApp();

  switch (currentView) {
    case 'landing':
      return <Landing />;
    case 'login':
      return <Login />;
    case 'host-dashboard':
      return <HostDashboard />;
    case 'create-listing':
      return <CreateListing />;
    case 'search':
      return <SearchPage />;
    case 'results':
      return <Results />;
    case 'checkout':
      return <Checkout />;
    case 'success':
      return <Success />;
    case 'saved-guests':
      return <SavedGuests />;
    default:
      return <Landing />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
