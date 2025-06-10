import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TomarAsistencia from './asistencias/TomarAsistencia';
import MisGrupos from './grupos/MisGrupos';
import HistorialAsistencias from './asistencias/HistorialAsistencias';
import { estadisticaService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Calendar,
  TrendingUp,
  Menu,
  X,
  Home,
  ClipboardCheck,
  FolderOpen,
  Clock,
  LogOut
} from 'lucide-react';

const DashboardProfesor = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    misCursos: 0,
    totalEstudiantes: 0,
    clasesHoy: 0,
    asistenciaPromedio: 0
  });

  useEffect(() => {
    if (vistaActual === 'dashboard') {
      cargarEstadisticas();
    }
  }, [vistaActual]);

  const cargarEstadisticas = async () => {
    try {
      const data = await estadisticaService.obtenerEstadisticasProfesor();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTomarAsistencia = (grupo) => {
    setGrupoSeleccionado(grupo);
    setVistaActual('asistencia');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'grupos', label: 'Mis Grupos', icon: FolderOpen },
    { id: 'asistencia', label: 'Tomar Asistencia', icon: ClipboardCheck },
    { id: 'historial', label: 'Historial', icon: Clock },
  ];

  const renderContenido = () => {
    const pageVariants = {
      initial: { opacity: 0, x: -20 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: 20 }
    };

    const pageTransition = {
      type: "tween",
      ease: "anticipate",
      duration: 0.4
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={vistaActual}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {(() => {
            switch (vistaActual) {
              case 'asistencia':
                return <TomarAsistencia onBack={() => setVistaActual('grupos')} grupoPreseleccionado={grupoSeleccionado} />;
              case 'grupos':
                return <MisGrupos onTomarAsistencia={handleTomarAsistencia} />;
              case 'historial':
                return <HistorialAsistencias />;
              case 'dashboard':
              default:
                return (
                  <div className="space-y-6">
                    {/* Header del Dashboard */}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
                      <p className="text-gray-600 mt-2">Bienvenido, Profesor {user?.nombreUsuario}</p>
                    </div>

                    {/* Grid de Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Mis Cursos */}
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-indigo-100 text-sm font-medium">Mis Cursos</p>
                            <p className="text-3xl font-bold mt-2">{estadisticas.misCursos}</p>
                            <p className="text-indigo-100 text-xs mt-2">Activos este periodo</p>
                          </div>
                          <div className="bg-white/20 rounded-full p-3">
                            <BookOpen className="w-8 h-8" />
                          </div>
                        </div>
                      </div>

                      {/* Total Estudiantes */}
                      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-teal-100 text-sm font-medium">Total Estudiantes</p>
                            <p className="text-3xl font-bold mt-2">{estadisticas.totalEstudiantes}</p>
                            <p className="text-teal-100 text-xs mt-2">En todos mis cursos</p>
                          </div>
                          <div className="bg-white/20 rounded-full p-3">
                            <Users className="w-8 h-8" />
                          </div>
                        </div>
                      </div>

                      {/* Clases del Día */}
                      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-rose-100 text-sm font-medium">Clases del Día</p>
                            <p className="text-3xl font-bold mt-2">{estadisticas.clasesHoy}</p>
                            <p className="text-rose-100 text-xs mt-2">Por impartir hoy</p>
                          </div>
                          <div className="bg-white/20 rounded-full p-3">
                            <Calendar className="w-8 h-8" />
                          </div>
                        </div>
                      </div>

                      {/* Asistencia Promedio */}
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm font-medium">Asistencia Promedio</p>
                            <p className="text-3xl font-bold mt-2">{estadisticas.asistenciaPromedio.toFixed(1)}%</p>
                            <p className="text-green-100 text-xs mt-2">En mis clases</p>
                          </div>
                          <div className="bg-white/20 rounded-full p-3">
                            <TrendingUp className="w-8 h-8" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clases de Hoy */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Mis Clases de Hoy</h2>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">MAT101 - Cálculo Diferencial</h3>
                              <p className="text-sm text-gray-600 mt-1">14:00 - 16:00 | Aula 301</p>
                            </div>
                            <button 
                              onClick={() => setVistaActual('asistencia')}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              Tomar Asistencia
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-center text-gray-500 py-8">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No hay más clases programadas para hoy</p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button 
                          onClick={() => setVistaActual('asistencia')}
                          className="group relative overflow-hidden bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-xl p-6 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        >
                          <div className="relative z-10">
                            <ClipboardCheck className="w-10 h-10 text-indigo-600 mb-3" />
                            <p className="font-semibold text-gray-900">Tomar Asistencia</p>
                            <p className="text-sm text-gray-600 mt-1">Registrar asistencia del día</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => setVistaActual('grupos')}
                          className="group relative overflow-hidden bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 rounded-xl p-6 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        >
                          <div className="relative z-10">
                            <FolderOpen className="w-10 h-10 text-teal-600 mb-3" />
                            <p className="font-semibold text-gray-900">Ver Mis Grupos</p>
                            <p className="text-sm text-gray-600 mt-1">Todos mis cursos asignados</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => setVistaActual('historial')}
                          className="group relative overflow-hidden bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 rounded-xl p-6 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        >
                          <div className="relative z-10">
                            <Clock className="w-10 h-10 text-rose-600 mb-3" />
                            <p className="font-semibold text-gray-900">Historial de Asistencias</p>
                            <p className="text-sm text-gray-600 mt-1">Ver registros anteriores</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                );
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Móvil */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Portal Profesor</h2>
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
                  vistaActual === item.id ? 'bg-indigo-50 border-r-4 border-indigo-500 text-indigo-600' : 'text-gray-700'
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
        <div className="flex items-center p-6 border-b">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-teal-600 flex items-center justify-center text-white font-bold">
            {user?.nombreUsuario?.charAt(0).toUpperCase()}
          </div>
          <h2 className="ml-3 text-xl font-bold text-gray-800">Portal Profesor</h2>
        </div>
        
        <div className="flex-1 py-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setVistaActual(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-all ${
                vistaActual === item.id ? 'bg-indigo-50 border-r-4 border-indigo-500 text-indigo-600' : 'text-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <span className="text-gray-700">Profesor {user?.nombreUsuario}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-teal-600 flex items-center justify-center text-white font-bold">
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

export default DashboardProfesor;