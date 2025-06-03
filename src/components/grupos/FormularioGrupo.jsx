import { useState, useEffect } from 'react';
import { grupoService, usuarioService } from '../../services/api';

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
      const usuarios = await usuarioService.obtenerTodos();
      const profesoresFiltrados = usuarios.filter(u => u.tipoUsuario === 'PROFESOR' && u.activo);
      setProfesores(profesoresFiltrados);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
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

    if (!formData.nombreGrupo) newErrors.nombreGrupo = 'El nombre del grupo es requerido';
    if (!formData.codigo) newErrors.codigo = 'El código es requerido';
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
      onSuccess();
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
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {grupo ? 'Editar Grupo' : 'Nuevo Grupo'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código del Curso
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              placeholder="Ej: MAT101"
              className={`mt-1 block w-full rounded-md shadow-sm 
                ${errors.codigo ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.codigo && (
              <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
            )}
          </div>

          {/* Nombre del Grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Grupo
            </label>
            <input
              type="text"
              name="nombreGrupo"
              value={formData.nombreGrupo}
              onChange={handleChange}
              placeholder="Ej: Grupo A"
              className={`mt-1 block w-full rounded-md shadow-sm 
                ${errors.nombreGrupo ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.nombreGrupo && (
              <p className="mt-1 text-sm text-red-600">{errors.nombreGrupo}</p>
            )}
          </div>

          {/* Materia */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la Materia
            </label>
            <input
              type="text"
              name="materia"
              value={formData.materia}
              onChange={handleChange}
              placeholder="Ej: Cálculo Diferencial"
              className={`mt-1 block w-full rounded-md shadow-sm 
                ${errors.materia ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.materia && (
              <p className="mt-1 text-sm text-red-600">{errors.materia}</p>
            )}
          </div>

          {/* Facultad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Facultad/Departamento
            </label>
            <input
              type="text"
              name="facultad"
              value={formData.facultad}
              onChange={handleChange}
              placeholder="Ej: Ingeniería"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Semestre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Semestre
            </label>
            <input
              type="number"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              min="1"
              max="12"
              className={`mt-1 block w-full rounded-md shadow-sm 
                ${errors.semestre ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.semestre && (
              <p className="mt-1 text-sm text-red-600">{errors.semestre}</p>
            )}
          </div>

          {/* Periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Periodo Académico
            </label>
            <input
              type="text"
              name="periodo"
              value={formData.periodo}
              onChange={handleChange}
              placeholder="Ej: 2024-1"
              className={`mt-1 block w-full rounded-md shadow-sm 
                ${errors.periodo ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.periodo && (
              <p className="mt-1 text-sm text-red-600">{errors.periodo}</p>
            )}
          </div>

          {/* Créditos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Créditos
            </label>
            <input
              type="number"
              name="creditos"
              value={formData.creditos}
              onChange={handleChange}
              min="1"
              max="10"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Horario */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Horario
            </label>
            <input
              type="text"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              placeholder="Ej: LUN-MIE 14:00-16:00"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Aula */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Aula/Salón
            </label>
            <input
              type="text"
              name="aula"
              value={formData.aula}
              onChange={handleChange}
              placeholder="Ej: Edificio A - 301"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Cupo Máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cupo Máximo
            </label>
            <input
              type="number"
              name="cupoMaximo"
              value={formData.cupoMaximo}
              onChange={handleChange}
              min="1"
              className={`mt-1 block w-full rounded-md shadow-sm 
                ${errors.cupoMaximo ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.cupoMaximo && (
              <p className="mt-1 text-sm text-red-600">{errors.cupoMaximo}</p>
            )}
          </div>

          {/* Profesores */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesor(es) Asignado(s)
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {profesores.map((profesor) => (
                <label key={profesor.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.profesoresIds.includes(profesor.id)}
                    onChange={() => handleProfesorChange(profesor.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {profesor.nombreUsuario} - {profesor.especialidad || 'Sin especialidad'}
                  </span>
                </label>
              ))}
            </div>
          </div>
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
            {loading ? 'Guardando...' : (grupo ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioGrupo;