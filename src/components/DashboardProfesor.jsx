import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TomarAsistencia from './asistencias/TomarAsistencia';

const DashboardProfesor = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContenido = () => {
    switch (vistaActual) {
      case 'asistencia':
        return <TomarAsistencia onBack={() => setVistaActual('dashboard')} />;
      case 'dashboard':
      default:
        return (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjeta de Grupos */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Mis Grupos
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    --
                  </dd>
                </div>
              </div>

              {/* Tarjeta de Estudiantes */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Estudiantes
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    --
                  </dd>
                </div>
              </div>

              {/* Tarjeta de Asistencias */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Asistencias Pendientes
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    --
                  </dd>
                </div>
              </div>
            </div>

            {/* Sección de acciones rápidas */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => setVistaActual('asistencia')}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform cursor-pointer"
                >
                  Tomar Asistencia
                </button>
                <button className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform cursor-pointer">
                  Ver Mis Grupos
                </button>
                <button className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform cursor-pointer">
                  Historial de Asistencias
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold">Dashboard Profesor</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setVistaActual('dashboard')}
                className={`hidden sm:block px-3 py-2 rounded-md text-sm font-medium ${
                  vistaActual === 'dashboard' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-200 transition-all duration-300 ease-in-out transform cursor-pointer'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setVistaActual('asistencia')}
                className={`hidden sm:block px-3 py-2 rounded-md text-sm font-medium ${
                  vistaActual === 'asistencia' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-200 transition-all duration-300 ease-in-out transform cursor-pointer'
                }`}
              >
                Asistencia
              </button>
              <span className="hidden sm:inline text-gray-700 text-sm">Hola, {user?.nombreUsuario}</span>
              <button
                onClick={handleLogout}
                className="bg-[#ed247b] hover:bg-[#e0005d] text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-sm transition-all duration-300 ease-in-out transform cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {renderContenido()}
      </main>
    </div>
  );
};

export default DashboardProfesor;