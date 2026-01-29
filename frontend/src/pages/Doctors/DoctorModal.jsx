import React, { useState, useEffect } from 'react';
import styles from './DoctorModal.module.css';
import { X } from 'lucide-react';

const DoctorModal = ({ doctor, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        dob: '',
        email: '',
        phone: '',
        status: 'Active'
    });

    useEffect(() => {
        if (doctor) {
            setFormData({
                ...doctor,
                dob: new Date(doctor.dob).toISOString().split('T')[0]
            });
        }
    }, [doctor]);

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
                    <h2>{doctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Specialty</label>
                        <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} required />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Date of Birth</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Profile Image</label>
                        <input type="file" name="image" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} accept="image/*" />
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>Save Doctor</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorModal;
