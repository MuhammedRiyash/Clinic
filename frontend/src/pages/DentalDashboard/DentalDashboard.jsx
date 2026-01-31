import React from 'react';
import styles from './DentalDashboard.module.css';

const DentalDashboard = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Dental Dashboard</h1>
                <p>Specialized metrics and clinical overview for dental services.</p>
            </header>
            <div className={styles.placeholder}>
                <div className={styles.card}>
                    <h3>Coming Soon</h3>
                    <p>Dental surgery scheduling, patient tooth history, and imaging system integration are being prepared.</p>
                </div>
            </div>
        </div>
    );
};

export default DentalDashboard;
