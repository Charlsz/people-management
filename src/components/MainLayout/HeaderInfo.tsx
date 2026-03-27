//Css
import styles from './Styles/MainLayout.module.css';

//components
import StatusIndicator from './StatusIndicator';

interface HeaderInfoProps {
    title: string;
    status: boolean;
}

export default function HeaderInfo ({ title , status }: HeaderInfoProps) {
    return (
        <div className={styles.headerInfo}>
                <h1 className={styles.text}>{title}</h1>
                <StatusIndicator active={status} label="Estado de consulta" />
            
        </div>
    );
}