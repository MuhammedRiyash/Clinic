import React from 'react';
import styles from './StatCard.module.css';
import { MoreHorizontal, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, trend }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.title}>{title}</span>
                <button className={styles.moreBtn}><MoreHorizontal size={16} /></button>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.valueRow}>
                    <span className={styles.value}>{value.toLocaleString()}</span>
                    <div className={styles.trend}>
                        <span className={styles.trendValue}>{trend}</span>
                        <TrendingUp size={14} className={styles.trendIcon} />
                    </div>
                </div>
                <div className={styles.miniChart}>
                    {/* Mock mini chart - in real app, use a small Sparkline */}
                    <svg viewBox="0 0 100 30" className={styles.sparkline}>
                        <path d="M0,25 Q15,10 30,20 T60,5 T100,15" fill="none" stroke="#7BB2B8" strokeWidth="2" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
