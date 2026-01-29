import React, { useState, useEffect } from 'react';
import styles from './ServiceModal.module.css';
import { X } from 'lucide-react';

const ServiceModal = ({ service, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Medical',
        price: '',
        description: ''
    });

    useEffect(() => {
        if (service) {
            setFormData(service);
        }
    }, [service]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: parseFloat(formData.price)
        });
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
                        <label>Service Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Blood Test" />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="Medical">Medical</option>
                                <option value="Dental">Dental</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Pharmacy">Pharmacy</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Base Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
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
