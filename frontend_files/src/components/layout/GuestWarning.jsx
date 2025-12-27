import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuestWarning = ({ message = "Bu sayfayı görüntülemek için giriş yapmalısınız." }) => {
    const navigate = useNavigate();

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            color: '#888'
        }}>
            <div style={{
                fontSize: '4rem',
                marginBottom: '20px',
                color: '#333'
            }}>
                <i className="fa-solid fa-lock"></i>
            </div>
            <h2 style={{ color: 'white', marginBottom: '10px' }}>Erişim Kısıtlı</h2>
            <p style={{ marginBottom: '30px' }}>{message}</p>

            <button
                onClick={() => navigate('/login')}
                className="btn-primary"
                style={{ maxWidth: '200px' }}
            >
                Giriş Yap <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginLeft: '10px' }}></i>
            </button>
        </div>
    );
};

export default GuestWarning;
