import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import TelemedicineModal from './TelemedicineModal';
import styles from './Telemedicine.module.css';
import { Video } from 'lucide-react';

const Telemedicine = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/telemedicine');
            setSessions(res.data);
        } catch (err) {
            console.error('Error fetching telemedicine sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleSave = async (formData) => {
        try {
            await api.post('/telemedicine', formData);
            setIsModalOpen(false);
            fetchSessions();
        } catch (err) {
            console.error('Error creating session:', err);
        }
    };

    const columns = ['Patient Name', 'Doctor', 'Scheduled Time', 'Status', 'Action'];

    const renderRow = (session) => (
        <>
            <td>{session.patient?.name}</td>
            <td>{session.doctor?.name}</td>
            <td>{new Date(session.appointmentDate).toLocaleString()}</td>
            <td>
                <span className={`${styles.statusBadge} ${session.status === 'Live' ? styles.live : styles.scheduled}`}>
                    {session.status}
                </span>
            </td>
            <td>
                <button
                    className={styles.joinBtn}
                    onClick={() => window.open(session.meetingLink, '_blank')}
                    disabled={!session.meetingLink}
                >
                    <Video size={14} /> Join Call
                </button>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Telemedicine <span>/ Virtual Consultations</span></h1>
                <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>+ Start New Session</button>
            </header>

            <SharedTable
                title="Virtual Appointments"
                columns={columns}
                data={sessions}
                renderRow={renderRow}
                loading={loading}
            />

            {isModalOpen && (
                <TelemedicineModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Telemedicine;
