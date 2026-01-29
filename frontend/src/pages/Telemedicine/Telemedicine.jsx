import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Telemedicine.module.css';
import { Video } from 'lucide-react';

const Telemedicine = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSessions([
            { id: 1, patient: 'John Doe', doctor: 'Dr. Amit Mishra', time: '10:30 AM', status: 'Live' },
            { id: 2, patient: 'Jane Smith', doctor: 'Dr. Sarah Smith', time: '11:45 AM', status: 'Scheduled' },
        ]);
        setLoading(false);
    }, []);

    const columns = ['Patient Name', 'Doctor', 'Scheduled Time', 'Status', 'Action'];

    const renderRow = (session) => (
        <>
            <td>{session.patient}</td>
            <td>{session.doctor}</td>
            <td>{session.time}</td>
            <td>
                <span className={`${styles.statusBadge} ${session.status === 'Live' ? styles.live : styles.scheduled}`}>
                    {session.status}
                </span>
            </td>
            <td>
                <button className={styles.joinBtn}>
                    <Video size={14} /> Join Call
                </button>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Telemedicine <span>/ Virtual Consultations</span></h1>
                <button className={styles.addBtn}>+ Start New Session</button>
            </header>

            <SharedTable
                title="Virtual Appointments"
                columns={columns}
                data={sessions}
                renderRow={renderRow}
            />
        </div>
    );
};

export default Telemedicine;
