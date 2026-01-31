import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SharedTable from '../../components/Common/SharedTable';
import InventoryModal from './InventoryModal';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Inventory.module.css';
import { Pencil, Trash2 } from 'lucide-react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const debouncedSearch = useDebounce(search, 500);

    const fetchInventory = async (query = '', cat = 'All') => {
        setLoading(true);
        try {
            let url = `/inventory?search=${query}`;
            if (cat && cat !== 'All') url += `&category=${cat}`;
            const res = await api.get(url);
            setItems(res.data);
        } catch (err) {
            console.error('Error fetching inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory(debouncedSearch, category);
    }, [debouncedSearch, category]);

    const handleSave = async (formData) => {
        try {
            if (selectedItem) {
                await api.put(`/inventory/${selectedItem.id}`, formData);
            } else {
                await api.post('/inventory', formData);
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            fetchInventory();
        } catch (err) {
            console.error('Error saving inventory item:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/inventory/${id}`);
                fetchInventory();
            } catch (err) {
                console.error('Error deleting item:', err);
            }
        }
    };

    const columns = ['Item Name', 'Category', 'Quantity', 'Unit Price', 'Expiry Date', 'Supplier', 'Actions'];

    const renderRow = (item) => (
        <>
            <td>{item.itemName}</td>
            <td>{item.category}</td>
            <td className={item.quantity < 10 ? styles.lowStock : ''}>{item.quantity}</td>
            <td>₹ {item.unitPrice}</td>
            <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
            <td>{item.supplier || 'N/A'}</td>
            <td>
                <div className={styles.actions}>
                    <button onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} className={styles.editBtn}>
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Inventory Management <span>/ Stocks</span></h1>
                <button className={styles.addBtn} onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                    + Add Item
                </button>
            </header>

            <SharedTable
                title="Stock Overview"
                columns={columns}
                data={items}
                renderRow={renderRow}
                loading={loading}
                onSearch={setSearch}
                filterOptions={[
                    { value: 'All', label: 'All Categories' },
                    { value: 'Medicines', label: 'Medicines' },
                    { value: 'Equipment', label: 'Equipment' },
                    { value: 'Supplies', label: 'Supplies' },
                    { value: 'Dental', label: 'Dental Supplies' }
                ]}
                onFilterChange={setCategory}
                currentFilter={category}
            />

            {isModalOpen && (
                <InventoryModal
                    item={selectedItem}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Inventory;
