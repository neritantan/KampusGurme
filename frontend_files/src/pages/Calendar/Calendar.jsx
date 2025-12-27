import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDailyMenu, getMonthlyMenu } from '../../services/menuService';

const Calendar = () => {
    const [openDay, setOpenDay] = useState(26);
    const [dailyMenu, setDailyMenu] = useState(null);

    const navigate = useNavigate();
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const today = 26;

    const mains = [
        { name: "Kuru Fasulye", icon: "bowl-rice" },
        { name: "İzmir Köfte", icon: "drumstick-bite" },
        { name: "Et Sote", icon: "utensils" }
    ];

    const [monthlyData, setMonthlyData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            // 1. Bugünün detaylı menüsü
            const todayDate = new Date(2025, 11, today);
            const dailyData = await getDailyMenu(todayDate);
            setDailyMenu(dailyData);

            // 2. Aylık Takvim Verisi (Ana Yemekler)
            const monthData = await getMonthlyMenu();
            setMonthlyData(monthData);
        };
        fetchData();
    }, []);

    // YENİ FONKSİYON: Butona tıklayınca çalışır
    const handleGoToDay = (day) => {
        const targetDate = new Date(2025, 11, day);
        // Ana sayfaya yönlendir ve tarihi 'state' içinde gönder
        navigate('/home', { state: { date: targetDate } });
    };

    return (
        <section className="screen">
            <header className="header">
                <div className="brand-logo" style={{ fontSize: '1.5rem' }}>Yemek<span>Ajandası</span></div>
            </header>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '15px', color: 'var(--text-muted)' }}>Aralık 2025</div>

            <div className="timeline">
                {days.map(day => {
                    const isToday = day === today;
                    const isOpen = openDay === day;
                    const rndMain = mains[Math.floor(Math.random() * mains.length)];

                    return (
                        <div
                            key={day}
                            className={`t-item ${isToday ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                            onClick={() => setOpenDay(isOpen ? null : day)}
                        // onDoubleClick kaldırıldı, artık butona basacağız
                        >
                            <div className="t-dot"></div>
                            <div className="t-date">{day} Aralık</div>

                            <div className="t-card">
                                <div className="t-card-header">
                                    {isToday && dailyMenu ? (
                                        (dailyMenu.meals[1] && dailyMenu.meals[1].img) ? (
                                            <div className="t-img-thumb" style={{ backgroundImage: `url('${dailyMenu.meals[1].img}')`, display: 'block', width: '60px', height: '60px', borderRadius: '16px', backgroundSize: 'cover' }}></div>
                                        ) : (
                                            <div className="t-icon" style={{ background: 'rgba(255, 102, 0, 0.2)', color: 'var(--primary)' }}><i className="fa-solid fa-utensils"></i></div>
                                        )
                                    ) : (
                                        monthlyData[day] ? (
                                            monthlyData[day].image ?
                                                <div className="t-img-thumb" style={{ backgroundImage: `url('${monthlyData[day].image}')`, display: 'block', width: '60px', height: '60px', borderRadius: '16px', backgroundSize: 'cover' }}></div>
                                                : <div className="t-icon" style={{ background: 'rgba(255, 59, 48, 0.15)', color: '#FF3B30' }}><i className={`fa-solid fa-utensils`}></i></div>
                                        ) : (
                                            <div className="t-icon" style={{ background: '#333', color: '#555' }}><i className={`fa-solid fa-circle-question`}></i></div>
                                        )
                                    )}

                                    <div className="t-content" style={{ paddingLeft: '5px' }}>
                                        <div className="t-main-dish">
                                            {isToday && dailyMenu ? dailyMenu.meals[1].name : (monthlyData[day] ? monthlyData[day].name : 'Menü Girilmedi')}
                                        </div>
                                        <div className="t-subtitle" style={{ color: isToday ? 'var(--primary)' : 'var(--text-muted)' }}>
                                            {isToday ? 'Bugünün Menüsü' : (monthlyData[day] ? 'Ana Yemek' : '-')}
                                        </div>
                                    </div>

                                    <div className="t-arrow"><i className="fa-solid fa-chevron-down"></i></div>
                                </div>
                            </div>

                            {/* Accordion Body */}
                            <div className="t-body" style={{ maxHeight: isOpen ? '500px' : '0' }}>
                                <div className="t-menu-list">
                                    {isToday && dailyMenu ? (
                                        dailyMenu.meals.map((m, i) => (
                                            <div className="t-menu-row" key={i} style={{ paddingBottom: '8px', borderBottom: i < dailyMenu.meals.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                                <div className="t-cat" style={{ color: 'var(--primary)' }}>{m.category}</div>
                                                <div className="t-food" style={{ fontWeight: '600' }}>{m.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        monthlyData[day] ? (
                                            <>
                                                <div className="t-menu-row"><div className="t-cat">Ana Yemek</div><div className="t-food">{monthlyData[day].name}</div></div>
                                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px', fontStyle: 'italic' }}>Diğer yemekler için detaya git</div>
                                            </>
                                        ) : (
                                            <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>Bu tarih için menü bulunamadı.</div>
                                        )
                                    )}
                                </div>

                                {/* --- YENİ EKLENEN BUTON --- */}
                                <div style={{ padding: '10px 15px 15px 15px', borderTop: '1px solid #333', marginTop: '10px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Kartın kapanmasını engelle
                                            handleGoToDay(day);
                                        }}
                                    >
                                        Detaylar & Yorumlar <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Calendar;