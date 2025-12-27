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
      rating: (Math.random() * 2 + 3).toFixed(1), // Rating yine random şimdilik
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
};