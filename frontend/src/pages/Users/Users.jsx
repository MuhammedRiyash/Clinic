import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Users.module.css';
import { Pencil, Trash2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('All');
    const debouncedSearch = useDebounce(search, 500);

    const handleDelete = async (id) => {
        if (window.confirm('Remove this user?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        }
    };

    const fetchUsers = async (query = '', r = 'All') => {
        setLoading(true);
        try {
            let url = `/users?search=${query}`;
            if (r && r !== 'All') url += `&role=${r}`;
            const res = await api.get(url);
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(debouncedSearch, role);
    }, [debouncedSearch, role]);

    const columns = ['Name', 'Email Address', 'Role', 'Status', 'Joined Date', 'Action'];

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
            <td>
                <div className={styles.actions}>
                    <button className={styles.editBtn} title="Edit User"><Pencil size={16} /></button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(user.id)} title="Remove User"><Trash2 size={16} /></button>
                </div>
            </td>
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
                onSearch={setSearch}
                filterOptions={[
                    { value: 'All', label: 'All Roles' },
                    { value: 'Admin', label: 'Admin' },
                    { value: 'Staff', label: 'Staff' },
                    { value: 'Doctor', label: 'Doctor' }
                ]}
                onFilterChange={setRole}
                currentFilter={role}
            />
        </div>
    );
};

export default Users;
