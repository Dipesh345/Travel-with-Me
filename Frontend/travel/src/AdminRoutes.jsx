import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from "./components/admin/DashboardLayout";
import DashboardHome from './components/admin/Home';
import ContactMessages from './components/admin/ContactMessages';
import BookingList from './components/admin/Bookings';

export default function AdminRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/dashboard/home" element={<DashboardHome />} />
        <Route path="/dashboard/contact-messages" element={<ContactMessages />} />
        <Route path="/dashboard/bookings" element={<BookingList />} />
      </Routes>
    </DashboardLayout>
  );
}
