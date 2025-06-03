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

export default api;