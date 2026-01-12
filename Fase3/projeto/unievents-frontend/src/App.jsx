import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import EventFeed from './pages/EventFeed';
import EventDetails from './pages/EventDetails';
import Login from './pages/login';
import Register from './pages/Register';
import CreateEvent from './pages/Organizer';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

// Protected Route Component
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <LanguageProvider>
      <div className="app-container">

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={
              <PrivateRoute>
                <EventFeed />
              </PrivateRoute>
            } />

            <Route path="/evento/:id" element={
              <PrivateRoute>
                <EventDetails />
              </PrivateRoute>
            } />

            <Route path="/create" element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            } />
            <Route path="/edit/:id" element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            } />

            <Route path="/admin" element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
