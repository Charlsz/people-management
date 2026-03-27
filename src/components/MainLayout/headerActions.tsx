import { useState, ChangeEvent } from 'react';

//Css
import stylesActions from './Styles/MainLayout.module.css';
import styles from './Styles/Table.module.css';

//components
import SearchBar from './Components/SearchBar';
import Button from './Components/Button';
import Modal from './Components/Modal';

//Types
import { Person } from './Types/types';


interface Props {
  onUsuarioCreado: (usuario: Person) => void;
  disabled: boolean;
}



export default function HeaderActions( { onUsuarioCreado, disabled  }: Props) {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioCreando, setUsuarioCreando] =  useState<Person | null>(null);
    const [errores, setErrores] = useState<Partial<Record<keyof Person, string>>>({});

     const handleOpenModal = () => {
      setUsuarioCreando({
        id: Date.now(),
        nombre: '',
        segundoNombre: '',
        apellido: '',
        tipoDoc: 'CC',
        documento: '',
        celular: '',
        correo: '',
        genero: 'Masculino',
        fechaNacimiento: '',
        avatar: ''
    } as Person);
        setIsModalOpen(true);
    };

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

  setUsuarioCreando(prev => {
        if (!prev) return prev;
        return {
            ...prev,
            [name]: value
        };
    });
    inputValidation(name, value);
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
    if (usuarioCreando) {
      setUsuarioCreando({ ...usuarioCreando, avatar: reader.result as string });
    }
  };
  reader.readAsDataURL(file);
};


  // Función para guardar los cambios realizados en el modal de edición
  const handleGuardar = () => {
    if (usuarioCreando) {
      onUsuarioCreado(usuarioCreando);
      setIsModalOpen(false);
      setUsuarioCreando(null);
      console.log("Usuario creado:", usuarioCreando);
    }
  };

  // Función para validar el formulario de edición antes de guardar
  const esFormularioInvalido = () => {
  if (!usuarioCreando) return true;

  const tieneErrores = Object.values(errores).some(error => error !== "");

  const camposObligatorios: (keyof Person)[] = [
    'nombre', 'segundoNombre', 'apellido', 'tipoDoc', 'documento', 'celular', 'correo', 'genero', 'fechaNacimiento'
  ];
  
  const tieneCamposVacios = camposObligatorios.some(campo => {
    
    const valor = usuarioCreando[campo];
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
  if (!usuarioCreando) return "";
  
  const valor = String(usuarioCreando[name as keyof Person] || "");
  if (errores[name as keyof Person]) return styles.inputError;

  if (valor.trim() !== "") return styles.inputSuccess;

  return ""; 
};

  return (
    <div className={stylesActions.actions}>
      <SearchBar />
      <Button label="Nueva Consulta" onClick={() => {}} disabled = {disabled} />
      <Button label="Crear +" onClick={handleOpenModal}/>

         <Modal   isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {/* MODAL DE Creacion */}
                      <div className={styles.modalHeader}>
                        <h3>Crear nuevo Usuario </h3>
                      </div>
                      
                      <div className={styles.modalBody}>
                        {/* Sección Avatar */}
                          <div className={styles.avatarSection}>
                              <img 
                                src= {usuarioCreando?.avatar || 'images/lilithIcon.png'} 
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
                            <input className={`${styles.input} ${getEstadoCampo('nombre')}`} type="text" name="nombre" maxLength={30} value={usuarioCreando?.nombre || ''} onChange={handleChange} />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Segundo Nombre</label>
                            <input className={`${styles.input} ${getEstadoCampo('segundoNombre')}`} type="text" name="segundoNombre" value={usuarioCreando?.segundoNombre || ''} onChange={handleChange} />
                    
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Apellido</label>
                            <input className={`${styles.input} ${getEstadoCampo('apellido')}`} type="text" name="apellido" maxLength={60} value={usuarioCreando?.apellido || ''} onChange={handleChange} />
                  
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Tipo de documento</label>
                            <select className={styles.input} name="tipoDoc" value={usuarioCreando?.tipoDoc || ''} onChange={handleChange}>
                              <option value="CC">Cédula de Ciudadanía (CC)</option>
                              <option value="TI">Tarjeta de Identidad (TI)</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Documento</label>
                            <input className={`${styles.input} ${getEstadoCampo('documento')}`} type="text" name="documento" maxLength={10} value={usuarioCreando?.documento || ''} onChange={handleChange} />
                
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Celular</label>
                            <input className={`${styles.input} ${getEstadoCampo('celular')}`} type="text" name="celular" minLength={10} value={usuarioCreando?.celular || ''} onChange={handleChange} />
            
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Correo</label>
                            <input className={`${styles.input} ${getEstadoCampo('correo')}`} type="text" name="correo"  value={usuarioCreando?.correo || ''} onChange={handleChange} />
              
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Género</label>
                            <select className={styles.input} name="genero" value={usuarioCreando?.genero || ''} onChange={handleChange}>
                              <option value="Masculino">Masculino</option>
                              <option value="Femenino">Femenino</option>
                              <option value="No Binario">No Binario</option>
                              <option value="Prefiero No Responder">Prefiero no responder</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Fecha Nacimiento</label>
                            <input className={styles.input} type="date" name="fechaNacimiento" value={usuarioCreando?.fechaNacimiento || ''} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                            

                      <div className={styles.modalActions}>
                        <button className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button className={styles.btnSave} onClick={handleGuardar} disabled={esFormularioInvalido()}>
                        Guardar Cambios
                        </button>
                      </div>
          
            </Modal>
    </div>
  );
}