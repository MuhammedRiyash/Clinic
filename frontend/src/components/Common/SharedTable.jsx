import React from 'react';
import styles from './SharedTable.module.css';
import { ChevronDown, Search, Filter } from 'lucide-react';

const SharedTable = ({ title, columns, data, renderRow, onSearch }) => {
    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <h2>{title}</h2>
                <div className={styles.controls}>
                    <div className={styles.searchBox}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => onSearch && onSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterBox}>
                        <span>Filter By</span>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th><input type="checkbox" /> No <ChevronDown size={14} /></th>
                        {columns.map((col, idx) => (
                            <th key={idx}>{col} <ChevronDown size={14} /></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id || index}>
                            <td><input type="checkbox" /> {(index + 1).toString().padStart(2, '0')}</td>
                            {renderRow(item, index)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SharedTable;
