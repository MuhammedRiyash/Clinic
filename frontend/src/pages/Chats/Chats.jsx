import React, { useState } from 'react';
import styles from './Chats.module.css';
import { Send, User } from 'lucide-react';

const Chats = () => {
    const [contacts] = useState([
        { id: 1, name: 'Dr. Amit Mishra', lastMsg: 'I have reviewed the report.', time: '10 min ago', online: true },
        { id: 2, name: 'John Doe', lastMsg: 'Thank you doctor!', time: '1 hour ago', online: false },
    ]);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.sidebar}>
                <div className={styles.search}>
                    <input type="text" placeholder="Search chats..." />
                </div>
                <div className={styles.contactList}>
                    {contacts.map(c => (
                        <div key={c.id} className={styles.contactItem}>
                            <div className={styles.avatar}>
                                <User size={20} />
                                {c.online && <span className={styles.onlineDot}></span>}
                            </div>
                            <div className={styles.contactInfo}>
                                <h4>{c.name}</h4>
                                <p>{c.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.mainChat}>
                <div className={styles.chatHeader}>
                    <h4>Dr. Amit Mishra</h4>
                    <span>Active 5 mins ago</span>
                </div>
                <div className={styles.messages}>
                    <div className={`${styles.message} ${styles.received}`}>
                        <p>Hello, have you seen the new patient records?</p>
                    </div>
                    <div className={`${styles.message} ${styles.sent}`}>
                        <p>Yes, I am looking at them now.</p>
                    </div>
                </div>
                <div className={styles.inputArea}>
                    <input type="text" placeholder="Type a message..." />
                    <button><Send size={18} /></button>
                </div>
            </div>
        </div>
    );
};

export default Chats;
