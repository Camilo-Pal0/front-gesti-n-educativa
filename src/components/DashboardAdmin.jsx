import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GestionUsuarios from './usuarios/GestionUsuarios';

const DashboardAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContenido = () => {
    switch (vistaActual) {
      case 'usuarios':
        return <GestionUsuarios />;
      case 'dashboard':
      default:
        return (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjeta de Usuarios */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Usuarios
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    --
                  </dd>
                </div>
              </div>

              {/* Tarjeta de Grupos */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Grupos
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
                    Asistencias Hoy
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setVistaActual('usuarios')}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Gestionar Usuarios
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Crear Grupo
                </button>
                <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                  Ver Reportes
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                  Configuración
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
              <h1 className="text-lg sm:text-xl font-semibold">Dashboard Administrador</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setVistaActual('dashboard')}
                className={`hidden sm:block px-3 py-2 rounded-md text-sm font-medium ${
                  vistaActual === 'dashboard' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setVistaActual('usuarios')}
                className={`hidden sm:block px-3 py-2 rounded-md text-sm font-medium ${
                  vistaActual === 'usuarios' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Usuarios
              </button>
              <span className="hidden sm:inline text-gray-700 text-sm">Hola, {user?.nombreUsuario}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-sm"
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

export default DashboardAdmin;