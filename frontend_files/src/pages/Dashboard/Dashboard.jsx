import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    TrendingUp, Users, Star, AlertTriangle, ArrowUp, ArrowDown, PieChart as PieIcon, Calendar, Sparkles, ArrowRight, ChefHat
} from 'lucide-react';

import { getDashboardStats, getDashboardAnalytics } from '../../services/dashboardService';

const COLORS = ['#10B981', '#EF4444']; // Green, Red

const Dashboard = () => {
    // State for Filters
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Data State
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);

    // Years for dropdown (last 5 years)
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        { value: 1, label: 'Ocak' }, { value: 2, label: 'Şubat' }, { value: 3, label: 'Mart' },
        { value: 4, label: 'Nisan' }, { value: 5, label: 'Mayıs' }, { value: 6, label: 'Haziran' },
        { value: 7, label: 'Temmuz' }, { value: 8, label: 'Ağustos' }, { value: 9, label: 'Eylül' },
        { value: 10, label: 'Ekim' }, { value: 11, label: 'Kasım' }, { value: 12, label: 'Aralık' }
    ];

    // Fetch Daily Stats when Date changes
    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                const data = await getDashboardStats(selectedDate);
                setStats(data);
            } catch (error) {
                console.error("Stats Error:", error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, [selectedDate]);

    // Fetch Analytics when Month/Year changes
    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoadingAnalytics(true);
            try {
                const data = await getDashboardAnalytics(selectedMonth, selectedYear);
                setAnalytics(data);
            } catch (error) {
                console.error("Analytics Error:", error);
            } finally {
                setLoadingAnalytics(false);
            }
        };
        fetchAnalytics();
    }, [selectedMonth, selectedYear]);

    // Styles
    const primaryColor = '#FF6600'; // KampusGurme Brand Primary

    const cardStyle = {
        background: '#202022', // Slightly darker to match Home cards
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #2C2C2E',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };

    const compactHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    };

    const selectStyle = {
        background: '#333',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        outline: 'none',
        cursor: 'pointer',
        fontWeight: '600'
    };

    return (
        <div style={{ minHeight: '100vh', padding: '15px', paddingBottom: '90px', background: '#121212', fontFamily: 'Inter, sans-serif', color: 'white', overflowY: 'auto' }}>

            {/* Compact Header */}
            <div style={{ ...compactHeaderStyle, marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
                        <span style={{ color: 'white' }}>Kampüs</span><span style={{ color: primaryColor }}>Gurme</span>
                    </h1>
                </div>

                {/* Date Picker (Compact) */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#202022', padding: '4px 8px', borderRadius: '10px', border: '1px solid #333' }}>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '13px', outline: 'none', fontWeight: '600' }}
                    />
                </div>
            </div>

            {/* --- DAILY STATS (Compact Grid) --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>

                {/* 1. Daily Votes */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>OYLAMA</p>
                            <h3 style={{ fontSize: '26px', fontWeight: '800', margin: '2px 0 0 0' }}>{stats?.total_votes ?? '-'}</h3>
                        </div>
                        <div style={{ background: 'rgba(10, 132, 255, 0.15)', padding: '8px', borderRadius: '10px' }}>
                            <Users size={18} color="#0A84FF" />
                        </div>
                    </div>
                </div>

                {/* 2. Avg Score */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>ORTALAMA</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                                <h3 style={{ fontSize: '26px', fontWeight: '800', margin: '2px 0 0 0', color: '#FFD60A' }}>{stats?.today_avg ?? '-'}</h3>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: stats?.diff_percent > 0 ? '#30D158' : '#FF453A' }}>
                                    {stats?.diff_percent ? `${stats.diff_percent > 0 ? '+' : ''}${stats.diff_percent}%` : ''}
                                </span>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255, 214, 10, 0.15)', padding: '8px', borderRadius: '10px' }}>
                            <Star size={18} color="#FFD60A" />
                        </div>
                    </div>
                </div>

                {/* 3. Satisfaction */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>MEMNUNİYET</p>
                            <h3 style={{ fontSize: '26px', fontWeight: '800', margin: '2px 0 0 0', color: getScoreColor(stats?.satisfaction_rate) }}>
                                %{stats?.satisfaction_rate ?? 0}
                            </h3>
                        </div>
                        <div style={{ background: getScoreBg(stats?.satisfaction_rate), padding: '8px', borderRadius: '10px' }}>
                            <TrendingUp size={18} color={getScoreColor(stats?.satisfaction_rate)} />
                        </div>
                    </div>
                </div>

                {/* 4. Worst Meal (Expanded Text, No Chart Icon) */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>EN KÖTÜ</p>
                        {stats?.worst_meal ? (
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', lineHeight: '1.3', marginBottom: '4px' }}>
                                    {stats.worst_meal.name}
                                </div>
                                <div style={{ color: '#FF453A', fontSize: '13px', fontWeight: '800' }}>
                                    {stats.worst_meal.score} Puan
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Yok</div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- ANALYTICS (Split View) --- */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#888', textTransform: 'uppercase' }}>Analiz</h2>
                <div style={{ height: '1px', flex: 1, background: '#333' }}></div>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} style={selectStyle}>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={selectStyle}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>

                {/* Trend Chart */}
                <div style={{ ...cardStyle, height: '220px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <TrendingUp size={14} color={primaryColor} /> Trend Analizi
                    </h3>
                    <div style={{ flex: 1, width: '100%', fontSize: '10px' }}>
                        {loadingAnalytics ? <LoadingPlaceholder /> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics?.trend_chart}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#666' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(str) => str.slice(8)}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        domain={[0, 5]}
                                        tick={{ fill: '#666' }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={20}
                                    />
                                    <Tooltip contentStyle={{ background: '#202022', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke={primaryColor}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, fill: 'white' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Pie Chart */}
                <div style={{ ...cardStyle, height: '170px', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                        {loadingAnalytics ? <LoadingPlaceholder /> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics?.sentiment_chart}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {analytics?.sentiment_chart?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#30D158' : '#FF453A'} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#202022', border: 'none', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        {!loadingAnalytics && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                                <span style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>
                                    {analytics?.monthly_satisfaction}%
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div style={{ flex: 1, paddingLeft: '10px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: 'white' }}>Memnuniyet</h3>
                        <p style={{ fontSize: '11px', color: '#888', marginBottom: '10px' }}>Bu ayki oyların dağılımı</p>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '12px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#30D158', marginRight: '6px' }}></span>
                            <span style={{ color: '#ccc' }}>Pozitif</span>
                            <span style={{ marginLeft: 'auto', fontWeight: '700' }}>{analytics?.sentiment_chart?.[0]?.value || 0}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF453A', marginRight: '6px' }}></span>
                            <span style={{ color: '#ccc' }}>Negatif</span>
                            <span style={{ marginLeft: 'auto', fontWeight: '700' }}>{analytics?.sentiment_chart?.[1]?.value || 0}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* AI Agent Placeholder */}
            <AIAgentCard />
        </div>
    );
};

// --- SUB COMPONENTS ---

const StatCard = ({ title, value, icon, trend, bg, subtext, loading }) => {
    const isPositive = trend > 0;
    if (loading) return <div style={{ height: '140px', background: '#2C2C2E', borderRadius: '16px', opacity: 0.5 }}></div>;

    return (
        <div style={{ background: '#2C2C2E', borderRadius: '16px', padding: '20px', border: '1px solid #3a3a3c', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '4px' }}>{title}</p>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{value !== undefined ? value : '-'}</h3>
                </div>
                <div style={{ padding: '10px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </div>
            </div>

            {(trend !== undefined && trend !== null) ? (
                <div style={{ fontSize: '13px', fontWeight: '600', color: isPositive ? '#30D158' : '#FF453A', display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    {isPositive ? <ArrowUp size={14} style={{ marginRight: '2px' }} /> : <ArrowDown size={14} style={{ marginRight: '2px' }} />}
                    {Math.abs(trend)}%
                    <span style={{ color: '#666', fontWeight: '400', marginLeft: '6px' }}>düne göre</span>
                </div>
            ) : subtext && (
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>{subtext}</p>
            )}
        </div>
    );
};

const WorstMealCard = ({ meal, loading }) => {
    if (loading) return <div style={{ height: '140px', background: '#2C2C2E', borderRadius: '16px', opacity: 0.5 }}></div>;

    return (
        <div style={{ background: '#2C2C2E', borderRadius: '16px', padding: '16px', border: '1px solid #3a3a3c', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>GÜNÜN EN KÖTÜSÜ</p>
            {meal ? (
                <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', lineHeight: '1.3', marginBottom: '4px' }}>
                        {meal.name}
                    </div>
                    <div style={{ color: '#FF453A', fontSize: '13px', fontWeight: '800' }}>
                        {meal.score} Puan
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '24px', marginBottom: '5px' }}>🤷‍♂️</div>
                    <p style={{ fontSize: '12px' }}>Kötü yemek yok!</p>
                </div>
            )}
        </div>
    );
}

const LoadingPlaceholder = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444', fontSize: '12px' }}>
        Yükleniyor...
    </div>
);

// Helpers
const getScoreColor = (score) => {
    if (!score) return '#888';
    if (score >= 80) return '#30D158';
    if (score >= 50) return '#FF9F0A';
    return '#FF453A';
};

const getScoreBg = (score) => {
    if (!score) return 'rgba(136, 136, 136, 0.1)';
    if (score >= 80) return 'rgba(48, 209, 88, 0.15)';
    if (score >= 50) return 'rgba(255, 159, 10, 0.15)';
    return 'rgba(255, 69, 58, 0.15)';
};

// AI Agent Placeholder Card
const AIAgentCard = () => {
    return (
        <div style={{
            position: 'relative',
            borderRadius: '24px',
            background: '#1C1C1E', // Inner card background
            padding: '20px',
            marginTop: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        }}>
            {/* Top Section: Logo & Text */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {/* Logo Area (Chef Hat Icon) */}
                <div style={{
                    width: '60px', height: '60px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #3f2b96, #a8c0ff)', // Purple-Blue Gradient
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 5px 15px rgba(63, 43, 150, 0.4)'
                }}>
                    <ChefHat size={32} color="white" strokeWidth={1.5} />
                </div>

                {/* Text Area */}
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        margin: 0,
                        background: 'linear-gradient(90deg, #fff, #a8c0ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px'
                    }}>
                        GurmeBot
                    </h3>
                    <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                        Yapay zeka ile kampüs menüleri ve öğrenci yorumlarını analiz et.
                    </p>
                </div>
            </div>

            {/* Bottom Section: Separated Input & Button */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                {/* Input with Gradient Border */}
                <div style={{
                    flex: 1,
                    position: 'relative',
                    borderRadius: '30px',
                    padding: '2px', // Width of gradient border
                }}>
                    {/* Gradient Background for Border */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        borderRadius: '30px',
                        background: 'linear-gradient(45deg, #a8c0ff, #3f2b96, #ff00cc, #33ccff)',
                        backgroundSize: '300% 300%',
                        animation: 'gradientAnimation 3s ease infinite',
                        zIndex: 0
                    }}></div>

                    <style>{`
                        @keyframes gradientAnimation {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                    `}</style>

                    {/* Inner Input */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        background: '#2C2C2E',
                        borderRadius: '28px',
                        padding: '12px 20px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            placeholder="Bu günkü yemekler hakkında öğrenciler ne düşünüyor?"
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '13px' }}
                        />
                    </div>
                </div>

                <div style={{
                    width: '48px', height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fff, #bbb)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                }}>
                    <ArrowUp size={24} color="#1C1C1E" strokeWidth={3} />
                </div>
            </div>
        </div>
    );
};

// Pie Chart Label (Percentage)
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show if too small

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


export default Dashboard;
