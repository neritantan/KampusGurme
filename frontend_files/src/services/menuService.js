// Orijinal JSON Verisi
export const menuData = {
  "menu_id": 100,
  "menu_date": "2025-12-26",
  "meals": [
    {
      "meal_id": 1,
      "name": "Mercimek Çorbası",
      "description": "Sıcacık, bol limonlu geleneksel lezzet. Kış aylarının vazgeçilmezi.",
      "image_url": "https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/mercimek-corbasi-yemekcom.jpg",
      "category": { "category_id": 1, "name": "Başlangıç" },
      "mealnutrition": { "calories": 150, "protein": 5, "carbs": 20, "fat": 5 }
    },
    {
      "meal_id": 2,
      "name": "Fırın Tavuk & Pilav",
      "description": "Nar gibi kızarmış tavuk but ve tereyağlı pirinç pilavı. Protein deposu.",
      "image_url": "https://cdn.yemek.com/mnresize/1250/833/uploads/2016/09/firin-tavuk-yemekcom.jpg",
      "category": { "category_id": 2, "name": "Ana Yemek" },
      "mealnutrition": { "calories": 500, "protein": 35, "carbs": 40, "fat": 20 }
    },
    {
      "meal_id": 3,
      "name": "Kemalpaşa",
      "description": "Şerbetli peynir tatlısı, tahin ile servis edilir. Enerji verir.",
      "image_url": "https://cdn.yemek.com/mnresize/1250/833/uploads/2015/04/kemalpasa-tatlisi-yemekcom.jpg",
      "category": { "category_id": 3, "name": "Tatlı" },
      "mealnutrition": { "calories": 300, "protein": 5, "carbs": 50, "fat": 5 }
    }
  ]
};

// Veriyi asenkron olarak döndüren fonksiyon (Backend taklidi)
export const getDailyMenu = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(menuData);
        }, 100); // 100ms gecikme simülasyonu
    });
};