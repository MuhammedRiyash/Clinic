import React, { useState, useEffect } from 'react';
import styles from './AppointmentModal.module.css';
import { X } from 'lucide-react';
import api from '../../services/api';

const AppointmentModal = ({ appointment, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentDate: new Date().toISOString().slice(0, 16),
        status: 'Scheduled',
        reason: ''
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes] = await Promise.all([
                    api.get('/patients'),
                    api.get('/doctors')
                ]);
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
            } catch (err) {
                console.error('Error fetching data for appointment:', err);
            }
        };
        fetchData();

        if (appointment) {
            setFormData({
                ...appointment,
                appointmentDate: new Date(appointment.appointmentDate).toISOString().slice(0, 16)
            });
        }
    }, [appointment]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            appointmentDate: new Date(formData.appointmentDate).toISOString()
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{appointment ? 'Reschedule Appointment' : 'Book New Appointment'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Patient</label>
                            <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                                <option value="">-- Select Patient --</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Doctor</label>
                            <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                                <option value="">-- Select Doctor --</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Date & Time</label>
                            <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Reason for Visit</label>
                        <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="e.g. Regular Checkup"></textarea>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>Save Appointment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentModal;
