import axios from 'axios';

const API_URL = '/api'; // Usar ruta relativa con el proxy de Vite

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (credentials) => {
    try {
      console.log('Enviando credenciales:', credentials); // Debug
      const response = await api.post('/auth/login', credentials);
      console.log('Respuesta del servidor:', response.data); // Debug
      return response.data;
    } catch (error) {
      console.error('Error en authService.login:', error.response || error);
      throw error;
    }
  },
};

// Servicios de usuarios
export const usuarioService = {
  // Obtener todos los usuarios
  obtenerTodos: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Obtener usuario por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear usuario
  crear: async (usuario) => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  // Actualizar usuario
  actualizar: async (id, usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  // Cambiar estado
  cambiarEstado: async (id) => {
    const response = await api.patch(`/usuarios/${id}/estado`);
    return response.data;
  },

  // Cambiar contraseña
  cambiarContrasena: async (id, nuevaContrasena) => {
    const response = await api.patch(`/usuarios/${id}/contrasena`, { nuevaContrasena });
    return response.data;
  },

  // Eliminar usuario
  eliminar: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};

// Servicios de grupos
export const grupoService = {
  // Obtener todos los grupos
  obtenerTodos: async () => {
    const response = await api.get('/grupos');
    return response.data;
  },

  // Obtener grupos activos
  obtenerActivos: async () => {
    const response = await api.get('/grupos/activos');
    return response.data;
  },

  // Obtener grupo por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/grupos/${id}`);
    return response.data;
  },

  // Obtener grupos de un profesor
  obtenerPorProfesor: async (profesorId) => {
    const response = await api.get(`/grupos/profesor/${profesorId}`);
    return response.data;
  },

  // Crear grupo
  crear: async (grupo) => {
    const response = await api.post('/grupos', grupo);
    return response.data;
  },

  // Actualizar grupo
  actualizar: async (id, grupo) => {
    const response = await api.put(`/grupos/${id}`, grupo);
    return response.data;
  },

  // Cambiar estado
  cambiarEstado: async (id) => {
    const response = await api.patch(`/grupos/${id}/estado`);
    return response.data;
  },

  // Asignar profesor
  asignarProfesor: async (grupoId, profesorId) => {
    const response = await api.post(`/grupos/${grupoId}/profesores/${profesorId}`);
    return response.data;
  },

  // Inscribir estudiante
  inscribirEstudiante: async (grupoId, estudianteId) => {
    const response = await api.post(`/grupos/${grupoId}/estudiantes/${estudianteId}`);
    return response.data;
  },

  // Desinscribir estudiante
  desinscribirEstudiante: async (grupoId, estudianteId) => {
    const response = await api.delete(`/grupos/${grupoId}/estudiantes/${estudianteId}`);
    return response.data;
  },

  // Obtener estudiantes del grupo
  obtenerEstudiantesDelGrupo: async (grupoId) => {
    const response = await api.get(`/grupos/${grupoId}/estudiantes`);
    return response.data;
  },

  // Obtener estudiantes disponibles
  obtenerEstudiantesDisponibles: async (grupoId) => {
    const response = await api.get(`/grupos/${grupoId}/estudiantes/disponibles`);
    return response.data;
  },
};

// Servicios de asistencias
export const asistenciaService = {
  // Tomar asistencia
  tomarAsistencia: async (datos) => {
    const response = await api.post('/asistencias/tomar', datos);
    return response.data;
  },

  // Obtener lista de estudiantes para asistencia
  obtenerListaAsistencia: async (grupoId, fecha) => {
    const response = await api.get(`/asistencias/grupo/${grupoId}/fecha/${fecha}`);
    return response.data;
  },

  // Verificar si ya se tomó asistencia
  verificarAsistencia: async (grupoId, fecha) => {
    const response = await api.get(`/asistencias/grupo/${grupoId}/fecha/${fecha}/verificar`);
    return response.data;
  },

  // Obtener historial de asistencias
  obtenerHistorial: async (grupoId) => {
    const response = await api.get(`/asistencias/grupo/${grupoId}/historial`);
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async (grupoId) => {
    const response = await api.get(`/asistencias/grupo/${grupoId}/estadisticas`);
    return response.data;
  },
  
  // Obtener historial con filtros
  obtenerHistorialFiltrado: async (filtros) => {
    const params = new URLSearchParams();
    if (filtros.grupoId) params.append('grupoId', filtros.grupoId);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros.estado) params.append('estado', filtros.estado);
    
    const response = await api.get(`/asistencias/historial?${params.toString()}`);
    return response.data;
  },
};

// Servicios de estadísticas
export const estadisticaService = {
  // Estadísticas admin
  obtenerEstadisticasAdmin: async () => {
    const response = await api.get('/estadisticas/admin');
    return response.data;
  },

  // Estadísticas profesor
  obtenerEstadisticasProfesor: async () => {
    const response = await api.get('/estadisticas/profesor');
    return response.data;
  },

  // Asistencias de hoy
  obtenerAsistenciasHoy: async () => {
    const response = await api.get('/estadisticas/asistencias-hoy');
    return response.data;
  },
};

// Crear instancia para el servicio de analytics (Python)
const analyticsApi = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de analytics
export const analyticsService = {
  // Análisis general de asistencias
  obtenerAnalisisGeneral: async () => {
    const response = await analyticsApi.get('/api/analytics/asistencia/general');
    return response.data;
  },

  // Análisis por grupo
  obtenerAnalisisGrupo: async (grupoId) => {
    const response = await analyticsApi.get(`/api/analytics/asistencia/grupo/${grupoId}`);
    return response.data;
  },

  // Análisis por estudiante
  obtenerAnalisisEstudiante: async (estudianteId) => {
    const response = await analyticsApi.get(`/api/analytics/asistencia/estudiante/${estudianteId}`);
    return response.data;
  },

  // Reporte del profesor
  obtenerReporteProfesor: async (profesorId) => {
    const response = await analyticsApi.get(`/api/analytics/reporte/profesor/${profesorId}`);
    return response.data;
  },

  // Predicción de deserción
  obtenerPrediccionDesercion: async () => {
    const response = await analyticsApi.get('/api/analytics/prediccion/desercion');
    return response.data;
  },
};

export default api;