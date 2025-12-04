// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ImportExportDashboard from './pages/ImportExportDashboard';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main dashboard route */}
        <Route path="/" element={<ImportExportDashboard />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
