
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import AgendaPage from './pages/AgendaPage';
import PatientsPage from './pages/PatientsPage';
import PosPage from './pages/PosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<AgendaPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="pos" element={<PosPage />} />
          <Route path="finances" element={<PosPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
