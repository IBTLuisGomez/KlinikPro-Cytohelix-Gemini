import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import AgendaPage from './pages/AgendaPage';
import PatientsPage from './pages/PatientsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AgendaPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="finances" element={<div className="p-8 text-center text-slate-500">Módulo Financiero (En desarrollo)</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
