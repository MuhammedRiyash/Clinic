import React from 'react';
import styles from './Topbar.module.css';
import { Search, Bell, Settings, LogOut } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

const Topbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className={styles.topbar}>
            <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Search..." />
            </div>

            <div className={styles.actions}>
                <button className={styles.iconBtn}><Bell size={20} /></button>
                <button className={styles.iconBtn}><Settings size={20} /></button>
                <button className={styles.iconBtn} onClick={logout} title="Logout"><LogOut size={20} /></button>

                <div className={styles.userProfile}>
                    <img src={user?.imagePath ? `${import.meta.env.VITE_IMAGE_HOST || ''}${user.imagePath}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} alt="User" />
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user?.name || 'Dhanush'}</span>
                        <span className={styles.userStatus}><span className={styles.onlineDot}></span> {user?.role || 'Online'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
