import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import styles from './Chats.module.css';
import { Send, User, Search, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Chats = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/messages/contacts');
            setContacts(res.data);
        } catch (err) {
            console.error('Error fetching contacts:', err);
        }
    };

    const fetchMessages = async () => {
        if (!activeContact) return;
        try {
            const res = await api.get(`/messages/${activeContact.id}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (activeContact) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [activeContact]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeContact) return;

        try {
            const res = await api.post('/messages', {
                receiverId: activeContact.id,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.chatContainer}>
            <div className={styles.sidebar}>
                <div className={styles.search}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.contactList}>
                    {filteredContacts.length === 0 ? (
                        <div className={styles.empty}>No contacts found</div>
                    ) : (
                        filteredContacts.map(c => (
                            <div
                                key={c.id}
                                className={`${styles.contactItem} ${activeContact?.id === c.id ? styles.active : ''}`}
                                onClick={() => setActiveContact(c)}
                            >
                                <div className={styles.avatar}>
                                    {c.imagePath ? (
                                        <img src={`${import.meta.env.VITE_IMAGE_HOST || ''}${c.imagePath}`} alt={c.name} />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className={styles.contactInfo}>
                                    <h4>{c.name}</h4>
                                    <p>{c.role}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className={styles.mainChat}>
                {activeContact ? (
                    <>
                        <div className={styles.chatHeader}>
                            <div className={styles.headerInfo}>
                                <h4>{activeContact.name}</h4>
                                <span>{activeContact.role}</span>
                            </div>
                        </div>
                        <div className={styles.messages}>
                            {messages.map(m => (
                                <div key={m.id} className={`${styles.message} ${m.senderId === user.id ? styles.sent : styles.received}`}>
                                    <div className={styles.bubble}>
                                        <p>{m.content}</p>
                                        <span className={styles.time}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className={styles.inputArea} onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" disabled={!newMessage.trim()}><Send size={18} /></button>
                        </form>
                    </>
                ) : (
                    <div className={styles.noChat}>
                        <MessageSquare size={48} />
                        <p>Select a contact to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chats;
