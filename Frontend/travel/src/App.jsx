1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
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

function AppContent() {
  const location = useLocation();
  const noNavRoutes = [
    '/register',
    '/login',
    '/profile',
    '/edit-profile',
    '/change-password',
    '/forgot-password'
  ];

  const isResetPassword = location.pathname.startsWith('/reset-password/');
  const hideNav = noNavRoutes.includes(location.pathname) || isResetPassword;

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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/tour" element={<Tours />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
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
