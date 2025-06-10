import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Calendar,
  MapPin,
  Briefcase,
  Shield,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const FormularioUsuario = ({ usuario, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    contrasena: '',
    email: '',
    telefonoMovil: '',
    tipoUsuario: 'ESTUDIANTE',
    direccion: '',
    fechaNacimiento: '',
    especialidad: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        ...usuario,
        contrasena: '',
        fechaNacimiento: usuario.fechaNacimiento || ''
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando se modifica
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!usuario && !formData.nombreUsuario) {
      newErrors.nombreUsuario = 'El nombre de usuario es requerido';
    }
    
    if (!usuario && !formData.contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (!usuario && formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.tipoUsuario) {
      newErrors.tipoUsuario = 'El tipo de usuario es requerido';
    }

    if (formData.telefonoMovil && !/^\d{10}$/.test(formData.telefonoMovil.replace(/\D/g, ''))) {
      newErrors.telefonoMovil = 'El teléfono debe tener 10 dígitos';
    }

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
      if (usuario) {
        const { nombreUsuario, contrasena, ...datosActualizar } = formData;
        await usuarioService.actualizar(usuario.id, datosActualizar);
      } else {
        await usuarioService.crear(formData);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      if (error.response?.data?.mensaje) {
        setErrors({ general: error.response.data.mensaje });
      } else {
        setErrors({ general: 'Error al guardar el usuario' });
      }
    } finally {
      setLoading(false);
    }
  };

  const tipoUsuarioOptions = [
    { value: 'ESTUDIANTE', label: 'Estudiante', icon: User, color: 'green' },
    { value: 'PROFESOR', label: 'Profesor', icon: Briefcase, color: 'blue' },
    { value: 'ADMIN', label: 'Administrador', icon: Shield, color: 'purple' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors"
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
              <p className="text-sm text-green-700">Usuario guardado exitosamente</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Campos del formulario */}
        <div className="space-y-6">
          {/* Tipo de Usuario - Cards seleccionables */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Usuario
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tipoUsuarioOptions.map((tipo) => {
                const IconTipo = tipo.icon;
                const isSelected = formData.tipoUsuario === tipo.value;
                
                return (
                  <motion.label
                    key={tipo.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? `border-${tipo.color}-500 bg-${tipo.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoUsuario"
                      value={tipo.value}
                      checked={isSelected}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 ${
                        isSelected ? `bg-${tipo.color}-100` : 'bg-gray-100'
                      }`}>
                        <IconTipo className={`w-5 h-5 ${
                          isSelected ? `text-${tipo.color}-600` : 'text-gray-500'
                        }`} />
                      </div>
                      <span className={`ml-3 font-medium ${
                        isSelected ? `text-${tipo.color}-900` : 'text-gray-700'
                      }`}>
                        {tipo.label}
                      </span>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute top-2 right-2 bg-${tipo.color}-500 rounded-full p-1`}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.label>
                );
              })}
            </div>
            {errors.tipoUsuario && (
              <p className="mt-2 text-sm text-red-600">{errors.tipoUsuario}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre de Usuario */}
            {!usuario && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="nombreUsuario"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.nombreUsuario 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="usuario123"
                  />
                </div>
                {errors.nombreUsuario && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombreUsuario}</p>
                )}
              </div>
            )}

            {/* Contraseña */}
            {!usuario && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.contrasena 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.contrasena && (
                  <p className="mt-1 text-sm text-red-600">{errors.contrasena}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="telefonoMovil"
                  value={formData.telefonoMovil}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.telefonoMovil 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="1234567890"
                />
              </div>
              {errors.telefonoMovil && (
                <p className="mt-1 text-sm text-red-600">{errors.telefonoMovil}</p>
              )}
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows="2"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Calle, número, colonia..."
                />
              </div>
            </div>

            {/* Especialidad (solo para profesores) */}
            <AnimatePresence>
              {formData.tipoUsuario === 'PROFESOR' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:col-span-2"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidad
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Ej: Matemáticas, Física, etc."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center"
          >
            <X className="w-5 h-5 mr-2" />
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                {usuario ? 'Actualizar' : 'Crear Usuario'}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormularioUsuario;