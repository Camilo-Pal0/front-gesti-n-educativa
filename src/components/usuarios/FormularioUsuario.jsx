import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/api';

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

  useEffect(() => {
    if (usuario) {
      // Si estamos editando, cargar los datos del usuario
      setFormData({
        ...usuario,
        contrasena: '', // No cargar la contraseña
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
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.tipoUsuario) {
      newErrors.tipoUsuario = 'El tipo de usuario es requerido';
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
        // Actualizar usuario existente
        const { nombreUsuario, contrasena, ...datosActualizar } = formData;
        await usuarioService.actualizar(usuario.id, datosActualizar);
      } else {
        // Crear nuevo usuario
        await usuarioService.crear(formData);
      }
      onSuccess();
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

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre de Usuario */}
          {!usuario && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm 
                  ${errors.nombreUsuario ? 'border-red-300' : 'border-gray-300'} 
                  focus:border-indigo-500 focus:ring-indigo-500`}
              />
              {errors.nombreUsuario && (
                <p className="mt-1 text-sm text-red-600">{errors.nombreUsuario}</p>
              )}
            </div>
          )}

          {/* Contraseña */}
          {!usuario && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm 
                  ${errors.contrasena ? 'border-red-300' : 'border-gray-300'} 
                  focus:border-indigo-500 focus:ring-indigo-500`}
              />
              {errors.contrasena && (
                <p className="mt-1 text-sm text-red-600">{errors.contrasena}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm 
                ${errors.email ? 'border-red-300' : 'border-gray-300'} 
                focus:border-indigo-500 focus:ring-indigo-500`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefonoMovil"
              value={formData.telefonoMovil}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Tipo de Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Usuario
            </label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm 
                ${errors.tipoUsuario ? 'border-red-300' : 'border-gray-300'} 
                focus:border-indigo-500 focus:ring-indigo-500`}
            >
              <option value="ESTUDIANTE">Estudiante</option>
              <option value="PROFESOR">Profesor</option>
              <option value="ADMIN">Administrador</option>
            </select>
            {errors.tipoUsuario && (
              <p className="mt-1 text-sm text-red-600">{errors.tipoUsuario}</p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Especialidad (solo para profesores) */}
          {formData.tipoUsuario === 'PROFESOR' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Especialidad
              </label>
              <input
                type="text"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : (usuario ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioUsuario;