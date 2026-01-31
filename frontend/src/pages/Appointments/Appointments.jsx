import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Appointments.module.css';
import { useDebounce } from '../../hooks/useDebounce';
import AppointmentModal from './AppointmentModal';
import { Pencil, Trash2, CalendarClock, XCircle } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const debouncedSearch = useDebounce(search, 500);

    const fetchAppointments = async (query = '', stat = 'All') => {
        try {
            let url = `/appointments?search=${query}`;
            if (stat && stat !== 'All') url += `&status=${stat}`;
            const res = await api.get(url);
            setAppointments(res.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(debouncedSearch, status);
    }, [debouncedSearch, status]);

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
                <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(apt)} title="Reschedule">
                        <CalendarClock size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(apt.id)} title="Cancel Appointment">
                        <XCircle size={16} />
                    </button>
                </div>
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
                filterOptions={[
                    { value: 'All', label: 'All Status' },
                    { value: 'Scheduled', label: 'Scheduled' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Cancelled', label: 'Cancelled' }
                ]}
                onFilterChange={setStatus}
                currentFilter={status}
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
