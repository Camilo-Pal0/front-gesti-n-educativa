import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardProfesor from './components/DashboardProfesor';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';

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
      
      {/* Configuración global de Toast */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Duración por defecto
          duration: 4000,
          
          // Estilos por defecto
          style: {
            background: '#fff',
            color: '#363636',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          
          // Estilos específicos por tipo
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            style: {
              background: '#F0FDF4',
              color: '#166534',
              border: '1px solid #BBF7D0',
            },
          },
          
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FECACA',
            },
          },
          
          loading: {
            iconTheme: {
              primary: '#3B82F6',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;