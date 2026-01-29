import React from 'react';
import styles from './DoctorTable.module.css';
import { MoreVertical, Search, Filter, ChevronDown } from 'lucide-react';

const DoctorTable = ({ doctors, onEdit, onDelete, onStatusToggle }) => {
    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <h2>Doctors Overview</h2>
                <div className={styles.controls}>
                    <div className={styles.searchBox}>
                        <Search size={16} />
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className={styles.filterBox}>
                        <span>Heart Surgeon</span>
                        <ChevronDown size={16} />
                    </div>
                    <div className={styles.timeBox}>
                        <span>Last 12 Months</span>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th><input type="checkbox" /> No <ChevronDown size={14} /></th>
                        <th>Name <ChevronDown size={14} /></th>
                        <th>Specialty <ChevronDown size={14} /></th>
                        <th>DOB <ChevronDown size={14} /></th>
                        <th>Email Address <ChevronDown size={14} /></th>
                        <th>Status <ChevronDown size={14} /></th>
                        <th>Contact <ChevronDown size={14} /></th>
                        <th>Action <ChevronDown size={14} /></th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor, index) => (
                        <tr key={doctor.id}>
                            <td><input type="checkbox" /> {(index + 1).toString().padStart(2, '0')}</td>
                            <td className={styles.nameCell}>
                                <img
                                    src={doctor.imagePath ? `${import.meta.env.VITE_IMAGE_HOST || 'http://localhost:5000'}${doctor.imagePath}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`}
                                    alt={doctor.name}
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`; }}
                                />
                                <span>{doctor.name}</span>
                            </td>
                            <td>{doctor.specialty}</td>
                            <td>{new Date(doctor.dob).toLocaleDateString()}</td>
                            <td>{doctor.email}</td>
                            <td>
                                <span className={`${styles.statusBadge} ${styles[doctor.status.toLowerCase()]}`}>
                                    {doctor.status}
                                </span>
                            </td>
                            <td>{doctor.phone}</td>
                            <td>
                                <div className={styles.actions}>
                                    <button className={styles.editBtn} onClick={() => onEdit(doctor)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => onDelete(doctor.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorTable;
