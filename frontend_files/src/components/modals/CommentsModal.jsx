import React, { useState } from 'react';

const CommentsModal = ({ isOpen, onClose, menuMeals, onAddComment }) => {
    const [target, setTarget] = useState('general'); // 'general' veya meal_id
    const [text, setText] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!text.trim()) return;
        
        // Hedef ismini bul
        let targetName = "Genel";
        if (target !== 'general') {
            const meal = menuMeals.find(m => m.id.toString() === target);
            if (meal) targetName = meal.name;
        }

        // Yeni yorum objesini oluştur
        const newComment = {
            id: Date.now(),
            user: '@ben', // Şimdilik sabit
            time: 'Şimdi',
            text: text,
            targetName: targetName
        };

        // Ana sayfaya gönder
        onAddComment(newComment);
        
        // Temizle ve Kapat
        setText('');
        onClose();
    };

    return (
        <div className="modal-overlay open" onClick={onClose}>
            {/* height: auto yaptık ki ekranı tamamen kaplamasın, sadece input kadar olsun */}
            <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{height: 'auto', minHeight: '300px'}}>
                <div className="drag-bar" onClick={onClose}></div>
                
                <div className="header" style={{marginBottom: '20px'}}>
                    <div className="brand-logo" style={{fontSize: '1.5rem'}}>Yorum<span>Yap</span></div>
                    <div onClick={onClose} style={{cursor:'pointer'}}><i className="fa-solid fa-xmark"></i></div>
                </div>

                <div style={{background: '#2C2C2E', padding: '15px', borderRadius: '15px', marginBottom: '20px'}}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '8px', fontWeight:'600'}}>
                            Hangi yemek hakkında?
                        </label>
                        <select 
                            className="custom-input" 
                            style={{padding: '12px', height: 'auto', width: '100%', background:'#1C1C1E', border:'1px solid #444'}}
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                        >
                            <option value="general">📋 Menü Geneli</option>
                            {menuMeals && menuMeals.map(meal => (
                                <option key={meal.id} value={meal.id}>🍽️ {meal.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{marginBottom: '10px'}}>
                        <label style={{fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '8px', fontWeight:'600'}}>
                            Düşüncelerin:
                        </label>
                        <textarea 
                            className="c-input" 
                            rows="4"
                            placeholder="Tadı nasıldı? Porsiyon yeterli miydi?" 
                            value={text}
                            onChange={e => setText(e.target.value)}
                            style={{width: '100%', resize: 'none'}}
                        />
                    </div>

                    <button className="btn-primary" onClick={handleSubmit} style={{marginTop: '10px'}}>
                        Yorumu Paylaş <i className="fa-solid fa-paper-plane" style={{marginLeft:'10px'}}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsModal;