import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import styles from './SettingsModal.module.css';
import { Moon, Sun, Monitor, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SettingsModal = ({ onClose }) => {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();

    const themeOptions = [
        { id: 'light', label: 'Light', icon: <Sun size={18} /> },
        { id: 'dark', label: 'Dark', icon: <Moon size={18} /> },
        { id: 'system', label: 'System', icon: <Monitor size={18} /> }
    ];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>Settings</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}><Sun size={16} /> Appearance</h3>
                        <div className={styles.themeGrid}>
                            {themeOptions.map((option) => (
                                <button
                                    key={option.id}
                                    className={`${styles.themeCard} ${theme === option.id ? styles.active : ''}`}
                                    onClick={() => setTheme(option.id)}
                                >
                                    {option.icon}
                                    <span>{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}><User size={16} /> Profile</h3>
                        <div className={styles.profileBox}>
                            <div className={styles.avatar}>
                                <img src={user?.imagePath ? `${import.meta.env.VITE_IMAGE_HOST || ''}${user.imagePath}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} alt="User" />
                            </div>
                            <div className={styles.info}>
                                <p className={styles.name}>{user?.name || 'User'}</p>
                                <p className={styles.role}>{user?.role || 'Staff'}</p>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className={styles.footer}>
                    <button className={styles.logoutBtn} onClick={logout}>
                        <LogOut size={18} /> Logout Session
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SettingsModal;
