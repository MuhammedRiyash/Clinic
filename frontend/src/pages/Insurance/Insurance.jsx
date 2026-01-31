import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Insurance.module.css';

import InsuranceModal from './InsuranceModal';
import { Pencil, Trash2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const Insurance = () => {
    const [insurance, setInsurance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const debouncedSearch = useDebounce(search, 500);

    const fetchInsurance = async (query = '', stat = 'All') => {
        setLoading(true);
        try {
            let url = `/insurance?search=${query}`;
            if (stat && stat !== 'All') url += `&status=${stat}`;
            const res = await api.get(url);
            setInsurance(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching insurance:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsurance(debouncedSearch, status);
    }, [debouncedSearch, status]);

    const handleSave = async (formData) => {
        try {
            if (selectedPolicy) {
                await api.put(`/insurance/${selectedPolicy.id}`, formData);
            } else {
                await api.post('/insurance', formData);
            }
            setIsModalOpen(false);
            fetchInsurance();
        } catch (err) {
            console.error('Error saving insurance:', err);
            throw err;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this insurance policy?')) {
            try {
                await api.delete(`/insurance/${id}`);
                fetchInsurance();
            } catch (err) {
                console.error('Error deleting insurance:', err);
            }
        }
    };

    const columns = ['Provider Name', 'Policy Number', 'Coverage Type', 'Valid Until', 'Status', 'Actions'];

    const renderRow = (ins) => (
        <>
            <td>{ins.providerName}</td>
            <td>{ins.policyNumber}</td>
            <td>{ins.coverageType}</td>
            <td>{new Date(ins.validUntil).toLocaleDateString()}</td>
            <td>
                <span className={`${styles.statusBadge} ${styles[ins.status.toLowerCase()] || ''}`}>
                    {ins.status}
                </span>
            </td>
            <td>
                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={() => { setSelectedPolicy(ins); setIsModalOpen(true); }}><Pencil size={16} /></button>
                    <button className={styles.actionBtn} onClick={() => handleDelete(ins.id)}><Trash2 size={16} /></button>
                </div>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Insurance Management <span>/ Providers</span></h1>
                <button className={styles.addBtn} onClick={() => { setSelectedPolicy(null); setIsModalOpen(true); }}>
                    + Link Insurance
                </button>
            </header>

            <SharedTable
                title="Active Policies"
                columns={columns}
                data={insurance}
                renderRow={renderRow}
                loading={loading}
                onSearch={setSearch}
                filterOptions={[
                    { value: 'All', label: 'All Status' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Expired', label: 'Expired' },
                    { value: 'Pending', label: 'Pending' }
                ]}
                onFilterChange={setStatus}
                currentFilter={status}
            />

            {isModalOpen && (
                <InsuranceModal
                    policy={selectedPolicy}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Insurance;
