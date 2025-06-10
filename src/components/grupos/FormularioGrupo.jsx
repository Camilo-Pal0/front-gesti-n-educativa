import { useState, useEffect } from 'react';
import { grupoService, usuarioService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Building,
  Hash,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  User
} from 'lucide-react';

const FormularioGrupo = ({ grupo, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreGrupo: '',
    codigo: '',
    materia: '',
    facultad: '',
    semestre: 1,
    anoEscolar: new Date().getFullYear(),
    periodo: `${new Date().getFullYear()}-1`,
    horario: '',
    aula: '',
    creditos: 3,
    cupoMaximo: 30,
    profesoresIds: []
  });
  const [profesores, setProfesores] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProfesores, setLoadingProfesores] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    cargarProfesores();
    if (grupo) {
      setFormData({
        ...grupo,
        profesoresIds: grupo.profesores ? grupo.profesores.map(p => p.id) : []
      });
    }
  }, [grupo]);

  const cargarProfesores = async () => {
    try {
      setLoadingProfesores(true);
      const usuarios = await usuarioService.obtenerTodos();
      const profesoresFiltrados = usuarios.filter(u => u.tipoUsuario === 'PROFESOR' && u.activo);
      setProfesores(profesoresFiltrados);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    } finally {
      setLoadingProfesores(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfesorChange = (profesorId) => {
    setFormData(prev => ({
      ...prev,
      profesoresIds: prev.profesoresIds.includes(profesorId)
        ? prev.profesoresIds.filter(id => id !== profesorId)
        : [...prev.profesoresIds, profesorId]
    }));
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.codigo) newErrors.codigo = 'El código es requerido';
    if (!formData.nombreGrupo) newErrors.nombreGrupo = 'El nombre del grupo es requerido';
    if (!formData.materia) newErrors.materia = 'La materia es requerida';
    if (!formData.semestre || formData.semestre < 1) newErrors.semestre = 'El semestre debe ser mayor a 0';
    if (!formData.periodo) newErrors.periodo = 'El periodo es requerido';
    if (!formData.cupoMaximo || formData.cupoMaximo < 1) newErrors.cupoMaximo = 'El cupo debe ser mayor a 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      if (grupo) {
        await grupoService.actualizar(grupo.id, formData);
      } else {
        await grupoService.crear(formData);
      }
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar grupo:', error);
      if (error.response?.data?.mensaje) {
        setErrors({ general: error.response.data.mensaje });
      } else {
        setErrors({ general: 'Error al guardar el grupo' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#bf0050] to-[#e82b7b] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {grupo ? 'Editar Grupo' : 'Nuevo Grupo'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Mensajes de error/éxito */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start"
            >
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-700">Grupo guardado exitosamente</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Campos del formulario */}
        <div className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código del Curso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código del Curso
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.codigo 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#e82c7a]'
                  }`}
                  placeholder="Ej: MAT101"
                />
              </div>
              {errors.codigo && (
                <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
              )}
            </div>

            {/* Nombre del Grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Grupo
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nombreGrupo"
                  value={formData.nombreGrupo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.nombreGrupo 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#e82c7a]'
                  }`}
                  placeholder="Ej: Grupo A"
                />
              </div>
              {errors.nombreGrupo && (
                <p className="mt-1 text-sm text-red-600">{errors.nombreGrupo}</p>
              )}
            </div>

            {/* Materia */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Materia
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="materia"
                  value={formData.materia}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.materia 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#e82c7a]'
                  }`}
                  placeholder="Ej: Cálculo Diferencial"
                />
              </div>
              {errors.materia && (
                <p className="mt-1 text-sm text-red-600">{errors.materia}</p>
              )}
            </div>

            {/* Facultad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facultad/Departamento
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="facultad"
                  value={formData.facultad}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e82c7a] transition-all"
                  placeholder="Ej: Ingeniería"
                />
              </div>
            </div>

            {/* Semestre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semestre
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.semestre 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#e82c7a]'
                  }`}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sem => (
                    <option key={sem} value={sem}>Semestre {sem}</option>
                  ))}
                </select>
              </div>
              {errors.semestre && (
                <p className="mt-1 text-sm text-red-600">{errors.semestre}</p>
              )}
            </div>

            {/* Periodo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periodo Académico
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="periodo"
                  value={formData.periodo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.periodo 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#e82c7a]'
                  }`}
                  placeholder="Ej: 2024-1"
                />
              </div>
              {errors.periodo && (
                <p className="mt-1 text-sm text-red-600">{errors.periodo}</p>
              )}
            </div>

            {/* Créditos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Créditos
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="creditos"
                  value={formData.creditos}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e82c7a] transition-all"
                />
              </div>
            </div>

            {/* Cupo Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cupo Máximo
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="cupoMaximo"
                  value={formData.cupoMaximo}
                  onChange={handleChange}
                  min="1"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.cupoMaximo 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#e82c7a]'
                  }`}
                />
              </div>
              {errors.cupoMaximo && (
                <p className="mt-1 text-sm text-red-600">{errors.cupoMaximo}</p>
              )}
            </div>

            {/* Horario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e82c7a] transition-all"
                  placeholder="Ej: LUN-MIE 14:00-16:00"
                />
              </div>
            </div>

            {/* Aula */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aula/Salón
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="aula"
                  value={formData.aula}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e82c7a] transition-all"
                  placeholder="Ej: Edificio A - 301"
                />
              </div>
            </div>
          </div>

          {/* Sección de Profesores */}
          <div className="pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profesor(es) Asignado(s)
            </label>
            
            {loadingProfesores ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50">
                {profesores.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay profesores disponibles</p>
                ) : (
                  profesores.map((profesor) => (
                    <motion.label
                      key={profesor.id}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.profesoresIds.includes(profesor.id)}
                        onChange={() => handleProfesorChange(profesor.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-[#e82c7a]"
                      />
                      <div className="ml-3 flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{profesor.nombreUsuario}</p>
                          <p className="text-xs text-gray-500">{profesor.especialidad || 'Sin especialidad'}</p>
                        </div>
                      </div>
                      {profesor.email && (
                        <span className="text-xs text-gray-400 ml-auto">{profesor.email}</span>
                      )}
                    </motion.label>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center cursor-pointer"
          >
            <X className="w-5 h-5 mr-2" />
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gradient-to-r from-[#e82b7b] to-[#bf0050] text-white rounded-lg hover:from-[#bf0050] hover:to-[#e82b7b] transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
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
                {grupo ? 'Actualizar' : 'Crear'} Grupo
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormularioGrupo;