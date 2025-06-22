import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // use your main token name
    navigate('/login'); // go to main login page
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          backgroundColor: '#1f2937',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem 1rem',
        }}
      >
        <div>
          <h2 className="text-white mb-4">Admin Panel</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <NavItem to="/dashboard/home" label="🏠 Dashboard" />
            <NavItem to="/dashboard/contact-messages" label="📬 Contact Messages" />
            <NavItem to="/dashboard/bookings" label="📅 Tour Bookings" />
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            color: 'white',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#b91c1c')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#ef4444')}
        >
          🔒 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '2rem' }}>{children}</main>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) =>
        isActive ? activeLinkStyle : linkStyle
      }
    >
      {label}
    </NavLink>
  );
}

const linkStyle = {
  color: '#cbd5e1',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  backgroundColor: '#374151',
  transition: 'background 0.2s',
  fontWeight: '500',
};

const activeLinkStyle = {
  ...linkStyle,
  backgroundColor: '#2563eb',
  color: 'white',
  fontWeight: '700',
};
