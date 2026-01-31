import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './Layout.module.css';

import SettingsModal from './SettingsModal';

const Layout = ({ children }) => {
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    return (
        <div className={styles.layout}>
            <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />
            <div className={styles.mainWrapper}>
                <Topbar onSettingsClick={() => setIsSettingsOpen(true)} />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
            {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
        </div>
    );
};

export default Layout;
