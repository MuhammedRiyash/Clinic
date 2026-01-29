import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Doctors from './pages/Doctors/Doctors';
import Patients from './pages/Patients/Patients';
import Appointments from './pages/Appointments/Appointments';
import Inventory from './pages/Inventory/Inventory';
import Insurance from './pages/Insurance/Insurance';
import Services from './pages/Services/Services';
import Telemedicine from './pages/Telemedicine/Telemedicine';
import Chats from './pages/Chats/Chats';
import Billing from './pages/Billing/Billing';
import Users from './pages/Users/Users';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/telemedicine" element={<Telemedicine />} />
                  <Route path="/chats" element={<Chats />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/medical-services" element={<Services category="Medical" />} />
                  <Route path="/dental-services" element={<Services category="Dental" />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="*" element={<div style={{ padding: '20px' }}>This module is active - View under maintenance</div>} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
