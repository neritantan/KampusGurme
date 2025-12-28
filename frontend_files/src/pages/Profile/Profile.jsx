import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth, logout } from '../../services/authService';
import { getUserActivity } from '../../services/socialService';
import GuestWarning from '../../components/layout/GuestWarning';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: '...',
        rank: '...',
        total_xp: 0,
        next_rank_xp: 100 // Default to avoid division by zero visually until loaded
    });

    const [isAuthenticated, setIsAuthenticated] = useState(true);

    // Dynamic Data
    const [myComments, setMyComments] = useState([]);
    const [ratedMeals, setRatedMeals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const authData = await checkAuth();
            if (!authData.isAuthenticated) {
                setIsAuthenticated(false);
            } else {
                setUser(authData);
                // Fetch Activity
                try {
                    const activity = await getUserActivity();
                    setMyComments(activity.comments);
                    setRatedMeals(activity.ratings);
                } catch (err) {
                    console.error("Failed to load activity", err);
                }
            }
        };
        fetchData();
    }, []);

    // --- STATE'LER ---
    const [activeTab, setActiveTab] = useState('comments');
    const [sortComment, setSortComment] = useState('date');
    const [sortMeal, setSortMeal] = useState('desc');

    // --- SIRALAMA MANTIĞI ---
    const getSortedComments = () => {
        return [...myComments].sort((a, b) => {
            if (sortComment === 'date') return new Date(b.date) - new Date(a.date);
            if (sortComment === 'up') return b.upvotes - a.upvotes;
            if (sortComment === 'down') return b.downvotes - a.downvotes;
            return 0;
        });
    };

    const getSortedMeals = () => {
        return [...ratedMeals].sort((a, b) => {
            if (sortMeal === 'desc') return b.rating - a.rating;
            if (sortMeal === 'asc') return a.rating - b.rating;
            return 0;
        });
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!isAuthenticated) {
        return <section className="screen"><GuestWarning message="Profilinizi görmek ve düzenlemek için giriş yapmalısınız." /></section>;
    }

    return (
        <section className="screen">

            {/* HEADER */}
            <header className="header" style={{ justifyContent: 'center', borderBottom: 'none', paddingBottom: '0' }}>
                <div className="brand-logo" style={{ fontSize: '1.2rem' }}>Profilim</div>
            </header>

            {/* --- HERO PROFILE (Gerçek Veri) --- */}
            {/* --- HERO PROFILE (Gerçek Veri) --- */}
            <div style={{
                textAlign: 'center',
                marginTop: '10px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(145deg, #1E1E1E, #151516)',
                padding: '25px',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--primary)', boxShadow: '0 5px 15px rgba(255, 102, 0, 0.2)' }}>
                        <span style={{ color: 'white', fontSize: '2.8rem', fontWeight: '800' }}>{user.username ? user.username.charAt(0).toUpperCase() : '?'}</span>
                    </div>
                </div>

                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginBottom: '2px', letterSpacing: '-0.5px' }}>{user.username}</div>

                <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: '600',
                    marginBottom: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '4px 12px',
                    borderRadius: '12px'
                }}>
                    {user.rank} <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>• Lvl {user.rank_level || 0}</span>
                </div>

                {/* --- XP PROGRESS BAR --- */}
                <div style={{ width: '100%', maxWidth: '280px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: '6px', fontWeight: '700', letterSpacing: '0.5px' }}>
                        <span>Lvl Ilerlemesi</span>
                        <span style={{ color: 'var(--primary)' }}>{user.total_xp} XP</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#2C2C2E', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${user.next_rank_xp ? Math.min((user.total_xp / user.next_rank_xp) * 100, 100) : 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--primary) 0%, #FFD60A 100%)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease-out',
                            boxShadow: '0 0 10px rgba(255, 102, 0, 0.5)'
                        }}></div>
                    </div>
                    {user.next_rank_xp && (
                        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#555', marginTop: '6px' }}>
                            Sonraki rütbeye <span style={{ color: '#888' }}>{user.next_rank_xp - user.total_xp} XP</span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- SEKMELER (TABS) --- */}
            <div style={{
                display: 'flex',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '0'
            }}>
                <div
                    onClick={() => setActiveTab('comments')}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px',
                        fontSize: '0.95rem',
                        fontWeight: activeTab === 'comments' ? '700' : '600',
                        cursor: 'pointer',
                        color: activeTab === 'comments' ? 'var(--primary)' : '#666',
                        borderBottom: activeTab === 'comments' ? '2px solid var(--primary)' : '2px solid transparent',
                        transition: 'all 0.3s'
                    }}
                >
                    Yorumlar
                </div>
                <div
                    onClick={() => setActiveTab('meals')}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px',
                        fontSize: '0.95rem',
                        fontWeight: activeTab === 'meals' ? '700' : '600',
                        cursor: 'pointer',
                        color: activeTab === 'meals' ? 'var(--primary)' : '#666',
                        borderBottom: activeTab === 'meals' ? '2px solid var(--primary)' : '2px solid transparent',
                        transition: 'all 0.3s'
                    }}
                >
                    Puanlar
                </div>
            </div>

            {/* --- LİSTE VE SORT İKONU --- */}

            {/* 1. YORUMLAR TABI */}
            {activeTab === 'comments' && (
                <div>
                    {/* Sort Bar (Minimal) */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={sortComment}
                                onChange={(e) => setSortComment(e.target.value)}
                                style={{
                                    appearance: 'none',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--primary)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '8px 12px',
                                    paddingRight: '30px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="date">📅 Tarihe Göre</option>
                                <option value="up">👍 Beğeniye Göre</option>
                                <option value="down">👎 Dislike'a Göre</option>
                            </select>
                            <i className="fa-solid fa-filter" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none', fontSize: '0.8rem' }}></i>
                        </div>
                    </div>

                    {/* Liste */}
                    {getSortedComments().map(comment => (
                        <div key={comment.id} style={{
                            background: '#202022',
                            borderRadius: '16px',
                            padding: '15px',
                            marginBottom: '15px',
                            borderLeft: '4px solid var(--primary)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white' }}>{comment.target === 'Genel' ? '📋 Menü Geneli' : `🍽️ ${comment.target}`}</span>
                                <span style={{ fontSize: '0.7rem', color: '#666' }}>{comment.date}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#ddd', lineHeight: '1.5', fontStyle: 'italic', paddingLeft: '5px' }}>
                                "{comment.text}"
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 2. YEMEKLER TABI */}
            {activeTab === 'meals' && (
                <div>
                    {/* Sort Bar (Minimal) */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={sortMeal}
                                onChange={(e) => setSortMeal(e.target.value)}
                                style={{
                                    appearance: 'none',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--primary)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '8px 12px',
                                    paddingRight: '30px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="desc">⬇️ Yüksekten Düşüğe</option>
                                <option value="asc">⬆️ Düşükten Yükseğe</option>
                            </select>
                            <i className="fa-solid fa-arrow-down-wide-short" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none', fontSize: '0.8rem' }}></i>
                        </div>
                    </div>

                    {/* Liste */}
                    {getSortedMeals().map(meal => (
                        <div key={meal.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#202022',
                            padding: '12px',
                            borderRadius: '16px',
                            marginBottom: '12px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}>
                            {meal.img ? (
                                <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundImage: `url('${meal.img}')`, backgroundSize: 'cover', marginRight: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
                            ) : (
                                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: '#666' }}>
                                    <i className="fa-solid fa-utensils"></i>
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'white', marginBottom: '2px' }}>{meal.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{meal.date}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px', background: 'rgba(255, 214, 10, 0.1)', padding: '5px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFD60A' }}>
                                    {meal.rating} <i className="fa-solid fa-star" style={{ fontSize: '0.8rem' }}></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Alt Boşluk */}
            <div style={{ height: '100px' }}></div>

            {/* --- ÇIKIŞ YAP (Sabit Alt Menünün Üstünde) --- */}
            <div
                onClick={handleLogout}
                style={{
                    textAlign: 'center',
                    color: '#FF453A',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: '15px',
                    background: 'transparent',
                    border: '2px solid #FF453A',
                    borderRadius: '16px',
                    marginBottom: '20px',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 15px rgba(255, 69, 58, 0.1)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 69, 58, 0.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                }}
            >
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Çıkış Yap
            </div>

        </section>
    );
};

export default Profile;
