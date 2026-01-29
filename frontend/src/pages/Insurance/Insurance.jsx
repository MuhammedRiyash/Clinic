import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Insurance.module.css';

const Insurance = () => {
    const [insurance, setInsurance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsurance = async () => {
            try {
                // Mocking data for now as CRUD is ready but might be empty
                const res = await api.get('/stats/distribution'); // Reusing for demo if needed
                setInsurance([
                    { id: 1, provider: 'Global Health', policy: 'POL-99128', type: 'Full Coverage', status: 'Active' },
                    { id: 2, provider: 'Safe Life', policy: 'POL-88221', type: 'Health Only', status: 'Active' },
                ]);
            } catch (err) {
                console.error('Error fetching insurance:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInsurance();
    }, []);

    const columns = ['Provider Name', 'Policy Number', 'Coverage Type', 'Status'];

    const renderRow = (ins) => (
        <>
            <td>{ins.provider}</td>
            <td>{ins.policy}</td>
            <td>{ins.type}</td>
            <td>
                <span className={`${styles.statusBadge} active`}>
                    {ins.status}
                </span>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Insurance Management <span>/ Providers</span></h1>
                <button className={styles.addBtn}>+ Link Insurance</button>
            </header>

            <SharedTable
                title="Active Policies"
                columns={columns}
                data={insurance}
                renderRow={renderRow}
            />
        </div>
    );
};

export default Insurance;
