import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard Administrador</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user?.nombreUsuario}</span>
              <button
                onClick={handleLogout}
                className="bg-[#ed247b] hover:bg-[#e0005d] text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
              <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform cursor-pointer">
                Agregar Usuario
              </button>
              <button className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform cursor-pointer">
                Crear Grupo
              </button>
              <button className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform cursor-pointer">
                Ver Reportes
              </button>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform cursor-pointer">
                Configuración
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;