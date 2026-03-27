//Css
import styles from './Styles/Table.module.css';
import ViewIconSource from '../../../public/icons/ViewIcon.svg'
import Image from 'next/image'; 

import { useState, ChangeEvent, useEffect } from 'react';

//types
import { Log } from './Types/types'

//Components
import Modal from './Components/Modal';

// Configuración de Columnas
interface ColumnaConfig {
  etiqueta: string;
  clave: keyof Log | 'accion_editar' | 'accion_eliminar';
}

const COLUMNAS: ColumnaConfig[] = [
  { etiqueta: "id_transaccion", clave: "id" },
  { etiqueta: "Documento(Cliente) ", clave: "document" },
  { etiqueta: "Autor", clave: "autor" },
  { etiqueta: "Tipo de accion", clave: "typeOfAction" },
  { etiqueta: "Fecha y hora", clave: "dateAndHour" },
  { etiqueta: "Detalles", clave: "details"}
];



export default function LogsTable ({ data }: {data: Log[];}) {

    const [logs, setLogs] = useState<Log[]>( data);
    const logDetail = 'hola'

    const [isModalOpen, setIsModalOpen] = useState(false);


    // Estado para controlar qué celda está expandida
    const [celdaExpandida, setCeldaExpandida] = useState<{id: number, clave: string} | null>(null);

    // Estados para paginación
      const [paginaActual, setPaginaActual] = useState(1);
      const filasPorPagina = 7;
      const ultimoIndice = paginaActual * filasPorPagina;
      const primerIndice = ultimoIndice - filasPorPagina;
      const logsPaginados = logs.slice(primerIndice, ultimoIndice);
      console.log(logsPaginados)
      const totalPaginas = Math.ceil(logs.length / filasPorPagina);

            // Funciones para navegar
    const irSiguiente = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
    const irAnterior = () => setPaginaActual(prev => Math.max(prev - 1, 1));

    const handleView = (log:Log) => {
            setIsModalOpen(true);
        };

    const toggleExpandir = (id: number, clave: string) => {
        if (celdaExpandida?.id === id && celdaExpandida?.clave === clave) {
            setCeldaExpandida(null);
        } else {
            setCeldaExpandida({ id, clave });
        }
        };


        return(
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
            {logsPaginados.map((log) => (
              <tr key={log.id}>
                {COLUMNAS.map((col, index) => {
                  if (col.clave === "details") {
                    return (
                      <td key={index} className= {styles.icon}>
                        <button className={styles.btnVer} onClick={() => handleView(log)}>
                          <Image 
                            src={ViewIconSource} 
                            alt="Ver log" 
                            width={40} 
                            height={40} 
                            className={styles.iconImg}
                            />
                        </button>
                      </td>
                    );
                  }

                  return (
                    <td key={index} className={`${styles.td} ${celdaExpandida?.id === log.id && celdaExpandida?.clave === col.clave ? styles.tdExpanded : ''}`}
                     onClick={() => toggleExpandir(log.id, col.clave as string)}
                      title="Haz clic para ver más">
                      {log[col.clave as keyof Log] || <span className={styles.textMuted}>-</span>}
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



                 <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>      
            {isModalOpen && (
              <div>
                  <div className={styles.modalHeader}>
                        <p>aqui iran los detalles</p>
                  </div>
               </div>
            )}
            </Modal>

      </div>
        
    );

    
}