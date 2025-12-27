import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, getCsrfToken } from '../../services/authService';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  // Sayfa açılışında CSRF token al
  useEffect(() => {
    getCsrfToken();
  }, []);

  const handleAuth = async () => {
    setError('');

    // Basit Validasyon
    if (!username || !password) {
      setError("Kullanıcı adı ve şifre zorunludur.");
      return;
    }

    if (isRegister) {
      if (password !== passwordConfirm) {
        setError("Şifreler eşleşmiyor.");
        return;
      }
      if (!email) {
        setError("Email zorunludur.");
        return;
      }
    }

    try {
      if (isRegister) {
        // Kayıt Ol
        await register({
          username,
          email,
          password,
          password_confirm: passwordConfirm
        });
        // Başarılı kayıt sonrası direkt giriş yapabilir veya ekranı değiştirebiliriz
        // Kullanıcı kolaylığı için direkt logine yönlendirip bilgilerini taşıyoruz
        alert("Kayıt başarılı! Giriş yapılıyor...");
        await login(username, password);
        navigate('/home');
      } else {
        // Giriş Yap
        await login(username, password);
        navigate('/home');
      }
    } catch (err) {
      console.error("Auth hatası:", err);
      // Backend'den gelen hatayı veya genel hatayı göster
      if (err.response && err.response.data) {
        // Detaylı hata mesajı varsa yakala (örn: username taken)
        const msg = typeof err.response.data === 'string'
          ? err.response.data
          : Object.values(err.response.data).join(', ');
        setError(msg || "Bir hata oluştu.");
      } else {
        setError("Sunucuya bağlanılamadı.");
      }
    }
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
          {error && <div style={{ color: '#FF453A', marginBottom: '10px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

          {/* Username Input - Removed duplicate isRegister block here */}

          {/* Login modunda da username lazım ama Register'da zaten yukarıda var. 
              UI tasarımında Login'de username yoktu, eklememiz lazım. 
              Login sayfasında "Kullanıcı Adı" ve "Şifre" olur. 
              Tasarımda sadece Email mi vardı? Hayır, kodda placeholder "Kullanıcı Adı" register kısmında gizliydi.
              Düzeltme: Login için de username inputu her zaman görünür olmalı veya email ile giriş yapılıyor mu?
              Backend LoginView: username ve password istiyor. 
              O yüzden Username inputunu CONSTANT yapıyorum (her iki modda da var). 
           */}

          {/* Username Input - Her zaman görünür olsun (veya Login'de görünsün) */}
          <div className="input-group">
            <input
              type="text"
              className="custom-input"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="fa-solid fa-user input-icon"></i>
          </div>

          {isRegister && (
            <div className="input-group" style={{ animation: 'slideIn 0.3s' }}>
              <input
                type="email"
                className="custom-input"
                placeholder="Okul Maili (@sivas.edu.tr)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="fa-solid fa-envelope input-icon"></i>
            </div>
          )}

          <div className="input-group">
            <input
              type="password"
              className="custom-input"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="fa-solid fa-lock input-icon"></i>
          </div>

          {isRegister && (
            <div className="input-group" style={{ animation: 'slideIn 0.3s' }}>
              <input
                type="password"
                className="custom-input"
                placeholder="Şifre Tekrar"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
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