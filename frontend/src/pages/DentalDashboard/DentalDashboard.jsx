import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './DentalDashboard.module.css';
import StatCard from '../../components/Dashboard/StatCard';
import SharedTable from '../../components/Common/SharedTable';
import { Activity, Calendar, Users, DollarSign } from 'lucide-react';

const DentalDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, appointmentsRes] = await Promise.all([
                    api.get('/stats/dental'),
                    api.get('/appointments') // In production, filter by dental doctors
                ]);
                setStats(statsRes.data);
                setAppointments(appointmentsRes.data.slice(0, 5));
            } catch (err) {
                console.error('Error fetching dental data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { title: 'Dental Services', value: stats?.servicesCount || 0, icon: <Activity size={24} />, color: '#2F818E' },
        { title: 'Total Appointments', value: stats?.appointments || 0, icon: <Calendar size={24} />, color: '#3FB1C5' },
        { title: 'Total Patients', value: stats?.patients || 0, icon: <Users size={24} />, color: '#A3D9E2' },
        { title: 'Dental Revenue', value: `$${stats?.revenue?.toLocaleString() || 0}`, icon: <DollarSign size={24} />, color: '#10B981' },
    ];

    const columns = ['Patient', 'Doctor', 'Time', 'Status'];
    const renderRow = (apt) => (
        <>
            <td>{apt.patient?.name}</td>
            <td>{apt.doctor?.name}</td>
            <td>{new Date(apt.appointmentDate).toLocaleTimeString()}</td>
            <td><span className={styles.statusBadge}>{apt.status}</span></td>
        </>
    );

    if (loading) return <div>Loading Dental Dashboard...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Dental Dashboard <span>/ Speciality Overview</span></h1>
                <p>Track metrics and clinical performance for the dental department.</p>
            </header>

            <div className={styles.statsGrid}>
                {statCards.map((card, idx) => (
                    <StatCard key={idx} {...card} />
                ))}
            </div>

            <div className={styles.tableSection}>
                <SharedTable
                    title="Recent Dental Procedures"
                    columns={columns}
                    data={appointments}
                    renderRow={renderRow}
                />
            </div>
        </div>
    );
};

export default DentalDashboard;
