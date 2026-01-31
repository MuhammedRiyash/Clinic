import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Billing.module.css';
import BillingModal from './BillingModal';
import { Pencil, Trash2, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const Billing = () => {
    const [billings, setBillings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBilling, setEditingBilling] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const debouncedSearch = useDebounce(search, 500);

    const fetchBillings = async (query = '', stat = 'All') => {
        setLoading(true);
        try {
            let url = `/billing?search=${query}`;
            if (stat && stat !== 'All') url += `&status=${stat}`;
            const res = await api.get(url);
            setBillings(res.data);
        } catch (err) {
            console.error('Error fetching billings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBillings(debouncedSearch, status);
    }, [debouncedSearch, status]);

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
                <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(bill)} title="Edit Invoice">
                        <Pencil size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(bill.id)} title="Delete Invoice">
                        <Trash2 size={16} />
                    </button>
                </div>
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
                onSearch={setSearch}
                filterOptions={[
                    { value: 'All', label: 'All Status' },
                    { value: 'Paid', label: 'Paid' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Overdue', label: 'Overdue' }
                ]}
                onFilterChange={setStatus}
                currentFilter={status}
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
