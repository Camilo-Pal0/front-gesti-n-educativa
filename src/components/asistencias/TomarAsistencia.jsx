import { useState, useEffect } from 'react';
import { asistenciaService, grupoService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  Users,
  Search,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardCheck,
  ArrowLeft,
  BookOpen,
  MapPin,
  User,
  Mail,
  CheckSquare,
  XSquare,
  MinusSquare,
  FileText
} from 'lucide-react';

const TomarAsistencia = ({ onBack, grupoPreseleccionado }) => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(grupoPreseleccionado?.id?.toString() || '');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [yaRegistrada, setYaRegistrada] = useState(false);
  const [success, setSuccess] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarGrupos();
  }, []);

  useEffect(() => {
    if (grupoSeleccionado && fecha) {
      verificarYCargarAsistencia();
    }
  }, [grupoSeleccionado, fecha]);

  const cargarGrupos = async () => {
    try {
      let data;
      if (user.tipoUsuario === 'PROFESOR') {
        data = await grupoService.obtenerPorProfesor(user.id);
      } else {
        data = await grupoService.obtenerActivos();
      }
      setGrupos(data);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      setError('Error al cargar los grupos');
    }
  };

  const verificarYCargarAsistencia = async () => {
    try {
      setLoading(true);
      setError('');
      
      const verificacion = await asistenciaService.verificarAsistencia(grupoSeleccionado, fecha);
      setYaRegistrada(verificacion.yaRegistrada);
      
      const lista = await asistenciaService.obtenerListaAsistencia(grupoSeleccionado, fecha);
      setEstudiantes(lista);
    } catch (error) {
      console.error('Error al cargar asistencia:', error);
      setError('Error al cargar la lista de estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = (estudianteId, nuevoEstado) => {
    setEstudiantes(prev => prev.map(est => 
      est.estudianteId === estudianteId 
        ? { ...est, estado: nuevoEstado }
        : est
    ));
  };

  const handleObservacionChange = (estudianteId, observacion) => {
    setEstudiantes(prev => prev.map(est => 
      est.estudianteId === estudianteId 
        ? { ...est, observaciones: observacion }
        : est
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!grupoSeleccionado) {
      setError('Debe seleccionar un grupo');
      return;
    }

    setGuardando(true);
    setError('');
    setSuccess('');

    try {
      const datos = {
        grupoId: parseInt(grupoSeleccionado),
        fecha: fecha,
        asistencias: estudiantes.map(est => ({
          estudianteId: est.estudianteId,
          estado: est.estado,
          observaciones: est.observaciones || ''
        }))
      };

      await asistenciaService.tomarAsistencia(datos);
      setSuccess('Asistencia registrada correctamente');
      setYaRegistrada(true);
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
      setError(error.response?.data?.mensaje || 'Error al guardar la asistencia');
    } finally {
      setGuardando(false);
    }
  };

  // Filtrar estudiantes por búsqueda
  const estudiantesFiltrados = estudiantes.filter(est =>
    est.estudianteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    est.estudianteEmail.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Estadísticas rápidas
  const estadisticas = {
    presente: estudiantes.filter(e => e.estado === 'PRESENTE').length,
    ausente: estudiantes.filter(e => e.estado === 'AUSENTE').length,
    tardanza: estudiantes.filter(e => e.estado === 'TARDANZA').length,
    justificado: estudiantes.filter(e => e.estado === 'JUSTIFICADO').length,
    total: estudiantes.length
  };

  const estadoConfig = {
    PRESENTE: { 
      color: 'green', 
      icon: CheckCircle, 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      hoverBg: 'hover:bg-green-100'
    },
    AUSENTE: { 
      color: 'red', 
      icon: XCircle, 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      hoverBg: 'hover:bg-red-100'
    },
    TARDANZA: { 
      color: 'amber', 
      icon: Clock, 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      hoverBg: 'hover:bg-amber-100'
    },
    JUSTIFICADO: { 
      color: 'blue', 
      icon: FileText, 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      hoverBg: 'hover:bg-blue-100'
    }
  };

  const grupoInfo = grupos.find(g => g.id === parseInt(grupoSeleccionado));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </motion.button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tomar Asistencia</h2>
              <p className="text-gray-600">Registra la asistencia de tus estudiantes</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Selección de grupo y fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Grupo
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={grupoSeleccionado}
                onChange={(e) => setGrupoSeleccionado(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">-- Seleccione un grupo --</option>
                {grupos.map(grupo => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.codigo} - {grupo.materia} ({grupo.nombreGrupo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Información del grupo */}
        {grupoInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{grupoInfo.horario || 'Sin horario'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{grupoInfo.aula || 'Sin aula'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{grupoInfo.estudiantesInscritos} estudiantes inscritos</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mensajes */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </motion.div>
        )}

        {yaRegistrada && !success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            Ya se ha registrado asistencia para este grupo en la fecha seleccionada.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de estudiantes */}
      {grupoSeleccionado && estudiantes.length > 0 && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header con estadísticas */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-gray-600" />
                  Lista de Estudiantes
                </h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Presente: {estadisticas.presente}
                  </span>
                  <span className="flex items-center text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    Ausente: {estadisticas.ausente}
                  </span>
                  <span className="flex items-center text-amber-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Tardanza: {estadisticas.tardanza}
                  </span>
                  <span className="flex items-center text-blue-600">
                    <FileText className="w-4 h-4 mr-1" />
                    Justificado: {estadisticas.justificado}
                  </span>
                </div>
              </div>
              
              {/* Barra de búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tabla de asistencia */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Estudiante</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center space-x-1">
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Estado de Asistencia</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>Observaciones</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {estudiantesFiltrados.map((estudiante, index) => (
                    <motion.tr
                      key={estudiante.estudianteId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                              {estudiante.estudianteNombre.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {estudiante.estudianteNombre}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {estudiante.estudianteEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          {Object.entries(estadoConfig).map(([estado, config]) => {
                            const Icono = config.icon;
                            const isSelected = estudiante.estado === estado;
                            
                            return (
                              <motion.button
                                key={estado}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEstadoChange(estudiante.estudianteId, estado)}
                                className={`
                                  relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                                  ${isSelected 
                                    ? `${config.bgColor} ${config.borderColor} ${config.textColor} border-2 shadow-md` 
                                    : `bg-gray-100 text-gray-500 hover:bg-gray-200 border-2 border-transparent`
                                  }
                                `}
                              >
                                <div className="flex items-center space-x-2">
                                  <Icono className="w-4 h-4" />
                                  <span>{estado}</span>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    layoutId={`indicator-${estudiante.estudianteId}`}
                                    className="absolute inset-0 border-2 border-current rounded-lg"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={estudiante.observaciones || ''}
                          onChange={(e) => handleObservacionChange(estudiante.estudianteId, e.target.value)}
                          placeholder="Agregar observación..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer con botón de guardar */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {estadisticas.total} estudiantes en total
              </div>
              <motion.button
                type="submit"
                disabled={guardando || yaRegistrada}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg
                  ${guardando || yaRegistrada
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                  }
                `}
              >
                {guardando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Asistencia
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Mensaje cuando no hay estudiantes */}
      {grupoSeleccionado && estudiantes.length === 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-500">No hay estudiantes inscritos en este grupo</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TomarAsistencia;