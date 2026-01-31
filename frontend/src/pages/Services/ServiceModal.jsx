import React, { useState, useEffect } from 'react';
import styles from './ServiceModal.module.css';
import { X } from 'lucide-react';

const ServiceModal = ({ service, onClose, onSave, defaultCategory }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: defaultCategory || 'Medical',
        price: '',
        description: ''
    });

    useEffect(() => {
        if (service) {
            setFormData(service);
        }
    }, [service]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) || 0 : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Service Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Routine Checkup"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="Medical">Medical</option>
                            <option value="Dental">Dental</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Price (₹) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            placeholder="500"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Brief description of the service..."
                        ></textarea>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>Save Service</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceModal;
