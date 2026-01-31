import React from 'react';
import styles from './SharedTable.module.css';
import { ChevronDown, Search, Filter } from 'lucide-react';

const SharedTable = ({
    title,
    columns,
    data,
    renderRow,
    onSearch,
    loading,
    filterOptions,
    onFilterChange,
    currentFilter
}) => {
    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <h2>{title}</h2>
                <div className={styles.controls}>
                    {onSearch && (
                        <div className={styles.searchBox}>
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </div>
                    )}
                    {filterOptions && (
                        <div className={styles.filterBox}>
                            <Filter size={16} />
                            <select
                                value={currentFilter}
                                onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
                                className={styles.filterSelect}
                            >
                                {filterOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.tableWrapper}>
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
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px' }}>
                                    Loading data...
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td><input type="checkbox" /> {(index + 1).toString().padStart(2, '0')}</td>
                                    {renderRow(item, index)}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px' }}>
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SharedTable;
