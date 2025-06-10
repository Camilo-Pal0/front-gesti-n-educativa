import { useState, useEffect } from 'react';
import { grupoService, asistenciaService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Users, 
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

const MisGrupos = ({ onTomarAsistencia }) => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [asistenciasHoy, setAsistenciasHoy] = useState({});
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [vistaActiva, setVistaActiva] = useState('tarjetas'); // 'tarjetas' o 'lista'

  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoService.obtenerPorProfesor(user.id);
      setGrupos(data);
      
      // Verificar asistencias de hoy para cada grupo
      const fechaHoy = new Date().toISOString().split('T')[0];
      const asistencias = {};
      
      for (const grupo of data) {
        try {
          const verificacion = await asistenciaService.verificarAsistencia(grupo.id, fechaHoy);
          asistencias[grupo.id] = verificacion.yaRegistrada;
        } catch {
          asistencias[grupo.id] = false;
        }
      }
      
      setAsistenciasHoy(asistencias);
    } catch {
      console.error('Error al cargar grupos');
      setError('Error al cargar tus grupos');
    } finally {
      setLoading(false);
    }
  };

  const getDiaSemana = () => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[new Date().getDay()];
  };

  const handleTomarAsistencia = (grupo) => {
    if (onTomarAsistencia) {
      onTomarAsistencia(grupo);
    }
  };

  // Filtrar grupos
  const gruposFiltrados = grupos.filter(grupo => {
    const cumpleBusqueda = grupo.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          grupo.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
                          grupo.nombreGrupo.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleFiltro = filtroEstado === 'TODOS' ||
                        (filtroEstado === 'PENDIENTE' && !asistenciasHoy[grupo.id]) ||
                        (filtroEstado === 'COMPLETADO' && asistenciasHoy[grupo.id]);
    
    return cumpleBusqueda && cumpleFiltro;
  });

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Grupos</h2>
            <p className="text-gray-600 mt-1">
              {getDiaSemana()}, {new Date().toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{grupos.length}</div>
              <div className="text-sm text-gray-500">Total Grupos</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(asistenciasHoy).filter(Boolean).length}
              </div>
              <div className="text-sm text-gray-500">Completados Hoy</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {Object.values(asistenciasHoy).filter(v => !v).length}
              </div>
              <div className="text-sm text-gray-500">Pendientes</div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mt-6 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por código, materia o grupo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="TODOS">Todos</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="COMPLETADO">Completados</option>
              </select>
            </div>
            
            {/* Toggle vista */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVistaActiva('tarjetas')}
                className={`px-3 py-1 rounded ${vistaActiva === 'tarjetas' ? 'bg-white shadow-sm' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setVistaActiva('lista')}
                className={`px-3 py-1 rounded ${vistaActiva === 'lista' ? 'bg-white shadow-sm' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {gruposFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron grupos</p>
          <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : vistaActiva === 'tarjetas' ? (
        // Vista de tarjetas
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {gruposFiltrados.map((grupo) => (
            <motion.div
              key={grupo.id}
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Header de la tarjeta con gradiente */}
              <div className={`relative h-32 bg-gradient-to-r ${
                asistenciasHoy[grupo.id] 
                  ? 'from-green-400 to-green-600' 
                  : 'from-blue-400 to-blue-600'
              }`}>
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">{grupo.codigo}</h3>
                      <p className="text-white/90 mt-1">{grupo.nombreGrupo}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      asistenciasHoy[grupo.id] 
                        ? 'bg-white/30 text-white' 
                        : 'bg-white text-blue-600'
                    }`}>
                      {asistenciasHoy[grupo.id] ? (
                        <div className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completado
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pendiente
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 text-lg mb-4">{grupo.materia}</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{grupo.horario || 'Horario no definido'}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{grupo.aula || 'Aula no asignada'}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{grupo.estudiantesInscritos || 0} estudiantes inscritos</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Award className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{grupo.creditos} créditos</span>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{grupo.facultad}</span>
                    <span>Semestre {grupo.semestre}</span>
                  </div>
                </div>

                {/* Botón de acción */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTomarAsistencia(grupo)}
                  disabled={asistenciasHoy[grupo.id]}
                  className={`mt-6 w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                    asistenciasHoy[grupo.id]
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg'
                  }`}
                >
                  {asistenciasHoy[grupo.id] ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Asistencia Completada
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5 mr-2" />
                      Tomar Asistencia
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // Vista de lista
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aula
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {gruposFiltrados.map((grupo, index) => (
                    <motion.tr
                      key={grupo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{grupo.codigo}</div>
                          <div className="text-sm text-gray-500">{grupo.materia}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {grupo.horario || 'No definido'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {grupo.aula || 'No asignada'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          {grupo.estudiantesInscritos || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {asistenciasHoy[grupo.id] ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTomarAsistencia(grupo)}
                          disabled={asistenciasHoy[grupo.id]}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            asistenciasHoy[grupo.id]
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {asistenciasHoy[grupo.id] ? 'Completado' : 'Tomar Asistencia'}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisGrupos;