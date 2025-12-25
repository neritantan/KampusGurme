import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  // --- MOCK DATA ---
  const [user, setUser] = useState({
    name: 'Mert Yılmaz',
    username: '@mertyilmaz',
    title: 'Çaylak Gurme',
    level: 3,
    currentXP: 850,
    nextLevelXP: 1200,
    avatar: 'https://i.pravatar.cc/300?img=11',
  });

  // Kullanıcının Yorumları
  const [myComments, setMyComments] = useState([
    { id: 1, text: 'Tavuk biraz kuruydu ama pilav efsane.', target: 'Fırın Tavuk', date: '2025-12-26', upvotes: 12, downvotes: 2 },
    { id: 2, text: 'Bugünkü menü tam sporcu işi!', target: 'Genel', date: '2025-12-25', upvotes: 45, downvotes: 0 },
    { id: 3, text: 'Çorbanın tuzu çok fazlaydı.', target: 'Yayla Çorbası', date: '2025-12-20', upvotes: 3, downvotes: 15 },
    { id: 4, text: 'Tatlı yetmedi, porsiyonlar büyümeli.', target: 'Kemalpaşa', date: '2025-12-24', upvotes: 8, downvotes: 1 },
  ]);

  // Kullanıcının Puanladığı Yemekler
  const [ratedMeals, setRatedMeals] = useState([
    { id: 1, name: 'Fırın Tavuk & Pilav', rating: 4, date: '2025-12-26', img: 'https://cdn.yemek.com/mnresize/1250/833/uploads/2016/09/firin-tavuk-yemekcom.jpg' },
    { id: 2, name: 'Yayla Çorbası', rating: 2, date: '2025-12-20', img: 'https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/yayla-corbasi-yemekcom.jpg' },
    { id: 3, name: 'İzmir Köfte', rating: 5, date: '2025-12-18', img: 'https://cdn.yemek.com/mnresize/1250/833/uploads/2015/02/izgara-kofte-yemekcom.jpg' },
    { id: 4, name: 'Sütlaç', rating: 5, date: '2025-12-15', img: 'https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/sutlac-yemekcom.jpg' },
  ]);

  // --- STATE'LER ---
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' veya 'meals'
  const [sortComment, setSortComment] = useState('date'); // 'date', 'up', 'down'
  const [sortMeal, setSortMeal] = useState('desc'); // 'desc' (yüksekten düşüğe), 'asc' (düşükten yükseğe)

  // XP Bar Yüzdesi
  const progressPercent = Math.min((user.currentXP / user.nextLevelXP) * 100, 100);

  // --- SIRALAMA MANTIĞI ---
  
  const getSortedComments = () => {
    return [...myComments].sort((a, b) => {
        if (sortComment === 'date') return new Date(b.date) - new Date(a.date); // Yeniden eskiye
        if (sortComment === 'up') return b.upvotes - a.upvotes; // Çok beğeni
        if (sortComment === 'down') return b.downvotes - a.downvotes; // Çok dislike
        return 0;
    });
  };

  const getSortedMeals = () => {
    return [...ratedMeals].sort((a, b) => {
        if (sortMeal === 'desc') return b.rating - a.rating; // 5 -> 1
        if (sortMeal === 'asc') return a.rating - b.rating; // 1 -> 5
        return 0;
    });
  };

  return (
    <section className="screen">
      
      {/* HEADER */}
      <header className="header" style={{justifyContent: 'center', borderBottom: 'none', paddingBottom: '0'}}>
        <div className="brand-logo" style={{fontSize:'1.2rem'}}>Profilim</div>
      </header>

      {/* --- HERO PROFILE --- */}
      <div style={{
          textAlign: 'center', 
          marginTop: '20px', 
          marginBottom: '20px',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
      }}>
        <div style={{position: 'relative', marginBottom: '10px'}}>
            <div style={{width: '90px', height: '90px', borderRadius: '50%', backgroundImage: `url('${user.avatar}')`, backgroundSize: 'cover', backgroundPosition: 'center', border: '3px solid var(--primary)'}}></div>
            <div style={{position: 'absolute', bottom: '-5px', right: '50%', transform: 'translateX(50%)', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800', border: '2px solid #1C1C1E'}}>
                LVL {user.level}
            </div>
        </div>
        <div style={{fontSize: '1.2rem', fontWeight: '800', color: 'white'}}>{user.name}</div>
        <div style={{fontSize: '0.9rem', color: 'var(--primary)', fontWeight:'700'}}>{user.title}</div>
      </div>

      {/* XP BAR */}
      <div style={{background: '#2C2C2E', padding: '15px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #3A3A3C'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '600'}}>
            <span style={{color: '#aaa'}}>Sonraki Seviye</span>
            <span style={{color: 'white'}}>{user.currentXP} / {user.nextLevelXP} XP</span>
        </div>
        <div style={{width: '100%', height: '8px', background: '#1C1C1E', borderRadius: '10px', overflow: 'hidden'}}>
            <div style={{width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #FFD60A)', borderRadius: '10px', transition: 'width 1s'}}></div>
        </div>
      </div>

      {/* --- SEKMELER (TABS) --- */}
      <div style={{display: 'flex', background: '#202022', padding: '4px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #333'}}>
        <div 
            onClick={() => setActiveTab('comments')}
            style={{
                flex: 1, 
                textAlign: 'center', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: '700', 
                cursor: 'pointer',
                background: activeTab === 'comments' ? '#333' : 'transparent',
                color: activeTab === 'comments' ? 'white' : '#888',
                transition: 'all 0.2s'
            }}
        >
            Yorumlar
        </div>
        <div 
            onClick={() => setActiveTab('meals')}
            style={{
                flex: 1, 
                textAlign: 'center', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: '700', 
                cursor: 'pointer',
                background: activeTab === 'meals' ? '#333' : 'transparent',
                color: activeTab === 'meals' ? 'white' : '#888',
                transition: 'all 0.2s'
            }}
        >
            Yemekler
        </div>
      </div>

      {/* --- LİSTE VE SORT İKONU --- */}
      
      {/* 1. YORUMLAR TABI */}
      {activeTab === 'comments' && (
          <div>
            {/* Sort Bar */}
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
                <select 
                    value={sortComment} 
                    onChange={(e) => setSortComment(e.target.value)}
                    style={{
                        background: '#202022', 
                        color: 'var(--primary)', 
                        border: '1px solid #333', 
                        padding: '5px 10px', 
                        borderRadius: '8px', 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        outline: 'none'
                    }}
                >
                    <option value="date">📅 Tarihe Göre</option>
                    <option value="up">👍 Beğeniye Göre</option>
                    <option value="down">👎 Dislike'a Göre</option>
                </select>
            </div>

            {/* Liste */}
            {getSortedComments().map(comment => (
                <div key={comment.id} style={{background: '#202022', borderRadius: '15px', padding: '15px', marginBottom: '10px', borderLeft: '3px solid var(--primary)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: '5px'}}>
                        <span>{comment.target === 'Genel' ? '📋 Menü Geneli' : `🍽️ ${comment.target}`}</span>
                        <span>{comment.date}</span>
                    </div>
                    <div style={{fontSize: '0.9rem', color: 'white', marginBottom: '10px', lineHeight: '1.4'}}>
                        "{comment.text}"
                    </div>
                    <div style={{display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#aaa', borderTop:'1px solid #333', paddingTop:'8px'}}>
                        <span style={{color: sortComment === 'up' ? 'var(--primary)' : '#aaa'}}><i className="fa-solid fa-thumbs-up"></i> {comment.upvotes}</span>
                        <span style={{color: sortComment === 'down' ? '#FF453A' : '#aaa'}}><i className="fa-solid fa-thumbs-down"></i> {comment.downvotes}</span>
                    </div>
                </div>
            ))}
          </div>
      )}

      {/* 2. YEMEKLER TABI */}
      {activeTab === 'meals' && (
          <div>
            {/* Sort Bar */}
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
                <select 
                    value={sortMeal} 
                    onChange={(e) => setSortMeal(e.target.value)}
                    style={{
                        background: '#202022', 
                        color: 'var(--primary)', 
                        border: '1px solid #333', 
                        padding: '5px 10px', 
                        borderRadius: '8px', 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        outline: 'none'
                    }}
                >
                    <option value="desc">⬇️ Yüksekten Düşüğe</option>
                    <option value="asc">⬆️ Düşükten Yükseğe</option>
                </select>
            </div>

            {/* Liste */}
            {getSortedMeals().map(meal => (
                <div key={meal.id} style={{display: 'flex', alignItems: 'center', background: '#202022', padding: '10px', borderRadius: '15px', marginBottom: '10px', border: '1px solid #333'}}>
                    <div style={{width: '60px', height: '60px', borderRadius: '10px', backgroundImage: `url('${meal.img}')`, backgroundSize: 'cover', marginRight: '15px'}}></div>
                    <div style={{flex: 1}}>
                        <div style={{fontWeight: '700', fontSize: '1rem', color: 'white'}}>{meal.name}</div>
                        <div style={{fontSize: '0.75rem', color: '#888'}}>{meal.date}</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px'}}>
                        <div style={{fontSize: '1.2rem', fontWeight: '800', color: '#FFD60A'}}>
                            {meal.rating} <i className="fa-solid fa-star" style={{fontSize: '0.8rem'}}></i>
                        </div>
                    </div>
                </div>
            ))}
          </div>
      )}

      {/* Alt Boşluk */}
      <div style={{height: '100px'}}></div>

      {/* --- ÇIKIŞ YAP (Sabit Alt Menünün Üstünde) --- */}
      <div 
        onClick={() => navigate('/')}
        style={{
            textAlign: 'center', 
            color: '#FF453A', 
            fontWeight: '700', 
            cursor: 'pointer', 
            padding: '15px',
            background: '#2C2C2E',
            borderRadius: '15px',
            marginBottom: '20px'
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket"></i> Çıkış Yap
      </div>

    </section>
  );
};

export default Profile;