// ✅ App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './Components/Nav/Nav';
import Index from './Components/pege/Index';
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';
import Profile from './Components/Auth/Profile';
import EditProfile from './Components/Auth/EditProfile';
import ChangePassword from './Components/Auth/ChangePassword';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';
import AboutPage from './Components/pege/About';
import Tours from './Components/pege/Tours';
import Blog from './Components/pege/Blog';
import Contact from './Components/pege/Contact';
import Details from './Components/pege/Details';
import EditBooking from './Components/pege/EditBooking';
import VisaChecker from "./components/VisaChecker";
import WeatherForecast from "./components/WeatherForecast";

function AppContent() {
  const location = useLocation();
  const noNavRoutes = [
    '/register',
    '/login',
    '/profile',
    '/edit-profile',
    '/change-password',
    '/forgot-password',
    '/visa-checker',
    '/weather-forecast',
  ];

  const isResetPassword = location.pathname.startsWith('/reset-password/');
  const hideNav = noNavRoutes.includes(location.pathname) || isResetPassword || location.pathname.startsWith('/edit-booking/');

  return (
    <>
      {!hideNav && <Nav />} 
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tour/:id" element={<Details />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/edit-booking/:id" element={<EditBooking />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/tour" element={<Tours />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/visa-checker" element={<VisaChecker />} />
        <Route path="/weather-forecast" element={<WeatherForecast />} />
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
