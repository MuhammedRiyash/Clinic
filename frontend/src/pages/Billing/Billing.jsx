import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Billing.module.css';

import BillingModal from './BillingModal';

const Billing = () => {
    const [billings, setBillings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBilling, setEditingBilling] = useState(null);

    const fetchBillings = async () => {
        try {
            const res = await api.get('/billing');
            setBillings(res.data);
        } catch (err) {
            console.error('Error fetching billings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBillings();
    }, []);

    const handleCreate = () => {
        setEditingBilling(null);
        setIsModalOpen(true);
    };

    const handleEdit = (bill) => {
        setEditingBilling(bill);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this invoice?')) {
            try {
                await api.delete(`/billing/${id}`);
                fetchBillings();
            } catch (err) {
                console.error('Error deleting billing:', err);
            }
        }
    };

    const handleSave = async (billingData) => {
        try {
            if (editingBilling) {
                await api.put(`/billing/${editingBilling.id}`, billingData);
            } else {
                await api.post('/billing', billingData);
            }
            setIsModalOpen(false);
            fetchBillings();
        } catch (err) {
            console.error('Error saving billing:', err);
        }
    };

    const columns = ['Patient Name', 'Amount', 'Status', 'Method', 'Date', 'Action'];

    const renderRow = (bill) => (
        <>
            <td className={styles.nameCell}>
                <span>{bill.patient?.name || 'Unknown Patient'}</span>
            </td>
            <td>₹{bill.amount.toLocaleString()}</td>
            <td>
                <span className={`${styles.statusBadge} ${styles[bill.status.toLowerCase().replace(' ', '')]}`}>
                    {bill.status}
                </span>
            </td>
            <td>{bill.paymentMethod}</td>
            <td>{new Date(bill.invoiceDate).toLocaleDateString()}</td>
            <td>
                <button className={styles.editBtn} onClick={() => handleEdit(bill)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(bill.id)}>Delete</button>
            </td>
        </>
    );

    if (loading) return <div>Loading Billing...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Billing & Invoices <span>/ Financials</span></h1>
                <button className={styles.addBtn} onClick={handleCreate}>+ Create Invoice</button>
            </header>

            <SharedTable
                title="Recent Transactions"
                columns={columns}
                data={billings}
                renderRow={renderRow}
            />

            {isModalOpen && (
                <BillingModal
                    billing={editingBilling}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Billing;
