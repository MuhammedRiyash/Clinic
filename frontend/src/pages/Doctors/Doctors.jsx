import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Doctors.module.css';
import DoctorTable from '../../components/Doctors/DoctorTable';
import DoctorModal from './DoctorModal';
import { Plus } from 'lucide-react';

import { useDebounce } from '../../hooks/useDebounce';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('All');
    const debouncedSearch = useDebounce(search, 500);

    const fetchDoctors = async (query = '', spec = 'All') => {
        try {
            let url = `/doctors?search=${query}`;
            if (spec && spec !== 'All') url += `&specialty=${spec}`;
            const res = await api.get(url);
            setDoctors(res.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors(debouncedSearch, specialty);
    }, [debouncedSearch, specialty]);

    const handleCreate = () => {
        setEditingDoctor(null);
        setIsModalOpen(true);
    };

    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await api.delete(`/doctors/${id}`);
                fetchDoctors();
            } catch (err) {
                console.error('Error deleting doctor:', err);
            }
        }
    };

    const handleSave = async (doctorData) => {
        try {
            const formData = new FormData();
            Object.keys(doctorData).forEach(key => {
                if (key === 'image' && doctorData[key]) {
                    formData.append('image', doctorData[key]);
                } else if (doctorData[key] !== null && doctorData[key] !== undefined) {
                    formData.append(key, doctorData[key]);
                }
            });

            if (editingDoctor) {
                await api.put(`/doctors/${editingDoctor.id}`, formData);
            } else {
                await api.post('/doctors', formData);
            }
            setIsModalOpen(false);
            fetchDoctors();
        } catch (err) {
            console.error('Error saving doctor:', err);
            alert('Error saving doctor. Please check your data.');
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
            await api.put(`/doctors/${id}`, { status: newStatus });
            fetchDoctors();
        } catch (err) {
            console.error('Error toggling status:', err);
        }
    };

    if (loading) return <div>Loading Doctors...</div>;

    return (
        <div className={styles.doctorsPage}>
            <header className={styles.header}>
                <div className={styles.titleInfo}>
                    <h1>Doctors Overview</h1>
                    <p>Last 12 Months</p>
                </div>
                <button className={styles.addBtn} onClick={handleCreate}>
                    <Plus size={20} /> Add Doctor
                </button>
            </header>

            <DoctorTable
                doctors={doctors}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
                onSearch={setSearch}
                onFilterChange={setSpecialty}
                currentFilter={specialty}
            />

            {isModalOpen && (
                <DoctorModal
                    doctor={editingDoctor}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Doctors;
