//css 
import styles from './SideBar.module.css';

interface UserProfileProps {
    name: string;
    role: string;
    avatar: string;
} 

export default function UserProfile({ name, role, avatar }: UserProfileProps) {
  return (
    <div className={styles.profileContainer}>
    <div className={styles.avatar}>
      <img src={avatar} alt="User Avatar" className={styles.avatarImage} />
    </div>
    <h2 className={styles.userName}>{name}</h2>
    <p className={styles.userRole}>{role}</p>
  </div>
  );
}