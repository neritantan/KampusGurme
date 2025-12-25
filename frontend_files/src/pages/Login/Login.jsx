import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleAuth = () => {
    // Burada backend isteği olacak
    navigate('/home');
  };

  return (
    <section className="screen active">
      <div className="auth-container">
        <div className="logo-container">
          <div className="brand-logo">Kampüs<span>Gurme</span></div>
          <div id="slogan">Tek hesap, sınırsız lezzet.</div>
        </div>
        
        <div className="auth-toggle">
          <div 
            className="toggle-bg" 
            style={{ transform: isRegister ? 'translateX(100%)' : 'translateX(0)' }}
          ></div>
          <div className={`toggle-btn ${!isRegister ? 'active' : ''}`} onClick={() => setIsRegister(false)}>Giriş</div>
          <div className={`toggle-btn ${isRegister ? 'active' : ''}`} onClick={() => setIsRegister(true)}>Kayıt</div>
        </div>

        <div id="authForm">
          {isRegister && (
             <div className="input-group" style={{animation: 'slideIn 0.3s'}}>
                <input type="text" className="custom-input" placeholder="Ad Soyad" />
             </div>
          )}
          <div className="input-group">
            <input type="email" className="custom-input" placeholder="Okul Maili (@sivas.edu.tr)" />
            <i className="fa-solid fa-envelope input-icon"></i>
          </div>
          <div className="input-group">
            <input type="password" className="custom-input" placeholder="Şifre" />
            <i className="fa-solid fa-lock input-icon"></i>
          </div>
          {isRegister && (
             <div className="input-group" style={{animation: 'slideIn 0.3s'}}>
                <input type="password" className="custom-input" placeholder="Şifre Tekrar" />
             </div>
          )}
          
          <button className="btn-primary" onClick={handleAuth}>
            {isRegister ? 'Hesap Oluştur' : 'Giriş Yap'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;