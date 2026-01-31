import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Appointments.module.css';

import { useDebounce } from '../../hooks/useDebounce';

import AppointmentModal from './AppointmentModal';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const fetchAppointments = async (query = '') => {
        try {
            const res = await api.get(`/appointments?search=${query}`);
            setAppointments(res.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(debouncedSearch);
    }, [debouncedSearch]);

    const handleCreate = () => {
        setEditingAppointment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (apt) => {
        setEditingAppointment(apt);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Cancel this appointment?')) {
            try {
                await api.delete(`/appointments/${id}`);
                fetchAppointments();
            } catch (err) {
                console.error('Error deleting appointment:', err);
            }
        }
    };

    const handleSave = async (aptData) => {
        try {
            if (editingAppointment) {
                await api.put(`/appointments/${editingAppointment.id}`, aptData);
            } else {
                await api.post('/appointments', aptData);
            }
            setIsModalOpen(false);
            fetchAppointments();
        } catch (err) {
            console.error('Error saving appointment:', err);
        }
    };

    const columns = ['Patient Name', 'Doctor', 'Date', 'Status', 'Reason', 'Action'];

    const renderRow = (apt) => (
        <>
            <td className={styles.nameCell}>
                <span>{apt.patient?.name || 'Unknown Patient'}</span>
            </td>
            <td>{apt.doctor?.name || 'Unknown Doctor'}</td>
            <td>{new Date(apt.appointmentDate).toLocaleString()}</td>
            <td>
                <span className={`${styles.statusBadge} ${styles[apt.status.toLowerCase()]}`}>
                    {apt.status}
                </span>
            </td>
            <td>{apt.reason || '-'}</td>
            <td>
                <button className={styles.editBtn} onClick={() => handleEdit(apt)}>Reschedule</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(apt.id)}>Cancel</button>
            </td>
        </>
    );

    if (loading) return <div>Loading Appointments...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Appointments <span>/ Visits Schedule</span></h1>
                <button className={styles.addBtn} onClick={handleCreate}>+ New Appointment</button>
            </header>

            <SharedTable
                title="Upcoming Schedule"
                columns={columns}
                data={appointments}
                renderRow={renderRow}
                onSearch={setSearch}
            />

            {isModalOpen && (
                <AppointmentModal
                    appointment={editingAppointment}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Appointments;
