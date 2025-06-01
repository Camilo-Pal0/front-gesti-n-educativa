import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext - Iniciando login con:', credentials); // Debug
      const response = await authService.login(credentials);
      console.log('AuthContext - Respuesta recibida:', response); // Debug
      
      // Guardar token y usuario
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        nombreUsuario: response.nombreUsuario,
        email: response.email,
        tipoUsuario: response.tipoUsuario
      }));
      
      setUser({
        id: response.id,
        nombreUsuario: response.nombreUsuario,
        email: response.email,
        tipoUsuario: response.tipoUsuario
      });
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext - Error en login:', error); // Debug
      return { 
        success: false, 
        error: error.response?.data?.mensaje || error.message || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.tipoUsuario === 'ADMIN',
    isProfesor: user?.tipoUsuario === 'PROFESOR',
    isEstudiante: user?.tipoUsuario === 'ESTUDIANTE'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};