import React, { useEffect, useState } from 'react';
import { getDailyMenu } from '../../services/menuService';
import MealDetailModal from '../../components/modals/MealDetailModal';

const Home = () => {
  const [menu, setMenu] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [nutrition, setNutrition] = useState({ kcal: 0, prot: 0, carb: 0, fat: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDailyMenu();
      setMenu(data);
      
      // Toplam Besin Hesabı
      const totals = data.meals.reduce((acc, meal) => {
        acc.kcal += meal.mealnutrition.calories;
        acc.prot += meal.mealnutrition.protein;
        acc.carb += meal.mealnutrition.carbs;
        acc.fat += meal.mealnutrition.fat;
        return acc;
      }, { kcal: 0, prot: 0, carb: 0, fat: 0 });
      setNutrition(totals);
    };
    fetchData();
  }, []);

  return (
    <section className="screen">
      <header className="header">
        <div className="brand-logo" style={{fontSize:'1.5rem'}}>Kampüs<span>Gurme</span></div>
        <i className="fa-solid fa-bell" style={{fontSize:'1.2rem'}}></i>
      </header>
      
      <div className="date-nav">
        <i className="fa-solid fa-chevron-left nav-arrow"></i>
        <div style={{textAlign:'center'}}>
            <div style={{fontSize:'1.4rem', fontWeight:'800'}}>Perşembe</div>
            <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>26 Aralık 2025</div>
        </div>
        <i className="fa-solid fa-chevron-right nav-arrow"></i>
      </div>

      <div id="home-cards-container">
        {menu && menu.meals.map((meal, index) => (
          <div className="dish-card" key={index} onClick={() => setSelectedMeal(meal)}>
            <div className="dish-img" style={{ backgroundImage: `url('${meal.image_url}')` }}></div>
            <div className="dish-info">
                <div className="d-head">
                    <span className="d-name">{meal.name}</span>
                    <span className="d-score" style={{fontSize:'0.8rem', color:'#aaa'}}>{meal.category.name}</span>
                </div>
                <div style={{fontSize:'0.8rem', color:'#888'}}>{meal.mealnutrition.calories} Kcal</div>
                <div className="star-row" onClick={(e) => e.stopPropagation()}>
                    {[1,2,3,4,5].map(i => <i key={i} className="fa-solid fa-star filled"></i>)}
                </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{background:'var(--bg-card)', padding:'15px', borderRadius:'20px', display:'flex', justifyContent:'space-between', marginTop:'20px', border:'1px solid #333'}}>
        <div style={{textAlign:'center'}}><div style={{color:'var(--primary)', fontWeight:'800'}}>{nutrition.kcal}</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>Kcal</div></div>
        <div style={{textAlign:'center'}}><div style={{fontWeight:'700'}}>{nutrition.prot}g</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>Prot</div></div>
        <div style={{textAlign:'center'}}><div style={{fontWeight:'700'}}>{nutrition.carb}g</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>Karb</div></div>
        <div style={{textAlign:'center'}}><div style={{fontWeight:'700'}}>{nutrition.fat}g</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>Yağ</div></div>
      </div>

      <MealDetailModal isOpen={!!selectedMeal} onClose={() => setSelectedMeal(null)} meal={selectedMeal} />
    </section>
  );
};

export default Home;