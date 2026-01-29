import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import styles from './Inventory.module.css';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await api.get('/inventory');
                setItems(res.data);
            } catch (err) {
                console.error('Error fetching inventory:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const columns = ['Item Name', 'Category', 'Quantity', 'Unit Price', 'Expiry Date', 'Supplier'];

    const renderRow = (item) => (
        <>
            <td>{item.itemName}</td>
            <td>{item.category}</td>
            <td>{item.quantity}</td>
            <td>₹ {item.unitPrice}</td>
            <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
            <td>{item.supplier || 'N/A'}</td>
        </>
    );

    if (loading) return <div>Loading Inventory...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Inventory Management <span>/ Stocks</span></h1>
                <button className={styles.addBtn}>+ Add Item</button>
            </header>

            <SharedTable
                title="Stock Overview"
                columns={columns}
                data={items}
                renderRow={renderRow}
            />
        </div>
    );
};

export default Inventory;
