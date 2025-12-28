import api from './api';

const formatDate = (dateObj) => {
  // Yerel saat dilimine göre tarih oluştur (UTC farkını önlemek için)
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDailyMenu = async (dateObj) => {
  try {
    const dateStr = formatDate(dateObj);
    // Yeni Backend Endpoint: /menu/YYYY-MM-DD/
    const response = await api.get(`menu/${dateStr}/`);
    const data = response.data;

    if (!data || !data.meals) return null;

    // Adapter Pattern: Backend -> Frontend uyumluluğu
    const adaptedMeals = data.meals.map(meal => ({
      id: meal.meal_id,
      name: meal.name,
      category: (meal.category && meal.category.name) ? meal.category.name : "Diğer",
      rating: meal.rating ? parseFloat(meal.rating).toFixed(1) : "0.0", // Real average rating
      userRating: meal.user_rating || 0, // Real user rating (if logged in)
      kcal: meal.mealnutrition ? meal.mealnutrition.calories : 0,
      prot: meal.mealnutrition ? meal.mealnutrition.protein : 0,
      carb: meal.mealnutrition ? meal.mealnutrition.carbs : 0,
      fat: meal.mealnutrition ? meal.mealnutrition.fat : 0
    }));

    return { ...data, meals: adaptedMeals };

  } catch (error) {
    // 404 ise null dön (Yemek yok demektir)
    if (error.response && error.response.status === 404) {
      console.warn(`${formatDate(dateObj)} için yemek bulunamadı.`);
      return null;
    }
    console.error("Menü hatası:", error);
    return null;
  }
  return null;
}


export const getMonthlyMenu = async () => {
  try {
    const response = await api.get('menu/calendar/');
    // Backend returns: [{ date: "2025-12-26", main_dish: { ... } }, ...]
    // We might want to map it to a dictionary for easier lookup: { "26": { ... } }
    const data = response.data;
    const menuMap = {};
    data.forEach(item => {
      const d = new Date(item.date);
      const day = d.getDate();
      menuMap[day] = item.main_dish;
    });
    return menuMap;
  } catch (error) {
    console.error("Takvim verisi alınamadı:", error);
    return {};
  }
};