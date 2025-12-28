import React, { useState, useEffect } from 'react';
import { checkAuth } from '../../services/authService';
import { getLeaderboard } from '../../services/socialService';
import GuestWarning from '../../components/layout/GuestWarning';

const Leaderboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [leaders, setLeaders] = useState([]);
    const [selfRank, setSelfRank] = useState(null);
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
                if (data.leaders) {
                    setLeaders(data.leaders);
                    setSelfRank(data.self);
                } else {
                    setLeaders(data); // Fallback for old API
                }
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
        <section className="screen" style={{ paddingBottom: '160px' }}>
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
                                        <div className="p-xp" style={{ color: 'var(--primary)', fontWeight: '800' }}>
                                            {getLeader(1).badge} <span style={{ fontSize: '0.6rem', color: '#666' }}>(Lvl {getLeader(1).rank_level || 0})</span>
                                        </div>
                                        <div className="p-rank" style={{ fontSize: '0.8rem', color: '#666' }}>{getLeader(1).xp} XP</div>
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
                                        <div className="p-xp" style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.2rem' }}>
                                            {getLeader(0).badge} <span style={{ fontSize: '0.7rem', color: '#888' }}>(Lvl {getLeader(0).rank_level || 0})</span>
                                        </div>
                                        <div className="p-rank" style={{ fontSize: '0.9rem', color: '#888' }}>{getLeader(0).xp} XP</div>
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
                                        <div className="p-xp" style={{ color: 'var(--primary)', fontWeight: '800' }}>
                                            {getLeader(2).badge} <span style={{ fontSize: '0.6rem', color: '#666' }}>(Lvl {getLeader(2).rank_level || 0})</span>
                                        </div>
                                        <div className="p-rank" style={{ fontSize: '0.8rem', color: '#666' }}>{getLeader(2).xp} XP</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Diğerleri Listesi */}
                    <div style={{ marginTop: '20px' }}>
                        {others.map((l, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '15px', background: '#202022', marginBottom: '10px', borderRadius: '12px', border: '1px solid #333' }}>
                                <div style={{ width: '30px', fontWeight: '700', color: '#666' }}>{idx + 4}</div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontWeight: '700', color: '#888' }}>
                                    {l.avatar_initial}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', color: 'white' }}>{l.username}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{l.xp} XP</div>
                                </div>
                                <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                    {l.badge} <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: '400' }}>(Lvl {l.rank_level || 0})</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- FIXED USER RANK BAR (STICKY) --- */}
                    {selfRank && (
                        <div style={{
                            position: 'fixed',
                            bottom: '90px', // Alt menünün hemen üstü
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 'calc(100% - 40px)',
                            maxWidth: '400px',
                            background: 'rgba(44, 44, 46, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            padding: '10px 15px',
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--primary)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                            zIndex: 100
                        }}>
                            <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.2rem', minWidth: '40px' }}>#{selfRank.rank}</div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontWeight: '700', color: '#888' }}>
                                {selfRank.avatar_initial}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '700', color: 'white' }}>{selfRank.username} (Ben)</div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{selfRank.xp} XP</div>
                            </div>
                            <div style={{ fontWeight: '800', color: 'white', background: 'var(--primary)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                {selfRank.badge} <span style={{ opacity: 0.8, fontSize: '0.7rem' }}>(Lvl {selfRank.rank_level || 0})</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default Leaderboard;