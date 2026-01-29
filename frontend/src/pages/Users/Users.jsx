import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Users.module.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const columns = ['Name', 'Email Address', 'Role', 'Status', 'Joined Date'];

    const renderRow = (user) => (
        <>
            <td className={styles.nameCell}>
                <img src={user.imagePath ? `${import.meta.env.VITE_IMAGE_HOST || ''}${user.imagePath}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={user.name} />
                <span>{user.name}</span>
            </td>
            <td>{user.email}</td>
            <td>
                <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>
                    {user.role}
                </span>
            </td>
            <td><span className={styles.activeStatus}>Active</span></td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
        </>
    );

    if (loading) return <div>Loading Users...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>User Management <span>/ Administration</span></h1>
                <button className={styles.addBtn}>+ Add User</button>
            </header>

            <SharedTable
                title="System Users"
                columns={columns}
                data={users}
                renderRow={renderRow}
            />
        </div>
    );
};

export default Users;
