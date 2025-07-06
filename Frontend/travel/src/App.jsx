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
import PaymentPage from './Components/pege/PaymentPage';
import Blog from './Components/pege/Blog';
import BlogDetail from './Components/pege/BlogDetail';
import Contact from './Components/pege/Contact';
import Details from './Components/pege/Details';
import EditBooking from './Components/pege/EditBooking';
import AdminRoutes from './AdminRoutes';

function AppContent() {
  const location = useLocation();
  const noNavRoutes = [
    '/register',
    '/login',
    '/edit-profile',
    '/change-password',
    '/forgot-password',
  ];

  const isResetPassword = location.pathname.startsWith('/reset-password/');
  const isAdminRoute = location.pathname.startsWith('/dashboard');
  const isBlogDetail = location.pathname.startsWith('/blog/');
  const hideNav = noNavRoutes.includes(location.pathname) || isResetPassword || location.pathname.startsWith('/edit-booking/') || isAdminRoute || isBlogDetail;

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
        <Route path="/booking/:id/payment" element={<PaymentPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {isAdminRoute && <AdminRoutes />}
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
