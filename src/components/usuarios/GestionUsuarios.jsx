import { useState } from 'react';
import ListaUsuarios from './ListaUsuarios';
import FormularioUsuarios from './FormularioUsuario';

const GestionUsuarios = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const handleAdd = () => {
    setUsuarioEditar(null);
    setMostrarFormulario(true);
  };

  const handleEdit = (usuario) => {
    setUsuarioEditar(usuario);
    setMostrarFormulario(true);
  };

  const handleSuccess = () => {
    setMostrarFormulario(false);
    setUsuarioEditar(null);
    // La lista se recargará automáticamente
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setUsuarioEditar(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Gestión de Usuarios</h2>
      
      {!mostrarFormulario ? (
        <ListaUsuarios onEdit={handleEdit} onAdd={handleAdd} />
      ) : (
        <FormularioUsuarios 
          usuario={usuarioEditar}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default GestionUsuarios;