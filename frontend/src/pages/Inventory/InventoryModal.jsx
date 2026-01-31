import React, { useState, useEffect } from 'react';
import styles from './InventoryModal.module.css';
import { X } from 'lucide-react';

const InventoryModal = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        itemName: '',
        category: 'Medicine',
        quantity: 0,
        unitPrice: 0,
        expiryDate: '',
        supplier: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                ...item,
                expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : ''
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{item ? 'Edit Item' : 'Add New Item'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Item Name</label>
                        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="Medicine">Medicine</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Consumables">Consumables</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Quantity</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Unit Price (₹)</label>
                            <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} required min="0" step="0.01" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Expiry Date</label>
                            <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Supplier</label>
                        <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} />
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>{item ? 'Update Item' : 'Save Item'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryModal;
