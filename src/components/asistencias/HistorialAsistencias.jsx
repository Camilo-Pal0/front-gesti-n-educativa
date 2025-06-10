import { useState, useEffect } from 'react';
import { asistenciaService, grupoService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

const HistorialAsistencias = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciasFiltradas, setAsistenciasFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    busqueda: ''
  });
  const [estadisticas, setEstadisticas] = useState({
    totalPresentes: 0,
    totalAusentes: 0,
    totalTardanzas: 0,
    totalJustificados: 0
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarGrupos();
  }, []);

  useEffect(() => {
    if (grupoSeleccionado) {
      cargarHistorial();
    }
  }, [grupoSeleccionado]);

  useEffect(() => {
    aplicarFiltros();
  }, [asistencias, filtros]);

  const cargarGrupos = async () => {
    try {
      let data;
      if (user.tipoUsuario === 'PROFESOR') {
        data = await grupoService.obtenerPorProfesor(user.id);
      } else {
        data = await grupoService.obtenerActivos();
      }
      setGrupos(data);
      if (data.length > 0) {
        setGrupoSeleccionado(data[0].id.toString());
      }
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    }
  };

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const [historial, stats] = await Promise.all([
        asistenciaService.obtenerHistorial(grupoSeleccionado),
        asistenciaService.obtenerEstadisticas(grupoSeleccionado)
      ]);
      setAsistencias(historial);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...asistencias];

    // Filtro por fechas
    if (filtros.fechaInicio) {
      filtradas = filtradas.filter(a => a.fecha >= filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      filtradas = filtradas.filter(a => a.fecha <= filtros.fechaFin);
    }

    // Filtro por estado
    if (filtros.estado) {
      filtradas = filtradas.filter(a => a.estado === filtros.estado);
    }

    // Filtro por búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      filtradas = filtradas.filter(a => 
        a.estudianteNombre.toLowerCase().includes(busqueda) ||
        a.estudianteEmail.toLowerCase().includes(busqueda)
      );
    }

    setAsistenciasFiltradas(filtradas);
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      estado: '',
      busqueda: ''
    });
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'PRESENTE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'AUSENTE':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'TARDANZA':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'JUSTIFICADO':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PRESENTE':
        return 'bg-green-100 text-green-800';
      case 'AUSENTE':
        return 'bg-red-100 text-red-800';
      case 'TARDANZA':
        return 'bg-yellow-100 text-yellow-800';
      case 'JUSTIFICADO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Agrupar asistencias por fecha
  const asistenciasPorFecha = asistenciasFiltradas.reduce((acc, asistencia) => {
    const fecha = asistencia.fecha;
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(asistencia);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historial de Asistencias</h2>
          <p className="text-gray-600 mt-1">Consulta y gestiona el registro de asistencias</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
        </div>
      </div>

      {/* Selector de Grupo */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Grupo
        </label>
        <select
          value={grupoSeleccionado}
          onChange={(e) => setGrupoSeleccionado(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {grupos.map(grupo => (
            <option key={grupo.id} value={grupo.id}>
              {grupo.codigo} - {grupo.materia} ({grupo.nombreGrupo})
            </option>
          ))}
        </select>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Presentes</p>
              <p className="text-2xl font-bold text-green-700">{estadisticas.totalPresentes}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Ausentes</p>
              <p className="text-2xl font-bold text-red-700">{estadisticas.totalAusentes}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Tardanzas</p>
              <p className="text-2xl font-bold text-yellow-700">{estadisticas.totalTardanzas}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Justificados</p>
              <p className="text-2xl font-bold text-blue-700">{estadisticas.totalJustificados}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todos</option>
                  <option value="PRESENTE">Presente</option>
                  <option value="AUSENTE">Ausente</option>
                  <option value="TARDANZA">Tardanza</option>
                  <option value="JUSTIFICADO">Justificado</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={limpiarFiltros}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o email del estudiante..."
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Asistencias */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.keys(asistenciasPorFecha).length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay registros de asistencia</p>
            </div>
          ) : (
            Object.entries(asistenciasPorFecha)
              .sort(([fechaA], [fechaB]) => fechaB.localeCompare(fechaA))
              .map(([fecha, asistenciasDelDia]) => (
                <motion.div
                  key={fecha}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <h3 className="font-medium text-gray-900">
                          {new Date(fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                      </div>
                      <span className="text-sm text-gray-500">
                        {asistenciasDelDia.length} registros
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {asistenciasDelDia.map((asistencia, index) => (
                      <motion.div
                        key={asistencia.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {asistencia.estudianteNombre}
                              </p>
                              <p className="text-sm text-gray-500">
                                {asistencia.estudianteEmail}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getEstadoIcon(asistencia.estado)}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(asistencia.estado)}`}>
                                {asistencia.estado}
                              </span>
                            </div>
                            {asistencia.observaciones && (
                              <div className="group relative">
                                <AlertCircle className="w-5 h-5 text-gray-400 cursor-help" />
                                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                                  {asistencia.observaciones}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default HistorialAsistencias;