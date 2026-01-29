import React, { useState, useEffect } from 'react';
import styles from './BillingModal.module.css';
import { X } from 'lucide-react';
import api from '../../services/api';

const BillingModal = ({ billing, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        amount: '',
        status: 'Unpaid',
        paymentMethod: 'Cash',
        invoiceDate: new Date().toISOString().split('T')[0]
    });

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientsRes = await api.get('/patients');
                setPatients(patientsRes.data);
            } catch (err) {
                console.error('Error fetching data for billing:', err);
            }
        };
        fetchData();

        if (billing) {
            setFormData({
                ...billing,
                invoiceDate: new Date(billing.invoiceDate).toISOString().split('T')[0]
            });
        }
    }, [billing]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            amount: parseFloat(formData.amount),
            invoiceDate: new Date(formData.invoiceDate).toISOString()
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{billing ? 'Edit Invoice' : 'Create New Invoice'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Select Patient</label>
                        <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                            <option value="">-- Choose Patient --</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Amount (₹)</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Invoice Date</label>
                            <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Payment Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Partially Paid">Partially Paid</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Payment Method</label>
                            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>Generate Invoice</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BillingModal;
