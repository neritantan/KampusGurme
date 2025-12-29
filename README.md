# KampusGurme - Setup & Run Guide

Run the following commands in two separate terminal windows to start the project.

### 1. Terminal (Backend - Python/Django)
This terminal sets up the database connection and starts the API server.

```bash
cd backend_files

# Create and activate virtual environment (Linux/Mac)
python3 -m venv venv
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Start the server
python manage.py runserver
```

---

### 2. Terminal (Frontend - React/Vite)
This terminal starts the user interface.

```bash
cd frontend_files

# Install dependencies
npm install

# Start the application
npm run dev
```

> **Note:** The application will run at `http://localhost:5173`.
