import React, { useState, useEffect } from 'react';
import styles from './TelemedicineModal.module.css';
import { X } from 'lucide-react';
import api from '../../services/api';

const TelemedicineModal = ({ onClose, onSave }) => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        reason: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, dRes] = await Promise.all([
                    api.get('/patients'),
                    api.get('/doctors')
                ]);
                setPatients(pRes.data);
                setDoctors(dRes.data);
            } catch (err) {
                console.error('Error fetching modal data:', err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>Schedule Virtual Consultation</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Patient</label>
                        <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                            <option value="">Select Patient</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Doctor</label>
                        <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                            <option value="">Select Doctor</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Scheduled Date & Time</label>
                        <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Reason / Notes</label>
                        <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3"></textarea>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>Create Session</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TelemedicineModal;
