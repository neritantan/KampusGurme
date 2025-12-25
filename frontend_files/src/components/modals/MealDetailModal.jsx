import React, { useState, useEffect } from 'react';

const MealDetailModal = ({ isOpen, onClose, meal }) => {
  // --- STATE YÖNETİMİ ---
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: '@mehmet', time: '10dk', text: 'Tadı harikaydı, elinize sağlık!' },
    { id: 2, user: '@ayse', time: '25dk', text: 'Biraz daha tuzlu olabilirdi ama güzel.' }
  ]);
  const [userRating, setUserRating] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Modal kapandığında state'leri (varsa) sıfırlamak istersen:
  useEffect(() => {
    if (!isOpen) {
        setToast({ show: false, message: '' });
        // setUserRating(0); // İstersen her açışta puanı sıfırla
    }
  }, [isOpen]);

  if (!isOpen || !meal) return null;

  // --- FONKSİYONLAR ---

  // Yorum Gönderme
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: '@ben', // Giriş yapan kullanıcı adı (Normalde context'ten gelir)
      time: 'Şimdi',
      text: commentText
    };

    setComments([newComment, ...comments]); // Listeye ekle
    setCommentText(''); // Kutuyu temizle
    showToast('+15 XP: Yorum Yapıldı! ✍️'); // Bildirim ver
  };

  // Puan Verme
  const handleRate = (score) => {
    setUserRating(score);
    showToast(`+10 XP: ${score} Yıldız Verildi! ⭐`);
  };

  // Toast Gösterme Yardımcısı
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drag-bar" onClick={onClose}></div>
        
        {/* Kapak Fotoğrafı */}
        <div className="modal-hero" style={{ backgroundImage: `url('${meal.image_url}')` }}>
            <div className="modal-badge">
                <i className="fa-solid fa-fire"></i> {meal.mealnutrition.calories} Kcal
            </div>
        </div>

        <div className="m-title">{meal.name}</div>
        <div style={{ color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '600' }}>
            {meal.category.name}
        </div>

        {/* --- YENİ EKLENDİ: YILDIZ PUANLAMA --- */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', fontSize: '1.4rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <i 
                    key={star}
                    className={`fa-solid fa-star ${star <= userRating ? 'filled' : ''}`}
                    style={{ 
                        color: star <= userRating ? '#FFD60A' : '#3A3A3C', 
                        cursor: 'pointer',
                        transition: 'color 0.2s' 
                    }}
                    onClick={() => handleRate(star)}
                ></i>
            ))}
        </div>
        
        <div className="m-desc">{meal.description}</div>

        {/* Besin Değerleri */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#2C2C2E', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontWeight: '700' }}>{meal.mealnutrition.protein}g</div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Protein</div>
            </div>
            <div style={{ background: '#2C2C2E', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontWeight: '700' }}>{meal.mealnutrition.carbs}g</div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Karb</div>
            </div>
            <div style={{ background: '#2C2C2E', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontWeight: '700' }}>{meal.mealnutrition.fat}g</div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Yağ</div>
            </div>
        </div>

        {/* Yorum Kutusu (Dinamik) */}
        <div className="comment-box">
            <input 
                type="text" 
                className="c-input" 
                placeholder="Yorum yaz..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button className="c-btn" onClick={handleAddComment}>
                <i className="fa-solid fa-paper-plane"></i>
            </button>
        </div>

        {/* Yorum Listesi (Dinamik) */}
        <div className="comment-list">
            {comments.map((c) => (
                <div className="comment-item" key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.8rem' }}>
                        <span>{c.user}</span><span>{c.time}</span>
                    </div>
                    <div>{c.text}</div>
                </div>
            ))}
        </div>

        {/* --- TOAST (BİLDİRİM) --- */}
        <div className={`toast ${toast.show ? 'show' : ''}`} style={{position: 'fixed', left:'50%', transform:'translateX(-50%)'}}>
            <i className="fa-solid fa-trophy" style={{color: '#FFD60A'}}></i> 
            <span>{toast.message}</span>
        </div>

      </div>
    </div>
  );
};

export default MealDetailModal;