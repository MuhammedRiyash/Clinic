import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Services.module.css';

const Services = ({ category }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const handleCreate = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this service?')) {
            try {
                await api.delete(`/services/${id}`);
                fetchServices();
            } catch (err) {
                console.error('Error deleting service:', err);
            }
        }
    };

    const handleSave = async (serviceData) => {
        try {
            if (editingService) {
                await api.put(`/services/${editingService.id}`, serviceData);
            } else {
                await api.post('/services', serviceData);
            }
            setIsModalOpen(false);
            fetchServices();
        } catch (err) {
            console.error('Error saving service:', err);
        }
    };

    const columns = ['Service Name', 'Category', 'Price', 'Description', 'Action'];

    const renderRow = (service) => (
        <>
            <td className={styles.nameCell}>
                <span>{service.name}</span>
            </td>
            <td>
                <span className={`${styles.categoryBadge} ${styles[service.category.toLowerCase()]}`}>
                    {service.category}
                </span>
            </td>
            <td>₹{service.price.toLocaleString()}</td>
            <td>{service.description || '-'}</td>
            <td>
                <button className={styles.editBtn} onClick={() => handleEdit(service)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(service.id)}>Delete</button>
            </td>
        </>
    );

    if (loading) return <div>Loading Services...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Clinic Services <span>/ Medical & Dental</span></h1>
                <button className={styles.addBtn} onClick={handleCreate}>+ Add Service</button>
            </header>

            <SharedTable
                title="Service Catalog"
                columns={columns}
                data={services}
                renderRow={renderRow}
            />

            {isModalOpen && (
                <ServiceModal
                    service={editingService}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Services;
