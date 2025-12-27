import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDailyMenu } from '../../services/menuService';

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

    useEffect(() => {
        const fetchData = async () => {
            const todayDate = new Date(2025, 11, today);
            const data = await getDailyMenu(todayDate);
            setDailyMenu(data);
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
                                        <div className="t-img-thumb" style={{ backgroundImage: `url('${dailyMenu.meals[1].img}')`, display: 'block', width: '40px', height: '40px', borderRadius: '8px', backgroundSize: 'cover' }}></div>
                                    ) : (
                                        <div className="t-icon"><i className={`fa-solid fa-${rndMain.icon}`}></i></div>
                                    )}

                                    <div className="t-content" style={{ paddingLeft: '10px' }}>
                                        <div className="t-main-dish">
                                            {isToday && dailyMenu ? dailyMenu.meals[1].name : rndMain.name}
                                        </div>
                                        <div className="t-subtitle" style={{ color: isToday ? 'var(--primary)' : 'var(--text-muted)' }}>
                                            {isToday ? 'Bugünün Menüsü' : 'Menüyü gör'}
                                        </div>
                                    </div>
                                    <div className="t-arrow"><i className="fa-solid fa-chevron-down"></i></div>
                                </div>

                                {/* Accordion Body */}
                                <div className="t-body" style={{ maxHeight: isOpen ? '500px' : '0' }}>
                                    <div className="t-menu-list">
                                        {isToday && dailyMenu ? (
                                            dailyMenu.meals.map((m, i) => (
                                                <div className="t-menu-row" key={i}>
                                                    <div className="t-cat">{m.category}</div>
                                                    <div className="t-food">{m.name}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div className="t-menu-row"><div className="t-cat">Çorba</div><div className="t-food">Ezogelin Çorbası</div></div>
                                                <div className="t-menu-row"><div className="t-cat">Ana Yemek</div><div className="t-food">{rndMain.name}</div></div>
                                                <div className="t-menu-row"><div className="t-cat">Yardımcı</div><div className="t-food">Pirinç Pilavı</div></div>
                                            </>
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
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Calendar;