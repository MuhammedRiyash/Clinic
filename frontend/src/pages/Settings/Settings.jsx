import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import styles from './Settings.module.css';
import { Moon, Sun, Monitor } from 'lucide-react';

const Settings = () => {
    const { theme, setTheme } = useTheme();

    const themeOptions = [
        { id: 'light', label: 'Light Mode', icon: <Sun size={20} /> },
        { id: 'dark', label: 'Dark Mode', icon: <Moon size={20} /> },
        { id: 'system', label: 'System Default', icon: <Monitor size={20} /> }
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Application Settings <span>/ Preferences</span></h1>
            </header>

            <section className={styles.section}>
                <h3>Appearance</h3>
                <p>Customize how Tectra Clinic looks on your device.</p>

                <div className={styles.themeGrid}>
                    {themeOptions.map((option) => (
                        <button
                            key={option.id}
                            className={`${styles.themeCard} ${theme === option.id ? styles.active : ''}`}
                            onClick={() => setTheme(option.id)}
                        >
                            <div className={styles.themeIcon}>{option.icon}</div>
                            <span className={styles.themeLabel}>{option.label}</span>
                            {theme === option.id && <div className={styles.check}>✓</div>}
                        </button>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h3>Clinic Information</h3>
                <p>Manage your practice details and branding.</p>
                <div className={styles.infoBox}>
                    <p><strong>Clinic Name:</strong> Tectra Health Center</p>
                    <p><strong>Version:</strong> v1.0.2 (Production)</p>
                    <p><strong>Copyright:</strong> © 2026 Tectra Clinic Solutions</p>
                </div>
            </section>
        </div>
    );
};

export default Settings;
