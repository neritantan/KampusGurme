// --- src/services/menuService.js ---

const db = {
  "2025-12-25": {
    menu_id: 99,
    date: "2025-12-25",
    meals: [
      { id: 10, name: "Yayla Çorbası", category: "Çorba", rating: 4.2, kcal: 120, prot: 4, carb: 15, fat: 5 },
      { id: 11, name: "Etli Kuru Fasulye", category: "Ana Yemek", rating: 4.8, kcal: 450, prot: 25, carb: 30, fat: 15 },
      { id: 12, name: "Pirinç Pilavı", category: "Yardımcı Yemek", rating: 4.5, kcal: 300, prot: 5, carb: 60, fat: 5 },
      { id: 13, name: "Mevsim Salata", category: "Salata", rating: 4.0, kcal: 50, prot: 1, carb: 10, fat: 0 }
    ]
  },
  "2025-12-26": { // Varsayılan açılış günü
    menu_id: 100,
    date: "2025-12-26",
    meals: [
      { id: 1, name: "Mercimek Çorbası", category: "Çorba", rating: 3.8, kcal: 150, prot: 5, carb: 20, fat: 5 },
      { id: 2, name: "Fırın Tavuk", category: "Ana Yemek", rating: 4.7, kcal: 500, prot: 35, carb: 40, fat: 20 },
      { id: 3, name: "Bulgur Pilavı", category: "Yardımcı Yemek", rating: 4.1, kcal: 280, prot: 6, carb: 55, fat: 4 },
      { id: 4, name: "Kemalpaşa", category: "Tatlı", rating: 2.1, kcal: 300, prot: 5, carb: 50, fat: 5 }
    ]
  },
  "2025-12-27": {
    menu_id: 101,
    date: "2025-12-27",
    meals: [
      { id: 20, name: "Domates Çorbası", category: "Çorba", rating: 4.0, kcal: 110, prot: 2, carb: 18, fat: 4 },
      { id: 21, name: "Izgara Köfte", category: "Ana Yemek", rating: 4.9, kcal: 550, prot: 40, carb: 10, fat: 25 },
      { id: 22, name: "Spagetti", category: "Yardımcı Yemek", rating: 4.3, kcal: 350, prot: 8, carb: 65, fat: 6 },
      { id: 23, name: "Elma", category: "Meyve", rating: 4.6, kcal: 60, prot: 0, carb: 15, fat: 0 }
    ]
  }
};

const formatDate = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
};

export const getDailyMenu = async (dateObj) => {
    const dateStr = formatDate(dateObj);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Veri yoksa rastgele birini döndür (Test için)
            resolve(db[dateStr] || db["2025-12-26"]);
        }, 100);
    });
};