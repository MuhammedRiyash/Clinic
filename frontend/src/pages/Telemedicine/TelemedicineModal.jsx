import React, { useState, useEffect } from 'react';
import styles from './TelemedicineModal.module.css';
import { X } from 'lucide-react';
import api from '../../services/api';

const TelemedicineModal = ({ onClose, onSave }) => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        meetingLink: '',
        reason: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, dRes] = await Promise.all([
                    api.get('/patients'),
                    api.get('/doctors')
                ]);
                setPatients(Array.isArray(pRes.data) ? pRes.data : []);
                setDoctors(Array.isArray(dRes.data) ? dRes.data : []);
            } catch (err) {
                console.error('Error fetching modal data:', err);
                setError('Failed to load patient or doctor lists.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setError(null);
        try {
            await onSave(formData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create session. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>Schedule Virtual Consultation</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}

                {loading ? (
                    <div className={styles.loading}>Loading data...</div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Patient *</label>
                            <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Doctor *</label>
                            <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                                <option value="">Select Doctor</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Scheduled Date & Time *</label>
                            <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Meeting Link (Optional)</label>
                            <input
                                type="url"
                                name="meetingLink"
                                value={formData.meetingLink}
                                onChange={handleChange}
                                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                            />
                            <p className={styles.helperText}>Leave empty to auto-generate a secure Tectra Meet link.</p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Reason / Notes</label>
                            <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Symptoms, purpose of visit..."></textarea>
                        </div>

                        <div className={styles.footer}>
                            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={submitting}>Cancel</button>
                            <button type="submit" className={styles.saveBtn} disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Session'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TelemedicineModal;
