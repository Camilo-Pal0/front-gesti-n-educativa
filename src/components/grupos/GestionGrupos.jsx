import { useState } from 'react';
import ListaGrupos from './ListaGrupos';
import FormularioGrupo from './FormularioGrupo';

const GestionGrupos = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [grupoEditar, setGrupoEditar] = useState(null);

  const handleAdd = () => {
    setGrupoEditar(null);
    setMostrarFormulario(true);
  };

  const handleEdit = (grupo) => {
    setGrupoEditar(grupo);
    setMostrarFormulario(true);
  };

  const handleSuccess = () => {
    setMostrarFormulario(false);
    setGrupoEditar(null);
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setGrupoEditar(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Gestión de Grupos</h2>
      
      {!mostrarFormulario ? (
        <ListaGrupos onEdit={handleEdit} onAdd={handleAdd} />
      ) : (
        <FormularioGrupo 
          grupo={grupoEditar}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default GestionGrupos;