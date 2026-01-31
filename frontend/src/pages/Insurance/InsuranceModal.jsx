import React, { useState, useEffect } from 'react';
import styles from './InsuranceModal.module.css';
import { X } from 'lucide-react';
import api from '../../services/api';

const InsuranceModal = ({ policy, onClose, onSave }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        policyNumber: '',
        providerName: '',
        coverageType: '',
        validUntil: '',
        patientId: '',
        status: 'Active'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/patients');
                setPatients(Array.isArray(res.data) ? res.data : []);
                if (policy) {
                    setFormData({
                        ...policy,
                        validUntil: policy.validUntil ? new Date(policy.validUntil).toISOString().split('T')[0] : ''
                    });
                }
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to load patients list.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [policy]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await onSave(formData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save insurance. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{policy ? 'Edit Insurance' : 'Link New Insurance'}</h2>
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
                            <label>Provider Name *</label>
                            <input
                                type="text"
                                name="providerName"
                                value={formData.providerName}
                                onChange={handleChange}
                                placeholder="e.g. Blue Cross"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Policy Number *</label>
                            <input
                                type="text"
                                name="policyNumber"
                                value={formData.policyNumber}
                                onChange={handleChange}
                                placeholder="POL-123456"
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Coverage Type *</label>
                                <input
                                    type="text"
                                    name="coverageType"
                                    value={formData.coverageType}
                                    onChange={handleChange}
                                    placeholder="Full, Health Only, etc."
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Valid Until *</label>
                            <input
                                type="date"
                                name="validUntil"
                                value={formData.validUntil}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.footer}>
                            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={submitting}>Cancel</button>
                            <button type="submit" className={styles.saveBtn} disabled={submitting}>
                                {submitting ? 'Saving...' : (policy ? 'Update Policy' : 'Link Insurance')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default InsuranceModal;
