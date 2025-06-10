import { useState, useEffect } from 'react';
import { grupoService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search, 
  ArrowLeft,
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const GestionarEstudiantes = ({ grupo, onBack }) => {
  const [estudiantesInscritos, setEstudiantesInscritos] = useState([]);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchInscritos, setSearchInscritos] = useState('');
  const [searchDisponibles, setSearchDisponibles] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [grupo]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [inscritos, disponibles] = await Promise.all([
        grupoService.obtenerEstudiantesDelGrupo(grupo.id),
        grupoService.obtenerEstudiantesDisponibles(grupo.id)
      ]);
      setEstudiantesInscritos(inscritos);
      setEstudiantesDisponibles(disponibles);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      setError('Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleInscribir = async (estudianteId) => {
    try {
      setError('');
      setSuccess('');
      await grupoService.inscribirEstudiante(grupo.id, estudianteId);
      setSuccess('Estudiante inscrito correctamente');
      cargarDatos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al inscribir estudiante:', error);
      setError(error.response?.data?.mensaje || 'Error al inscribir estudiante');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDesinscribir = async (estudianteId) => {
    if (window.confirm('¿Está seguro de desinscribir este estudiante?')) {
      try {
        setError('');
        setSuccess('');
        await grupoService.desinscribirEstudiante(grupo.id, estudianteId);
        setSuccess('Estudiante desinscrito correctamente');
        cargarDatos();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error al desinscribir estudiante:', error);
        setError(error.response?.data?.mensaje || 'Error al desinscribir estudiante');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const estudiantesDisponiblesFiltrados = estudiantesDisponibles.filter(est =>
    est.nombreUsuario.toLowerCase().includes(searchDisponibles.toLowerCase()) ||
    est.email.toLowerCase().includes(searchDisponibles.toLowerCase())
  );

  const estudiantesInscritosFiltrados = estudiantesInscritos.filter(est =>
    est.nombreUsuario.toLowerCase().includes(searchInscritos.toLowerCase()) ||
    est.email.toLowerCase().includes(searchInscritos.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-7 h-7 mr-2 text-blue-600" />
                Gestionar Estudiantes
              </h2>
              <p className="text-gray-600 mt-1">
                {grupo.codigo} - {grupo.materia}
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl">
            <p className="text-sm opacity-90">Cupo</p>
            <p className="text-2xl font-bold">{estudiantesInscritos.length}/{grupo.cupoMaximo}</p>
          </div>
        </div>

        {/* Mensajes de alerta */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid de columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estudiantes Disponibles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
            <h3 className="text-lg font-semibold flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Estudiantes Disponibles ({estudiantesDisponiblesFiltrados.length})
            </h3>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchDisponibles}
                onChange={(e) => setSearchDisponibles(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/30 transition-colors"
              />
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {estudiantesDisponiblesFiltrados.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay estudiantes disponibles</p>
              </div>
            ) : (
              <div className="p-2">
                {estudiantesDisponiblesFiltrados.map((estudiante, index) => (
                  <motion.div
                    key={estudiante.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 m-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
                          {estudiante.nombreUsuario.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{estudiante.nombreUsuario}</p>
                          <p className="text-sm text-gray-500">{estudiante.email}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInscribir(estudiante.id)}
                        disabled={estudiantesInscritos.length >= grupo.cupoMaximo}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Inscribir
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Estudiantes Inscritos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <h3 className="text-lg font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Estudiantes Inscritos ({estudiantesInscritosFiltrados.length})
            </h3>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchInscritos}
                onChange={(e) => setSearchInscritos(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/30 transition-colors"
              />
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {estudiantesInscritosFiltrados.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay estudiantes inscritos</p>
              </div>
            ) : (
              <div className="p-2">
                {estudiantesInscritosFiltrados.map((estudiante, index) => (
                  <motion.div
                    key={estudiante.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 m-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {estudiante.nombreUsuario.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{estudiante.nombreUsuario}</p>
                          <p className="text-sm text-gray-500">{estudiante.email}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDesinscribir(estudiante.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
                      >
                        <UserMinus className="w-4 h-4 mr-1" />
                        Retirar
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Información del cupo */}
      {estudiantesInscritos.length >= grupo.cupoMaximo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl flex items-center"
        >
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="font-medium">Este grupo ha alcanzado su cupo máximo de {grupo.cupoMaximo} estudiantes</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GestionarEstudiantes;