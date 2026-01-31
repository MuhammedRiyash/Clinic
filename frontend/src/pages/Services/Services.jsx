import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import ServiceModal from './ServiceModal';
import { Pencil, Trash2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const Services = ({ category }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const fetchServices = async (query = '') => {
        setLoading(true);
        try {
            let url = category ? `/services?category=${category}` : '/services?category=All';
            if (query) url += `&search=${query}`;
            const res = await api.get(url);
            setServices(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices(debouncedSearch);
    }, [category, debouncedSearch]);

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
                <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(service)} title="Edit Service">
                        <Pencil size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(service.id)} title="Delete Service">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{category ? `${category} Services` : 'Clinic Services'} <span>/ Speciality Care</span></h1>
                <button className={styles.addBtn} onClick={handleCreate}>+ Add Service</button>
            </header>

            <SharedTable
                title={category ? `${category} Catalog` : "Full Service Catalog"}
                columns={columns}
                data={services}
                renderRow={renderRow}
                loading={loading}
                onSearch={setSearch}
            />

            {isModalOpen && (
                <ServiceModal
                    service={editingService}
                    defaultCategory={category}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Services;
