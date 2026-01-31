import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './NotificationDropdown.module.css';
import { Bell, Check } from 'lucide-react';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.iconBtn} onClick={() => setIsOpen(!isOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <h3>Notifications</h3>
                        <span className={styles.count}>{unreadCount} New</span>
                    </div>
                    <div className={styles.list}>
                        {notifications.length === 0 ? (
                            <div className={styles.empty}>No notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`${styles.item} ${n.isRead ? styles.read : styles.unread}`}>
                                    <div className={styles.itemContent}>
                                        <div className={styles.itemHeader}>
                                            <span className={styles.typeTag}>{n.type}</span>
                                            <span className={styles.time}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <h4>{n.title}</h4>
                                        <p>{n.message}</p>
                                    </div>
                                    {!n.isRead && (
                                        <button className={styles.readBtn} onClick={() => markAsRead(n.id)}>
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <div className={styles.footer}>
                        <button>View All Notifications</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
