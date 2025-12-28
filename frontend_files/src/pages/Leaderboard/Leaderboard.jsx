import React, { useState, useEffect } from 'react';
import { checkAuth } from '../../services/authService';
import { getLeaderboard } from '../../services/socialService';
import GuestWarning from '../../components/layout/GuestWarning';

const Leaderboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const authData = await checkAuth();
            if (!authData.isAuthenticated) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const data = await getLeaderboard();
                setLeaders(data); // Expect array of user objects
            } catch (error) {
                console.error("Leaderboard error", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    if (!isAuthenticated) {
        return <section className="screen"><GuestWarning message="Liderlik tablosunu görmek için giriş yapmalısınız." /></section>;
    }

    if (loading) {
        return <section className="screen"><div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Yükleniyor...</div></section>;
    }

    const top3 = leaders.slice(0, 3);
    const others = leaders.slice(3);

    // Helper to safe access
    const getLeader = (index) => top3[index] || null;

    return (
        <section className="screen">
            <header className="header">
                <div className="brand-logo" style={{ fontSize: '1.5rem' }}>Şampiyonlar<span>Ligi</span></div>
            </header>

            <div className="sub-title"><span>🏆 Haftanın Liderleri</span></div>

            {leaders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#777' }}>Henüz sıralama oluşmadı. İlk puanı sen kazan!</div>
            ) : (
                <>
                    <div className="podium-container">
                        {/* 2. Sıra */}
                        <div className="podium-place p-2">
                            {getLeader(1) && (
                                <>
                                    <div className="p-avatar" style={{ background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#888' }}>
                                        {getLeader(1).avatar_initial}
                                    </div>
                                    <div className="p-block">
                                        <div className="p-name">{getLeader(1).username}</div>
                                        <div className="p-xp">{getLeader(1).xp} XP</div>
                                        <div className="p-rank">2</div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* 1. Sıra */}
                        <div className="podium-place p-1">
                            <div className="crown"><i className="fa-solid fa-crown"></i></div>
                            {getLeader(0) && (
                                <>
                                    <div className="p-avatar" style={{ background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white', border: '2px solid white' }}>
                                        {getLeader(0).avatar_initial}
                                    </div>
                                    <div className="p-block">
                                        <div className="p-name">{getLeader(0).username}</div>
                                        <div className="p-xp">{getLeader(0).xp} XP</div>
                                        <div className="p-rank">1</div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* 3. Sıra */}
                        <div className="podium-place p-3">
                            {getLeader(2) && (
                                <>
                                    <div className="p-avatar" style={{ background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#A0522D' }}>
                                        {getLeader(2).avatar_initial}
                                    </div>
                                    <div className="p-block">
                                        <div className="p-name">{getLeader(2).username}</div>
                                        <div className="p-xp">{getLeader(2).xp} XP</div>
                                        <div className="p-rank">3</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Diğerleri Listesi */}
                    <div style={{ marginTop: '20px', paddingBottom: '100px' }}>
                        {others.map((l, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '15px', background: '#202022', marginBottom: '10px', borderRadius: '12px', border: '1px solid #333' }}>
                                <div style={{ width: '30px', fontWeight: '700', color: '#666' }}>{idx + 4}</div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontWeight: '700', color: '#888' }}>
                                    {l.avatar_initial}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', color: 'white' }}>{l.username}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{l.badge}</div>
                                </div>
                                <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{l.xp} XP</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default Leaderboard;