import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import {
    LayoutDashboard,
    Stethoscope,
    Users,
    Calendar,
    CreditCard,
    Package,
    Video,
    Database,
    ShieldCheck,
    MessageSquare,
    Activity,
    ClipboardList,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        {
            section: 'OVERVIEW', items: [
                { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
                { name: 'Dental Dashboard', icon: <Activity size={20} />, path: '/dental-dashboard' },
            ]
        },
        {
            section: 'APPLICATIONS', items: [
                { name: 'Telemedicine', icon: <Video size={20} />, path: '/telemedicine' },
                { name: 'Inventory Management', icon: <Package size={20} />, path: '/inventory' },
                { name: 'Insurance Management', icon: <ShieldCheck size={20} />, path: '/insurance' },
                { name: 'Doctors', icon: <Stethoscope size={20} />, path: '/doctors' },
                { name: 'Patients', icon: <Users size={20} />, path: '/patients' },
                { name: 'Appointments', icon: <Calendar size={20} />, path: '/appointments' },
                { name: 'Chats', icon: <MessageSquare size={20} />, path: '/chats' },
                { name: 'Medical Services', icon: <Activity size={20} />, path: '/medical-services' },
                { name: 'Dental Services', icon: <ClipboardList size={20} />, path: '/dental-services' },
                { name: 'Billing and Invoice', icon: <CreditCard size={20} />, path: '/billing' },
            ]
        },
        {
            section: 'SYSTEM', items: [
                { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
                { name: 'Users', icon: <Users size={20} />, path: '/users' },
            ]
        }
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <img src="/logo.png" alt="Tectra Clinic" />
            </div>
            <nav className={styles.nav}>
                {menuItems.map((group, idx) => (
                    <div key={idx} className={styles.group}>
                        <h3 className={styles.groupTitle}>{group.section}</h3>
                        <ul>
                            {group.items.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => isActive ? styles.active : ''}
                                    >
                                        <span className={styles.icon}>{item.icon}</span>
                                        <span className={styles.name}>{item.name}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
