import React, { useState } from 'react';
import { menuData } from '../../services/menuService'; // Gerçek veri için

const Calendar = () => {
  const [openDay, setOpenDay] = useState(26); // Başlangıçta ayın 26'sı açık
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = 26;

  // Placeholder veri
  const mains = [{name:"Kuru Fasulye",icon:"bowl-rice"}, {name:"İzmir Köfte",icon:"drumstick-bite"}, {name:"Et Sote",icon:"utensils"}];

  return (
    <section className="screen">
      <header className="header">
        <div className="brand-logo" style={{fontSize:'1.5rem'}}>Yemek<span>Ajandası</span></div>
      </header>
      <div style={{fontSize:'1.2rem', fontWeight:'800', marginBottom:'15px', color:'var(--text-muted)'}}>Aralık 2025</div>
      
      <div className="timeline">
        {days.map(day => {
            const isToday = day === today;
            const isOpen = openDay === day;
            const rndMain = mains[Math.floor(Math.random()*mains.length)];
            
            return (
                <div key={day} className={`t-item ${isToday ? 'active' : ''} ${isOpen ? 'open' : ''}`} onClick={() => setOpenDay(isOpen ? null : day)}>
                    <div className="t-dot"></div>
                    <div className="t-date">{day} Aralık</div>
                    
                    <div className="t-card">
                        <div className="t-card-header">
                            {isToday ? (
                                <div className="t-img-thumb" style={{backgroundImage:`url('${menuData.meals[1].image_url}')`, display:'block', width:'40px', height:'40px', borderRadius:'8px', backgroundSize:'cover'}}></div>
                            ) : (
                                <div className="t-icon"><i className={`fa-solid fa-${rndMain.icon}`}></i></div>
                            )}
                            
                            <div className="t-content" style={{paddingLeft:'10px'}}>
                                <div className="t-main-dish">{isToday ? menuData.meals[1].name : rndMain.name}</div>
                                <div className="t-subtitle" style={{color: isToday ? 'var(--primary)' : 'var(--text-muted)'}}>
                                    {isToday ? 'Bugünün Menüsü' : 'Detaylar için dokun'}
                                </div>
                            </div>
                            <div className="t-arrow"><i className="fa-solid fa-chevron-down"></i></div>
                        </div>

                        {/* Accordion Body */}
                        <div className="t-body" style={{ maxHeight: isOpen ? '500px' : '0' }}>
                            <div className="t-menu-list">
                                {isToday ? (
                                    menuData.meals.map((m, i) => (
                                        <div className="t-menu-row" key={i}>
                                            <div className="t-cat">{m.category.name}</div>
                                            <div className="t-food">{m.name}</div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="t-menu-row"><div className="t-cat">Çorba</div><div className="t-food">Ezogelin Çorbası</div></div>
                                        <div className="t-menu-row"><div className="t-cat">Ana Yemek</div><div className="t-food">{rndMain.name}</div></div>
                                        <div className="t-menu-row"><div className="t-cat">Yardımcı</div><div className="t-food">Pirinç Pilavı</div></div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </section>
  );
};

export default Calendar;