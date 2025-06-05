// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './Components/Nav/Nav';
import Index from './Components/pege/index';
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';
import Profile from './Components/Auth/Profile';
import EditProfile from './Components/Auth/EditProfile';
import ChangePassword from './Components/Auth/ChangePassword';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';

function AppContent() {
  const location = useLocation();

  // Routes where Nav should be hidden
  const noNavRoutes = [
    '/register',
    '/login',
    '/profile',
    '/edit-profile',
    '/change-password',
    '/forgot-password',
  ];

  // Handle reset-password with dynamic params
  const isResetPassword = location.pathname.startsWith('/reset-password/');

  const hideNav = noNavRoutes.includes(location.pathname) || isResetPassword;

  return (
    <>
      {!hideNav && <Nav />} {/* Show Nav only if not in excluded routes */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
