import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GestionUsuarios from './usuarios/GestionUsuarios';
import GestionGrupos from './grupos/GestionGrupos';
import Reportes from './reportes/Reportes';
import { estadisticaService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
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
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
                    <p className="text-gray-600 mt-2">Bienvenido de vuelta, {user?.nombreUsuario}</p>
                  </motion.div>

                  {/* Grid de Estadísticas con animación escalonada */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        titulo: "Total de Cursos",
                        valor: estadisticas.totalCursos,
                        subtitulo: "+2 este mes",
                        icono: BookOpen,
                        gradiente: "from-blue-500 to-blue-600",
                        delay: 0.1
                      },
                      {
                        titulo: "Total de Profesores",
                        valor: estadisticas.totalProfesores,
                        subtitulo: "Activos",
                        icono: Users,
                        gradiente: "from-emerald-500 to-emerald-600",
                        delay: 0.1
                      },
                      {
                        titulo: "Total de Estudiantes",
                        valor: estadisticas.totalEstudiantes,
                        subtitulo: "+12 nuevos",
                        icono: GraduationCap,
                        gradiente: "from-purple-500 to-purple-600",
                        delay: 0.1
                      },
                      {
                        titulo: "Asistencia Promedio",
                        valor: `${estadisticas.asistenciaPromedio.toFixed(1)}%`,
                        subtitulo: "↑ 2.3% vs mes anterior",
                        icono: TrendingUp,
                        gradiente: "from-amber-500 to-amber-600",
                        delay: 0.1
                      }
                    ].map((stat, index) => {
                      const IconoStat = stat.icono;
                      return (
                        <motion.div
                          key={stat.titulo}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: stat.delay }}
                          whileHover={{ scale: 1.05 }}
                          className={`bg-gradient-to-br ${stat.gradiente} rounded-2xl p-6 text-white shadow-xl`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/80 text-sm font-medium">{stat.titulo}</p>
                              <p className="text-3xl font-bold mt-2">{stat.valor}</p>
                              <p className="text-white/70 text-xs mt-2">{stat.subtitulo}</p>
                            </div>
                            <motion.div 
                              className="bg-white/20 rounded-full p-3"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <IconoStat className="w-8 h-8" />
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Acciones Rápidas */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          titulo: "Gestionar Usuarios",
                          subtitulo: "Agregar o editar usuarios",
                          icono: Users,
                          gradientClasses: "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
                          iconColor: "text-blue-600",
                          onClick: () => setVistaActual('usuarios')
                        },
                        {
                          titulo: "Gestionar Grupos",
                          subtitulo: "Administrar cursos",
                          icono: BookOpen,
                          gradientClasses: "bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200",
                          iconColor: "text-emerald-600",
                          onClick: () => setVistaActual('grupos')
                        },
                        {
                          titulo: "Ver Reportes",
                          subtitulo: "Análisis y estadísticas",
                          icono: BarChart3,
                          gradientClasses: "bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200",
                          iconColor: "text-purple-600",
                          onClick: () => setVistaActual('reportes')
                        },
                        {
                          titulo: "Configuración",
                          subtitulo: "Ajustes del sistema",
                          icono: Settings,
                          gradientClasses: "bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200",
                          iconColor: "text-amber-600",
                          onClick: () => {}
                        }
                      ].map((accion, index) => {
                        const IconoAccion = accion.icono;
                        return (
                          <motion.button
                            key={accion.titulo}
                            onClick={accion.onClick}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: 0 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`group relative overflow-hidden ${accion.gradientClasses} rounded-xl p-6 transition-all duration-300 cursor-pointer`}
                          >
                            <div className="relative z-10">
                              <IconoAccion className={`w-10 h-10 ${accion.iconColor} mb-3`} />
                              <p className="font-semibold text-gray-900">{accion.titulo}</p>
                              <p className="text-sm text-gray-600 mt-1">{accion.subtitulo}</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
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
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 lg:hidden bg-black"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.nav
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 flex flex-col w-64 bg-white shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Sistema Educativo</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="flex-1 py-4">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-lg">
        <div className="flex items-center p-6 border-b">
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
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-all ${
                vistaActual === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-700'
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
              <span className="text-gray-700">Hola, {user?.nombreUsuario}</span>
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

export default DashboardAdmin;