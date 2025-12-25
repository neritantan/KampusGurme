import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="screen">
        <div className="header">
            <div className="brand-logo" style={{fontSize:'1.5rem'}}>Profilim</div>
            <div className="logout-btn" onClick={() => navigate('/')}><i className="fa-solid fa-right-from-bracket"></i></div>
        </div>
        <div className="scene" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`card-3d ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="card-face">
                    <div className="avatar"></div>
                    <div style={{fontSize:'1.5rem', fontWeight:'800'}}>Enes K.</div>
                    <div style={{color:'var(--primary)', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'15px'}}>Usta Gurme</div>
                    <div className="xp-bar"><div className="xp-fill"></div></div>
                    <div style={{fontSize:'0.8rem', marginTop:'5px'}}>2450 / 3000 XP</div>
                    <div style={{position:'absolute', bottom:'20px', fontSize:'0.8rem', color:'var(--text-muted)'}}><i className="fa-solid fa-rotate"></i> Detaylar için çevir</div>
                </div>
                <div className="card-face card-back">
                    <div style={{color:'var(--primary)', fontWeight:'700', marginBottom:'10px'}}>İstatistikler</div>
                    <div className="stat-grid">
                        <div className="stat-box"><div className="stat-val">42</div><div style={{fontSize:'0.8rem', color:'#888'}}>Yorum</div></div>
                        <div className="stat-box"><div className="stat-val">4.8</div><div style={{fontSize:'0.8rem', color:'#888'}}>Ort. Puan</div></div>
                        <div className="stat-box"><div className="stat-val">#12</div><div style={{fontSize:'0.8rem', color:'#888'}}>Sıralama</div></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Profile;