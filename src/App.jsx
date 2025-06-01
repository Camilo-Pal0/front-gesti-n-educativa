import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardProfesor from './components/DashboardProfesor';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <DashboardAdmin />
            </PrivateRoute>
          } />
          
          <Route path="/profesor" element={
            <PrivateRoute allowedRoles={['PROFESOR']}>
              <DashboardProfesor />
            </PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600">No autorizado</h1>
                <p className="mt-2">No tienes permisos para acceder a esta página</p>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;