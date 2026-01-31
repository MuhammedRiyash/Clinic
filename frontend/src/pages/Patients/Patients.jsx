import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import PatientModal from './PatientModal';
import styles from './Patients.module.css';
import { useDebounce } from '../../hooks/useDebounce';
import { Pencil, Trash2 } from 'lucide-react';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [search, setSearch] = useState('');
    const [gender, setGender] = useState('All');
    const debouncedSearch = useDebounce(search, 500);

    const fetchPatients = async (query = '', gen = 'All') => {
        try {
            let url = `/patients?search=${query}`;
            if (gen && gen !== 'All') url += `&gender=${gen}`;
            const res = await api.get(url);
            setPatients(res.data);
        } catch (err) {
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients(debouncedSearch, gender);
    }, [debouncedSearch, gender]);

    const handleCreate = () => {
        setEditingPatient(null);
        setIsModalOpen(true);
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient record?')) {
            try {
                await api.delete(`/patients/${id}`);
                fetchPatients();
            } catch (err) {
                console.error('Error deleting patient:', err);
            }
        }
    };

    const handleSave = async (patientData) => {
        try {
            if (editingPatient) {
                await api.put(`/patients/${editingPatient.id}`, patientData);
            } else {
                await api.post('/patients', patientData);
            }
            setIsModalOpen(false);
            fetchPatients();
        } catch (err) {
            console.error('Error saving patient:', err);
        }
    };

    const columns = ['Name', 'Gender', 'DOB', 'Email', 'Blood Group', 'Contact', 'Action'];

    const renderRow = (patient) => (
        <>
            <td className={styles.nameCell}>
                <img src={`https://ui-avatars.com/api/?name=${patient.name}&background=random`} alt={patient.name} />
                <span>{patient.name}</span>
            </td>
            <td>{patient.gender}</td>
            <td>{new Date(patient.dob).toLocaleDateString()}</td>
            <td>{patient.email}</td>
            <td>{patient.bloodGroup}</td>
            <td>{patient.phone}</td>
            <td>
                <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(patient)} title="Edit Patient">
                        <Pencil size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(patient.id)} title="Delete Patient Record">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </>
    );

    if (loading) return <div>Loading Patients...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Patients List <span>/ Overview</span></h1>
                <button className={styles.addBtn} onClick={handleCreate}>+ Add Patient</button>
            </header>

            <SharedTable
                title="Clinical Patients"
                columns={columns}
                data={patients}
                renderRow={renderRow}
                onSearch={setSearch}
                filterOptions={[
                    { value: 'All', label: 'All Genders' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                ]}
                onFilterChange={setGender}
                currentFilter={gender}
            />

            {isModalOpen && (
                <PatientModal
                    patient={editingPatient}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Patients;
