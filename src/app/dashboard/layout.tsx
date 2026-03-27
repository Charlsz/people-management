//Css
import styles from './layout.module.css';

//Components
import SideBar from '@/components/SideBar/SideBar';
import { UiProvider } from '@/context/UiContext'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UiProvider>
      <div className={styles.layoutContainer}>
        <SideBar />
        <main className={styles.mainContent}>
            {children}
        </main>
      </div>
    </UiProvider>
  );
}