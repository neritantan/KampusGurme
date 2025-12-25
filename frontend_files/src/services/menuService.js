// Mock Data Havuzu
const db = {
  "2025-12-25": {
    menu_id: 99,
    date: "2025-12-25",
    meals: [
      { id: 10, name: "Yayla Çorbası", category: "Başlangıç", rating: 4.2, kcal: 120, prot: 4, carb: 15, fat: 5, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/yayla-corbasi-yemekcom.jpg" },
      { id: 11, name: "Etli Kuru Fasulye", category: "Ana Yemek", rating: 4.8, kcal: 450, prot: 25, carb: 30, fat: 15, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/kuru-fasulye-yemekcom.jpg" },
      { id: 12, name: "Pirinç Pilavı", category: "Yardımcı", rating: 4.5, kcal: 300, prot: 5, carb: 60, fat: 5, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/pirinc-pilavi-yemekcom.jpg" }
    ]
  },
  "2025-12-26": {
    menu_id: 100,
    date: "2025-12-26",
    meals: [
      { id: 1, name: "Mercimek Çorbası", category: "Başlangıç", rating: 3.8, kcal: 150, prot: 5, carb: 20, fat: 5, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/mercimek-corbasi-yemekcom.jpg" },
      { id: 2, name: "Fırın Tavuk & Pilav", category: "Ana Yemek", rating: 4.7, kcal: 500, prot: 35, carb: 40, fat: 20, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2016/09/firin-tavuk-yemekcom.jpg" },
      { id: 3, name: "Kemalpaşa", category: "Tatlı", rating: 2.1, kcal: 300, prot: 5, carb: 50, fat: 5, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2015/04/kemalpasa-tatlisi-yemekcom.jpg" }
    ]
  },
  "2025-12-27": {
    menu_id: 101,
    date: "2025-12-27",
    meals: [
      { id: 20, name: "Domates Çorbası", category: "Başlangıç", rating: 4.0, kcal: 110, prot: 2, carb: 18, fat: 4, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/domates-corbasi-yemekcom.jpg" },
      { id: 21, name: "Izgara Köfte", category: "Ana Yemek", rating: 4.9, kcal: 550, prot: 40, carb: 10, fat: 25, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2015/02/izgara-kofte-yemekcom.jpg" },
      { id: 22, name: "Sütlaç", category: "Tatlı", rating: 4.6, kcal: 250, prot: 8, carb: 45, fat: 6, img: "https://cdn.yemek.com/mnresize/1250/833/uploads/2014/06/sutlac-yemekcom.jpg" }
    ]
  }
};

// Tarih objesini YYYY-MM-DD formatına çeviren yardımcı
const formatDate = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
};

export const getDailyMenu = async (dateObj) => {
    const dateStr = formatDate(dateObj);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Eğer o tarih için veri varsa onu, yoksa rastgele birini döndür (Test için)
            resolve(db[dateStr] || db["2025-12-26"]);
        }, 100);
    });
};