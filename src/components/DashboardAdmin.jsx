import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GestionUsuarios from './usuarios/GestionUsuarios';
import GestionGrupos from './grupos/GestionGrupos';
import Reportes from './reportes/Reportes';
import { estadisticaService } from '../services/api';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

const DashboardAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    totalCursos: 0,
    totalProfesores: 0,
    totalEstudiantes: 0,
    asistenciaPromedio: 0
  });

  useEffect(() => {
    if (vistaActual === 'dashboard') {
      cargarEstadisticas();
    }
  }, [vistaActual]);

  const cargarEstadisticas = async () => {
    try {
      const data = await estadisticaService.obtenerEstadisticasAdmin();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'grupos', label: 'Grupos', icon: BookOpen },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  ];

  const renderContenido = () => {
    switch (vistaActual) {
      case 'usuarios':
        return <GestionUsuarios />;
      case 'grupos':
        return <GestionGrupos />;
      case 'reportes':
        return <Reportes />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Header del Dashboard */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600 mt-2">Bienvenido de vuelta, {user?.nombreUsuario}</p>
            </div>

            {/* Grid de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total de Cursos */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total de Cursos</p>
                    <p className="text-3xl font-bold mt-2">{estadisticas.totalCursos}</p>
                    <p className="text-blue-100 text-xs mt-2">+2 este mes</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <BookOpen className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Total de Profesores */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total de Profesores</p>
                    <p className="text-3xl font-bold mt-2">{estadisticas.totalProfesores}</p>
                    <p className="text-emerald-100 text-xs mt-2">Activos</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <Users className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Total de Estudiantes */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total de Estudiantes</p>
                    <p className="text-3xl font-bold mt-2">{estadisticas.totalEstudiantes}</p>
                    <p className="text-purple-100 text-xs mt-2">+12 nuevos</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Asistencia Promedio */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Asistencia Promedio</p>
                    <p className="text-3xl font-bold mt-2">{estadisticas.asistenciaPromedio.toFixed(1)}%</p>
                    <p className="text-amber-100 text-xs mt-2">↑ 2.3% vs mes anterior</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setVistaActual('usuarios')}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  <div className="relative z-10">
                    <Users className="w-10 h-10 text-blue-600 mb-3" />
                    <p className="font-semibold text-gray-900">Gestionar Usuarios</p>
                    <p className="text-sm text-gray-600 mt-1">Agregar o editar usuarios</p>
                  </div>
                </button>

                <button 
                  onClick={() => setVistaActual('grupos')}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl p-6 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  <div className="relative z-10">
                    <BookOpen className="w-10 h-10 text-emerald-600 mb-3" />
                    <p className="font-semibold text-gray-900">Gestionar Grupos</p>
                    <p className="text-sm text-gray-600 mt-1">Administrar cursos</p>
                  </div>
                </button>

                <button 
                  onClick={() => setVistaActual('reportes')}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-6 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  <div className="relative z-10">
                    <BarChart3 className="w-10 h-10 text-purple-600 mb-3" />
                    <p className="font-semibold text-gray-900">Ver Reportes</p>
                    <p className="text-sm text-gray-600 mt-1">Análisis y estadísticas</p>
                  </div>
                </button>

                <button 
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-xl p-6 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  <div className="relative z-10">
                    <Settings className="w-10 h-10 text-amber-600 mb-3" />
                    <p className="font-semibold text-gray-900">Configuración</p>
                    <p className="text-sm text-gray-600 mt-1">Ajustes del sistema</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Móvil */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold text-gray-800">Sistema Educativo</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 py-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setVistaActual(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                  vistaActual === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Sidebar Desktop */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-lg">
        <div className="flex items-center p-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            SE
          </div>
          <h2 className="ml-3 text-xl font-bold text-gray-800">Sistema Educativo</h2>
        </div>
        
        <div className="flex-1 py-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setVistaActual(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-all cursor-pointer ${
                vistaActual === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-end px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user?.nombreUsuario}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.nombreUsuario?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-6">
          {renderContenido()}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;