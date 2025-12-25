import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDailyMenu } from '../../services/menuService';
import CommentsModal from '../../components/modals/CommentsModal';

const Home = () => {
  const navigate = useNavigate();
  
  // --- STATE'LER ---
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 26));
  const [menu, setMenu] = useState(null);
  const [nutrition, setNutrition] = useState({ kcal: 0, prot: 0, carb: 0, fat: 0 });
  
  const [flippedCards, setFlippedCards] = useState({});
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [userRatings, setUserRatings] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });

  // Yorumlar Listesi (userVote: 'up', 'down' veya null)
  const [comments, setComments] = useState([
    { id: 3, user: '@ayse_nur', time: '1s önce', text: 'Çorba biraz tuzluydu, ama pilav tane taneydi.', targetName: 'Mercimek Çorbası', upvotes: 2, downvotes: 0, userVote: null },
    { id: 2, user: '@ahmet_y', time: '10dk önce', text: 'Tavuk efsaneydi ama Kemalpaşa\'nın şerbeti çok azdı.', targetName: 'Genel', upvotes: 12, downvotes: 1, userVote: 'up' }, // Örnek: Buna like atmışız
    { id: 1, user: '@mehmet_can', time: '35dk önce', text: 'Spordan sonra ilaç gibi geldi menü.', targetName: 'Genel', upvotes: 5, downvotes: 0, userVote: null },
  ]);

  // --- VERİ ÇEKME ---
  useEffect(() => {
    const fetchData = async () => {
      setMenu(null);
      const data = await getDailyMenu(currentDate);
      setMenu(data);
      
      if (data && data.meals) {
        const totals = data.meals.reduce((acc, meal) => {
          acc.kcal += meal.kcal;
          acc.prot += meal.prot;
          acc.carb += meal.carb;
          acc.fat += meal.fat;
          return acc;
        }, { kcal: 0, prot: 0, carb: 0, fat: 0 });
        setNutrition(totals);
      }
    };
    fetchData();
    setFlippedCards({});
  }, [currentDate]);

  // --- YARDIMCI FONKSİYONLAR ---
  
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
        setToast({ show: false, message: '' });
    }, 2000);
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const handleFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRateMeal = (e, mealId, score) => {
    e.stopPropagation();
    setUserRatings(prev => ({ ...prev, [mealId]: score }));
    showToast(`+10 XP: ${score} Yıldız Verildi! ⭐`);
  };

  const addNewComment = (newCommentObj) => {
    // Yeni eklenen yorumun vote durumu null başlar
    setComments(prevComments => [{ ...newCommentObj, upvotes:0, downvotes:0, userVote: null }, ...prevComments]);
    showToast('+15 XP: Yorum Yapıldı! ✍️');
  };

  // --- OYLAMA MANTIĞI (DÜZELTİLDİ) ---
  const handleVote = (commentId, type) => {
    setComments(prevComments => prevComments.map(c => {
        if (c.id !== commentId) return c;

        let newUp = c.upvotes;
        let newDown = c.downvotes;
        let newVote = c.userVote;
        let showXP = false;

        // Senaryo 1: Zaten seçili olana tekrar bastı (Oyu geri çekme)
        if (newVote === type) {
            if (type === 'up') newUp--;
            else newDown--;
            newVote = null; // Oy silindi
        } 
        // Senaryo 2: Farklı bir şeye bastı veya ilk defa basıyor
        else {
            // Eğer daha önce başka oyu varsa onu sil
            if (newVote === 'up') newUp--;
            if (newVote === 'down') newDown--;

            // Yeni oyu ekle
            if (type === 'up') newUp++;
            else newDown++;
            
            newVote = type;
            showXP = true; // Sadece oy verirken veya değiştirirken XP ver
        }

        if (showXP) {
            showToast(`+5 XP: Yorum Oylandı! ${type === 'up' ? '👍' : '👎'}`);
        }
        
        return { ...c, upvotes: newUp, downvotes: newDown, userVote: newVote };
    }));
  };

  return (
    <section className="screen">
      
      {/* HEADER */}
      <header className="header">
        <div className="brand-logo" style={{fontSize:'1.5rem'}}>Kampüs<span>Gurme</span></div>
        <div 
            onClick={() => navigate('/')} 
            style={{
                background: '#333', 
                border: '1px solid var(--primary)', 
                color: 'var(--primary)',
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                fontWeight: '700',
                cursor: 'pointer'
            }}
        >
             Giriş Yap <i className="fa-solid fa-arrow-right-to-bracket" style={{marginLeft:'5px'}}></i>
        </div>
      </header>
      
      {/* TARİH NAV */}
      <div className="date-nav">
        <i className="fa-solid fa-chevron-left nav-arrow" onClick={() => handleDateChange(-1)}></i>
        <div style={{textAlign:'center', cursor: 'pointer'}} onClick={() => navigate('/calendar')}>
            <div style={{fontSize:'1.2rem', fontWeight:'800', lineHeight: '1.2'}}>
                {currentDate.toLocaleDateString('tr-TR', { weekday: 'long' })}
            </div>
            <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>
                {currentDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
        </div>
        <i className="fa-solid fa-chevron-right nav-arrow" onClick={() => handleDateChange(1)}></i>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <div style={{fontWeight: '700', fontSize: '1.1rem'}}>Günün Menüsü</div>
        <div style={{fontSize: '0.8rem', color: '#888'}}>{menu ? menu.meals.length : 0} Yemek</div>
      </div>

      {/* FLIP KARTLAR */}
      <div id="home-cards-container">
        {menu && menu.meals.map((meal) => {
            const myRating = userRatings[meal.id] || 0;
            return (
            <div className={`flip-card ${flippedCards[meal.id] ? 'flipped' : ''}`} key={meal.id} onClick={() => handleFlip(meal.id)}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <div className="dish-card" style={{margin:0, height: '100%', border: 'none'}}>
                            <div className="dish-img" style={{ backgroundImage: `url('${meal.img}')`, width:'80px', height:'80px' }}></div>
                            <div className="dish-info">
                                <div className="d-head">
                                    <span className="d-name" style={{fontSize: '1rem'}}>{meal.name}</span>
                                    <span className="d-score">{meal.rating} <i className="fa-solid fa-star" style={{color:'#FFD60A'}}></i></span>
                                </div>
                                <div style={{fontSize:'0.8rem', color:'#aaa', marginBottom:'5px'}}>{meal.category}</div>
                                <div className="star-row">
                                    {[1,2,3,4,5].map(i => (
                                        <i key={i} className={`fa-solid fa-star ${i <= (myRating || Math.round(meal.rating)) ? 'filled' : ''}`} 
                                           style={{fontSize: '1.2rem', cursor: 'pointer', zIndex: 10, color: i <= myRating ? '#FFD60A' : (i <= Math.round(meal.rating) ? '#665c2a' : '#333')}}
                                           onClick={(e) => handleRateMeal(e, meal.id, i)}
                                        ></i>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flip-card-back">
                        <div style={{marginBottom: '10px', fontWeight: '700', color: 'var(--primary)'}}>{meal.name}</div>
                        <div className="nut-grid">
                            <div><div style={{fontSize: '1.2rem', fontWeight: '800'}}>{meal.prot}g</div><div style={{fontSize: '0.7rem', color: '#aaa'}}>PROT</div></div>
                            <div><div style={{fontSize: '1.2rem', fontWeight: '800'}}>{meal.carb}g</div><div style={{fontSize: '0.7rem', color: '#aaa'}}>KARB</div></div>
                            <div><div style={{fontSize: '1.2rem', fontWeight: '800'}}>{meal.fat}g</div><div style={{fontSize: '0.7rem', color: '#aaa'}}>YAĞ</div></div>
                        </div>
                        <div style={{marginTop: '10px', fontSize: '0.8rem', color: '#888'}}>
                            <i className="fa-solid fa-rotate"></i> Geri dönmek için dokun
                        </div>
                    </div>
                </div>
            </div>
            );
        })}
      </div>

      {/* TOTAL BESİN */}
      <div style={{background:'var(--bg-card)', padding:'20px 15px', borderRadius:'20px', display:'flex', justifyContent:'space-between', marginTop:'10px', border:'1px solid #333'}}>
        <div style={{textAlign:'center'}}><div style={{color:'var(--primary)', fontWeight:'800', fontSize: '1.2rem'}}><i className="fa-solid fa-fire"></i> {nutrition.kcal}</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>KCAL</div></div>
        <div style={{textAlign:'center'}}><div style={{fontWeight:'700', fontSize: '1.1rem'}}>{nutrition.prot}g</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>PROT</div></div>
        <div style={{textAlign:'center'}}><div style={{fontWeight:'700', fontSize: '1.1rem'}}>{nutrition.carb}g</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>KARB</div></div>
        <div style={{textAlign:'center'}}><div style={{fontWeight:'700', fontSize: '1.1rem'}}>{nutrition.fat}g</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>YAĞ</div></div>
      </div>

      {/* YORUM BÖLÜMÜ */}
      <div style={{marginTop: '25px', marginBottom: '50px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <div style={{fontWeight: '700', fontSize: '1.1rem'}}>Öğrenci Yorumları</div>
            <div style={{color: 'var(--primary)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '700', display:'flex', alignItems:'center', gap:'5px'}} onClick={() => setIsCommentsOpen(true)}>
                Yorum Yap <i className="fa-solid fa-pen"></i>
            </div>
        </div>

        {[...comments].sort((a, b) => b.id - a.id).map(c => (
             <div key={c.id} style={{background: '#202022', borderRadius: '15px', padding: '15px', marginBottom: '10px', borderLeft: '3px solid var(--primary)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>
                    <span>{c.user}</span><span>{c.time}</span>
                </div>
                {c.targetName && c.targetName !== 'Genel' && (
                    <div style={{fontSize:'0.75rem', color:'var(--primary)', marginBottom:'3px', fontWeight:'600'}}># {c.targetName}</div>
                )}
                <div style={{fontSize: '0.9rem', lineHeight: '1.4', color: 'white', marginBottom: '10px'}}>{c.text}</div>
                
                {/* --- GÜNCELLENEN OYLAMA BUTONLARI --- */}
                <div style={{display:'flex', gap:'20px', borderTop:'1px solid #333', paddingTop:'8px', fontSize:'0.9rem', color:'#888'}}>
                    {/* LIKE BUTTON */}
                    <div 
                        style={{
                            cursor:'pointer', display:'flex', alignItems:'center', gap:'5px',
                            color: c.userVote === 'up' ? 'var(--primary)' : 'inherit', // Aktifse Turuncu
                            fontWeight: c.userVote === 'up' ? '700' : '400'
                        }} 
                        onClick={() => handleVote(c.id, 'up')}
                    >
                        <i className={c.userVote === 'up' ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i> {c.upvotes}
                    </div>

                    {/* DISLIKE BUTTON */}
                    <div 
                        style={{
                            cursor:'pointer', display:'flex', alignItems:'center', gap:'5px',
                            color: c.userVote === 'down' ? '#FF453A' : 'inherit', // Aktifse Kırmızı
                            fontWeight: c.userVote === 'down' ? '700' : '400'
                        }} 
                        onClick={() => handleVote(c.id, 'down')}
                    >
                        <i className={c.userVote === 'down' ? "fa-solid fa-thumbs-down" : "fa-regular fa-thumbs-down"}></i> {c.downvotes}
                    </div>
                </div>
            </div>
        ))}
      </div>

      <CommentsModal 
        isOpen={isCommentsOpen} 
        onClose={() => setIsCommentsOpen(false)} 
        menuMeals={menu ? menu.meals : []}
        onAddComment={addNewComment} 
      />

        {/* --- TOAST (XP BİLDİRİMİ - GÜNCELLENDİ) --- */}
      <div 
        style={{
            position: 'fixed',
            bottom: toast.show ? '110px' : '-100px', /* Gösterilince yukarı kay */
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#333',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 9999, /* En üstte durmaya zorla */
            transition: 'bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', /* Yaylanma efekti */
            border: '1px solid #444',
            whiteSpace: 'nowrap'
        }}
      >
        <i className="fa-solid fa-trophy" style={{color: '#FFD60A'}}></i> 
        <span style={{fontWeight: '600', fontSize: '0.9rem'}}>{toast.message}</span>
      </div>

    </section>
  );
};

export default Home;