# Laravel + React js
This is a full-stack web application boilerplate using Laravel (as backend API) and React.js (as frontend SPA).

## 📦 Tech Stack

**Backend**  
🟢 Laravel 12  
🟢 PHP 8.2+  
🟢 MySQL/PostgreSQL  

**Frontend**  
🔵 React.js 19  
🔵 Vite  
🔵 Tailwind CSS  
🔵 Axios for API calls  
## 🚀 Getting Started

### 1. Clone the Repository
```bash
https://github.com/mohamedraissi/tic-tac-toe.git
cd tic-tac-toe ```

### 2. Install Backend Dependencies
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

### 3. Serve the Application
```bash
php artisan serve

## 🎯 Frontend React – Tic Tac Toe

The application frontend (developed with React.js) is located in the folder:

📁 tic-tac-toe-frontend/
⚠️ Note: You don’t need to follow these steps unless you want to modify the React frontend
### 🔧 Installation and Launch of the Frontend
```bash
cd tic-tac-toe-frontend
npm install
npm start
 
## 🚀 Build & Deploy Frontend Inside Laravel

After development, you can build your React frontend and copy the production files inside your Laravel app's public directory (e.g., public/elifiwes):

### 🛠 Build the React App

```bash
cd tic-tac-toe-frontend
npm run build

This will generate a build/ folder containing your static production files.
📁 Copy to Laravel Public Directory
