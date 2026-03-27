//css
import styles from '../Styles/MainLayout.module.css';

interface ButtonProps {
    onClick: () => void;
    label: string;
    disabled?:boolean;
}


export default function button ({ onClick, label, disabled }: ButtonProps) {

    return (

        <div className={styles.actions}>
            <button className={styles.button} onClick={onClick} disabled = {disabled}>
                {label}
            </button>
        </div>

        
    );
}