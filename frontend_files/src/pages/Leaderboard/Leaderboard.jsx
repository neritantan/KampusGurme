import React, { useState, useEffect } from 'react';
import { checkAuth } from '../../services/authService';
import GuestWarning from '../../components/layout/GuestWarning';

const Leaderboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        const check = async () => {
            const authData = await checkAuth();
            if (!authData.isAuthenticated) setIsAuthenticated(false);
        };
        check();
    }, []);

    if (!isAuthenticated) {
        return <section className="screen"><GuestWarning message="Liderlik tablosunu görmek için giriş yapmalısınız." /></section>;
    }

    return (
        <section className="screen">
            <header className="header">
                <div className="brand-logo" style={{ fontSize: '1.5rem' }}>Şampiyonlar<span>Ligi</span></div>
            </header>

            <div className="top-dish-card">
                <div className="td-icon"><i className="fa-solid fa-drumstick-bite"></i></div>
                <div className="td-info">
                    <div className="td-label"><i className="fa-solid fa-star"></i> Ayın Favorisi</div>
                    <div className="td-name">Fırın Tavuk</div>
                    <div className="td-rating"><i className="fa-solid fa-star" style={{ color: '#FFD60A' }}></i> 4.9 Puan</div>
                </div>
            </div>

            <div className="sub-title"><span>🏆 Haftanın Liderleri</span></div>

            <div className="podium-container">
                {/* 2. Sıra */}
                <div className="podium-place p-2">
                    <div className="p-avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=5')" }}></div>
                    <div className="p-block">
                        <div className="p-name">Ayşe Y.</div>
                        <div className="p-xp">2800 XP</div>
                        <div className="p-rank">2</div>
                    </div>
                </div>
                {/* 1. Sıra */}
                <div className="podium-place p-1">
                    <div className="crown"><i className="fa-solid fa-crown"></i></div>
                    <div className="p-avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=11')" }}></div>
                    <div className="p-block">
                        <div className="p-name">Enes K.</div>
                        <div className="p-xp">3050 XP</div>
                        <div className="p-rank">1</div>
                    </div>
                </div>
                {/* 3. Sıra */}
                <div className="podium-place p-3">
                    <div className="p-avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=3')" }}></div>
                    <div className="p-block">
                        <div className="p-name">Mehmet</div>
                        <div className="p-xp">2400 XP</div>
                        <div className="p-rank">3</div>
                    </div>
                </div>
            </div>

            <div className="sub-title"><span>🔥 Efsane Yorumlar</span></div>

            {/* Yorum Kartları */}
            <div className="comment-card">
                <div className="c-header"><span>@gurme_bey</span><span>Fırın Tavuk</span></div>
                <div className="c-body">"Tavuklar o kadar iyi pişmişti ki kemiğinden kendiliğinden ayrıldı. Pilav da tane taneydi."</div>
                <div className="c-likes"><i className="fa-solid fa-heart"></i> 42 Beğeni</div>
            </div>
        </section>
    );
};

export default Leaderboard;