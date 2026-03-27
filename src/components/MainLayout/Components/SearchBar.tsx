//Css
import styles from '../Styles/MainLayout.module.css';

export default function SearchBar() {
    return (
        <div>
            <input className={styles.searchBar} type="text" placeholder="Buscar..." />
        </div>
    );
}