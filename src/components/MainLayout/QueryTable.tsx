import { useState, ChangeEvent, useEffect } from 'react';

//Css
import styles from './Styles/Table.module.css';

//Components
import Modal from './Components/Modal';

//Types
import { Person } from './Types/types';



// Configuración de Columnas
interface ColumnaConfig {
  etiqueta: string;
  clave: keyof Person | 'accion_editar' | 'accion_eliminar';
}

const COLUMNAS: ColumnaConfig[] = [
  { etiqueta: "Foto", clave: "avatar" },
  { etiqueta: "Nombre", clave: "nombre" },
  { etiqueta: "Segundo Nombre", clave: "segundoNombre" },
  { etiqueta: "Apellido", clave: "apellido" },
  { etiqueta: "Tipo Documento", clave: "tipoDoc" },
  { etiqueta: "Documento", clave: "documento" },
  { etiqueta: "Celular", clave: "celular" },
  { etiqueta: "Correo", clave: "correo" },
  { etiqueta: "Género", clave: "genero" },
  { etiqueta: "Fecha Nacimiento", clave: "fechaNacimiento" },
  { etiqueta: "Editar", clave: "accion_editar" },
  { etiqueta: "Eliminar", clave: "accion_eliminar" }
];


const QueryTable = ({ data, onUsuarioActualizado, onUsuarioEliminado }: { data: Person[]; onUsuarioActualizado: (updatedUser: Person) => void; onUsuarioEliminado: (id: number) => void }) => {
  const [usuarios, setUsuarios] = useState<Person[]>( data);
  // Estados para edición y validación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Person | null>(null);
  const [errores, setErrores] = useState<Partial<Record<keyof Person, string>>>({});

  // Estado para controlar qué celda está expandida
  const [celdaExpandida, setCeldaExpandida] = useState<{id: number, clave: string} | null>(null);

  // Estado para modal de vista previa de imagen
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  //Estado modal para eliminar 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 7;
  const ultimoIndice = paginaActual * filasPorPagina;
  const primerIndice = ultimoIndice - filasPorPagina;
  const usuariosPaginados = usuarios.slice(primerIndice, ultimoIndice);
  const totalPaginas = Math.ceil(usuarios.length / filasPorPagina);

  // Funciones para navegar
  const irSiguiente = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  const irAnterior = () => setPaginaActual(prev => Math.max(prev - 1, 1));


  useEffect(() => {
    setPaginaActual(1);
    setUsuarios(data);
  }, [data]);


  const handleEditar = (usuario: Person) => {
    setUsuarioEditando({ ...usuario });
    setIsModalOpen(true);
  };

  const handleEliminar = (id: number) => {
    setIsDeleteModalOpen(true);
    setSelectedUserId(id);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId !== null) {
      onUsuarioEliminado(selectedUserId);
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
    }
  };

  // Función para manejar cambios en los inputs del formulario de edición

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  //Validaciones de input
  const onlyString = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
  if (['nombre', 'segundoNombre', 'apellido'].includes(name)) {
    if (!onlyString.test(value)) return; 
    if (name === 'nombre' || name === 'segundoNombre') {
       if (value.length > 30) return;
    } else if (value.length > 60) return;
  }

  const onlyNumbers = /^[0-9]*$/;
  if (['documento', 'celular'].includes(name)) {
    if (!onlyNumbers.test(value)) return; 
    if (value.length > 10) return;
  }

  if (usuarioEditando) {
    setUsuarioEditando({ ...usuarioEditando, [name]: value });
    inputValidation(name, value);
  }
};

  // Función para manejar cambios en el input de avatar en el modal de edición
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const limit = 2 * 1024 * 1024;
  if (file.size > limit) {
    setErrores(prev => ({ ...prev, avatar: "El archivo es demasiado grande" }));
    e.target.value = "";
    return;
  }
  setErrores(prev => ({ ...prev, avatar: "" }));
  
  const reader = new FileReader();
  reader.onloadend = () => {
    if (usuarioEditando) {
      setUsuarioEditando({ ...usuarioEditando, avatar: reader.result as string });
    }
  };
  reader.readAsDataURL(file);
};


  // Función para guardar los cambios realizados en el modal de edición
  const handleGuardar = () => {
    if (usuarioEditando) {
      onUsuarioActualizado(usuarioEditando);
      setIsModalOpen(false);
      setUsuarioEditando(null);
    }
  };

  // Función para validar el formulario de edición antes de guardar
  const esFormularioInvalido = () => {
  if (!usuarioEditando) return true;

  const tieneErrores = Object.values(errores).some(error => error !== "");

  const camposObligatorios: (keyof Person)[] = [
    'nombre', 'segundoNombre', 'apellido', 'tipoDoc', 'documento', 'celular', 'correo', 'genero', 'fechaNacimiento'
  ];
  
  const tieneCamposVacios = camposObligatorios.some(campo => {
    const valor = usuarioEditando[campo];
    return !valor || String(valor).trim() === "";
  });

  return tieneErrores || tieneCamposVacios;
};

// Función para validar cada campo individualmente al cambiar su valor
const inputValidation = (name: string, value: string) => {
  let tieneError = false;

  if (value.trim() === "") {
    tieneError = true;
  } else {
    switch (name) {
      case 'celular':
        if (value.length !== 10) tieneError = true;
        break;
      case 'correo':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) tieneError = true;
        break;
      case 'documento':
        if (value.length < 0) tieneError = true;
        break;
    }
  }

  setErrores(prev => ({ ...prev, [name]: tieneError ? "invalid" : "" }));
};

// Función para determinar la clase CSS de un campo según su estado de validación rojo si tiene error, verde si es válido, o sin clase si no se ha editado
const getEstadoCampo = (name: string) => {
  if (!usuarioEditando) return "";
  
  const valor = String(usuarioEditando[name as keyof Person] || "");
  if (errores[name as keyof Person]) return styles.inputError;

  if (valor.trim() !== "") return styles.inputSuccess;

  return ""; 
};

// Función para expandir o contraer el contenido de una celda al hacer clic
const toggleExpandir = (id: number, clave: string) => {
  if (celdaExpandida?.id === id && celdaExpandida?.clave === clave) {
    setCeldaExpandida(null);
  } else {
    setCeldaExpandida({ id, clave });
  }
};

//Función para abrir el modal de vista previa de imagen al hacer clic en el avatar
const handleOpenPreview = (url: string) => {
  setPreviewImagen(url);
  setIsImageModalOpen(true);
};

  return (
    <div className={styles.containerTable}>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {COLUMNAS.map((col, index) => (
                <th key={index} className={`${styles.th}`}>
                  {col.etiqueta}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.map((usuario) => (
              <tr key={usuario.id}>
                {COLUMNAS.map((col, index) => {
                  if (col.clave === "avatar") {
                    const avatarUrl = usuario.avatar || 'images/lilithIcon.png';
                    return (
                      <td key={index} className={styles.icon} >
                        <img 
                          src={avatarUrl}
                          alt="User" 
                          className={styles.avatarSmallClickable} 
                          onClick={() => handleOpenPreview(avatarUrl)}
                        />
                      </td>
                    );
                  }
                  if (col.clave === "accion_editar") {
                    return (
                      <td key={index}>
                        <button className={styles.btnEditar} onClick={() => handleEditar(usuario)}>
                          <i className="bi bi-pencil-square"></i> Editar
                        </button>
                      </td>
                    );
                  }
                  if (col.clave === "accion_eliminar") {
                    return (
                      <td key={index}>
                        <button className={styles.btnEliminar} onClick={() => handleEliminar(usuario.id)}>
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </td>
                    );
                  }
                  return (
                    <td key={index} className={`${styles.td} ${celdaExpandida?.id === usuario.id && celdaExpandida?.clave === col.clave ? styles.tdExpanded : ''}`}
                     onClick={() => toggleExpandir(usuario.id, col.clave as string)}
                      title="Haz clic para ver más">
                      {usuario[col.clave as keyof Person] || <span className={styles.textMuted}>-</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
               <div className={styles.pagination}>
                        <button 
                          onClick={irAnterior} 
                          disabled={paginaActual === 1}
                          className={styles.pageBtn}
                        >
                          <i className="bi bi-chevron-left"></i> Anterior
                        </button>
                        
                        <span className={styles.pageIndicator}>
                          Página <strong>{paginaActual}</strong> de {totalPaginas}
                        </span>
                        
                        <button 
                          onClick={irSiguiente} 
                          disabled={paginaActual === totalPaginas}
                          className={styles.pageBtn}
                        >
                          Siguiente <i className="bi bi-chevron-right"></i>
                        </button>
                      </div>
      </div>

      {/* MODAL DE EDICION */}
     <Modal  isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>   
      {usuarioEditando && (  
          <div>
            <div className={styles.modalHeader}>
              <h3>Editar información de Usuario </h3>
            </div>
            
            <div className={styles.modalBody}>
              {/* Sección Avatar */}
                <div className={styles.avatarSection}>
                    <img 
                      src={usuarioEditando.avatar || 'images/lilithIcon.png'} 
                      className={`${styles.avatarPreview} ${errores.avatar ? styles.avatarError : ''}`}
                      alt="Preview"
                    />
                    <input  type="file" accept="image/*" onChange={handleFileChange} className={`${styles.fileInput} ${errores.avatar ? styles.inputError : ''}`} 
                    />
                    {errores.avatar ? (
                      <span className={styles.errorMessage}>{errores.avatar}</span>) : (
                       <small>Máximo 2MB (JPG, PNG)</small>
                    )}
                  </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre</label>
                  <input className={`${styles.input} ${getEstadoCampo('nombre')}`} type="text" name="nombre" maxLength={30} value={usuarioEditando.nombre} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Segundo Nombre</label>
                  <input className={`${styles.input} ${getEstadoCampo('segundoNombre')}`} type="text" name="segundoNombre" value={usuarioEditando.segundoNombre} onChange={handleChange} />
          
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Apellido</label>
                  <input className={`${styles.input} ${getEstadoCampo('apellido')}`} type="text" name="apellido" maxLength={60} value={usuarioEditando.apellido} onChange={handleChange} />
         
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo de documento</label>
                  <select className={styles.input} name="tipoDoc" value={usuarioEditando.tipoDoc} onChange={handleChange}>
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Documento</label>
                  <input className={`${styles.input} ${getEstadoCampo('documento')}`} type="text" name="documento" maxLength={10} value={usuarioEditando.documento} onChange={handleChange} />
      
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Celular</label>
                  <input className={`${styles.input} ${getEstadoCampo('celular')}`} type="text" name="celular" minLength={10} value={usuarioEditando.celular} onChange={handleChange} />
   
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Correo</label>
                  <input className={`${styles.input} ${getEstadoCampo('correo')}`} type="text" name="correo"  value={usuarioEditando.correo} onChange={handleChange} />
    
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Género</label>
                  <select className={styles.input} name="genero" value={usuarioEditando.genero} onChange={handleChange}>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="No Binario">No Binario</option>
                    <option value="Prefiero No Responder">Prefiero no responder</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Fecha Nacimiento</label>
                  <input className={styles.input} type="date" name="fechaNacimiento" value={usuarioEditando.fechaNacimiento} onChange={handleChange} />
                </div>
              </div>
            </div>
                   

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className={styles.btnSave} onClick={handleGuardar} disabled={esFormularioInvalido()}>
               Guardar Cambios
              </button>
            </div>
       
                    </div>
      )}
      </Modal>

            {/* MODAL DE VISTA PREVIA DE IMAGEN */}
            <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
              {previewImagen && (
              <div>
                  <div className={styles.imageModalContent}>
                    <button className={styles.btnClosePreview} onClick={() => setIsImageModalOpen(false)}>
                      &times;
                    </button>
                    <img src={previewImagen} alt="Preview Grande" className={styles.fullImage} />
                  </div>
                  </div>
              )}
            </Modal>


          {/* MODAL DE CONFIRMACION DE ELIMINACION */}
          <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>      
            {isDeleteModalOpen && (
              <div>
                  <div className={styles.modalHeader}>
                    <h3>Confirmar Eliminación</h3>
                  </div>
                  <div className={styles.modalBody}>
                    <p>¿Estás seguro de que deseas eliminar este registro?</p>
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.btnCancel} onClick={() => setIsDeleteModalOpen(false)}>
                      Cancelar
                    </button>
                    <button
                      className={styles.btnEliminar}
                      onClick={ handleDeleteConfirm}
                    >
                      Eliminar
                    </button>
                  </div>
               </div>
            )}
            </Modal>
    </div>
  );
};

export default QueryTable;