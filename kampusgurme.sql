CREATE TABLE "RANK" (
    rank_id SERIAL PRIMARY KEY,
    rank_name VARCHAR(50) UNIQUE NOT NULL,
    min_xp INT NOT NULL,
    icon_url VARCHAR(255)
);

CREATE TABLE "CATEGORY" (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "ALLERGEN" (
    allergen_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon_url VARCHAR(255) -- Bi Dursun
);

CREATE TABLE "DAILY_MENU" (
    menu_id SERIAL PRIMARY KEY,
    menu_date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ACTION_CONFIG" (
    action_id SERIAL PRIMARY KEY,
    action_name VARCHAR(100) NOT NULL,
    xp_value INT NOT NULL -- isim degisikligi
);

CREATE TABLE "USER" ( -- degisiklik var
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'admin')) NOT NULL,
    total_xp INT DEFAULT 0,
    rank_id INT REFERENCES "RANK"(rank_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "MEAL" (
    meal_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES "CATEGORY"(category_id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255)
);

CREATE TABLE "MEAL_NUTRITION" (
    meal_id INT PRIMARY KEY REFERENCES "MEAL"(meal_id) ON DELETE CASCADE,
    calories INT,
    protein INT,
    carbs INT,
    fat INT
);

CREATE TABLE "MEAL_ALLERGEN" (
    meal_id INT REFERENCES "MEAL"(meal_id) ON DELETE CASCADE,
    allergen_id INT REFERENCES "ALLERGEN"(allergen_id) ON DELETE CASCADE,
    PRIMARY KEY (meal_id, allergen_id)
);

CREATE TABLE "MENU_CONTENT" (
    menu_id INT REFERENCES "DAILY_MENU"(menu_id) ON DELETE CASCADE,
    meal_id INT REFERENCES "MEAL"(meal_id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, meal_id)
);

CREATE TABLE "ITEM_RATING" (
    rating_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "USER"(user_id) ON DELETE CASCADE,
    menu_id INT REFERENCES "DAILY_MENU"(menu_id) ON DELETE CASCADE,
    meal_id INT REFERENCES "MEAL"(meal_id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL, -- rating daha anlasilir
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "USER_COMMENT" (
    comment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "USER"(user_id) ON DELETE CASCADE,
    menu_id INT REFERENCES "DAILY_MENU"(menu_id) ON DELETE CASCADE,
    subject_meal_id INT REFERENCES "MEAL"(meal_id) ON DELETE CASCADE DEFAULT NULL,
    comment_text TEXT NOT NULL,
    comment_image_url VARCHAR(255) DEFAULT NULL,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ACTION_LOG" (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "USER"(user_id) ON DELETE CASCADE,
    action_id INT REFERENCES "ACTION_CONFIG"(action_id) ON DELETE CASCADE,
    xp_gained INT NOT NULL, -- isim degisikligi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);