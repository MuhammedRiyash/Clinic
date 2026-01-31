import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Dashboard.module.css';
import StatCard from '../../components/Dashboard/StatCard';
import DoctorTable from '../../components/Doctors/DoctorTable';
import { Package, AlertTriangle } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#2F818E', '#3FB1C5', '#A3D9E2', '#E5F6F8'];

const Dashboard = () => {
    const [cardStats, setCardStats] = useState(null);
    const [cashflowData, setCashflowData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('12months');
    const [cashflowLoading, setCashflowLoading] = useState(false);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [doctorFilter, setDoctorFilter] = useState('All');

    const formatCurrency = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
        return `₹${value}`;
    };

    const ranges = [
        { label: 'Today', value: 'today' },
        { label: 'Last 30 Days', value: '30days' },
        { label: '6 Months', value: '6months' },
        { label: '12 Months', value: '12months' }
    ];

    const fetchCashflow = async (selectedRange) => {
        setCashflowLoading(true);
        try {
            const res = await api.get(`/analytics/cashflow?range=${selectedRange}`);
            setCashflowData(res.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setCashflowLoading(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [cardsRes, distRes, doctorsRes] = await Promise.all([
                    api.get('/stats/cards'),
                    api.get('/stats/distribution'),
                    api.get('/doctors')
                ]);
                setCardStats(cardsRes.data);
                setPieData(distRes.data);
                const doctorData = doctorsRes.data.slice(0, 5);
                setDoctors(doctorData);
                setFilteredDoctors(doctorData);
                await fetchCashflow(range);
            } catch (err) {
                console.error('Dashboard Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        let result = doctors;
        if (doctorSearch) {
            result = result.filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase()));
        }
        if (doctorFilter !== 'All') {
            result = result.filter(d => d.specialty === doctorFilter);
        }
        setFilteredDoctors(result);
    }, [doctorSearch, doctorFilter, doctors]);

    useEffect(() => {
        if (!loading) fetchCashflow(range);
    }, [range]);

    if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Admin Dashboard <span>/ Financial & Clinical Analytics</span></h1>
            </header>

            <div className={styles.statsGrid}>
                <StatCard title="Total Visitors" value={cardStats?.totalVisitors || 0} trend="+12%" />
                <StatCard title="Paid Visitors" value={cardStats?.paidVisitors || 0} trend="+5%" />
                <StatCard title="Total Appointments" value={cardStats?.totalAppointments || 0} trend="+18%" />
                <StatCard title="New Patients" value={cardStats?.newPatients || 0} trend="+22%" />
                <StatCard
                    title="Low Stock Items"
                    value={cardStats?.lowStock || 0}
                    color="#EF4444"
                    icon={<Package size={24} color="#EF4444" />}
                />
            </div>

            <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerLeft}>
                            <h3>Cashflow Overview</h3>
                            <p>Revenue generated from paid clinical services</p>
                        </div>
                        <div className={styles.rangeSelector}>
                            {ranges.map(r => (
                                <button
                                    key={r.value}
                                    className={`${styles.rangeBtn} ${range === r.value ? styles.activeRange : ''}`}
                                    onClick={() => setRange(r.value)}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.chartContainer}>
                        {cashflowLoading ? (
                            <div className={styles.chartOverlay}>Updating...</div>
                        ) : cashflowData.length === 0 || cashflowData.every(d => d.value === 0) ? (
                            <div className={styles.emptyChart}>
                                <p>No financial data available for this period</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={cashflowData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2F818E" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#2F818E" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                                        dy={10}
                                        interval="preserveStartEnd"
                                        minTickGap={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={formatCurrency}
                                        tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                                        width={70}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            backgroundColor: 'var(--bg-card)',
                                            color: 'var(--text-primary)'
                                        }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                        formatter={(value) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#2F818E"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className={styles.chartCardSmall}>
                    <div className={styles.cardHeader}>
                        <h3>Service Distribution</h3>
                    </div>
                    <div className={styles.pieContainer}>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.pieLegend}>
                        {pieData.map((item, idx) => (
                            <div key={idx} className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ backgroundColor: item.color || COLORS[idx % COLORS.length] }}></span>
                                <span className={styles.legendName} style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                                <span className={styles.legendVal} style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.tableRow}>
                <div className={styles.tableHeader}>
                    <h3>Recent Doctors</h3>
                </div>
                <DoctorTable
                    doctors={filteredDoctors}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    onStatusToggle={() => { }}
                    onSearch={setDoctorSearch}
                    onFilterChange={setDoctorFilter}
                    currentFilter={doctorFilter}
                />
            </div>
        </div>
    );
};

export default Dashboard;
