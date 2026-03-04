# Mealer 🥗

Mealer is an advanced AI-driven meal and grocery intelligence platform. It transforms standard nutrition tracking into a predictive financial and health intelligence system.

## 🚀 Vision: Tracker → Intelligence Layer

Standard apps track what you *did*. Mealer predicts what you *should* do to optimize both your health and your wallet.

## ✨ Key Features

### 🧠 Advanced Custom Meal Intelligence
- **Smart Builder**: Auto-detect macros and estimate nutrition from natural language descriptions.
- **Predictive Analytics**: Glycemic impact forecasting and processed ingredient detection.
- **Meal Improvement**: AI-driven suggestions for healthier or more cost-effective alternatives.

### 📅 AI-Driven Meal Planning
- **Full-Month Optimization**: Generate 30-day plans constrained by your budget and health goals.
- **Dynamic Re-balancing**: Automatically adjusts your plan when you deviate or skip meals.
- **Macro Cycling**: Optimized for activity levels and variety.

### 🌍 Localization & Financial Intelligence
- **Country-Aware**: Intelligent awareness of local cuisines, regional food prices, and seasonal availability.
- **Financial Forecasting**: Predictive insights into grocery spending and inflation impact.
- **Bulk Logic**: Smart suggestions for bulk purchasing vs. nutrition score.

### 📊 Comprehensive Analytics
- **Health Risk Forecasting**: Predictive alerts for nutrient deficiencies or health goals.
- **Behavioral Learning**: Adapts to your preferences and budget sensitivity over time.
- **Emotional Correlation**: Tracks the relationship between mood and nutrition.

## 🛠️ Technology Stack

- **Backend**: [Laravel 12](https://laravel.com/) (PHP)
- **Frontend**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Intelligence**: Integrated AI micro-services (GPT-4o/Gemini)

## 🏎️ Getting Started

### Prerequisites
- PHP 8.2+
- Node.js & npm
- Composer
- MySQL/PostgreSQL

### Backend Setup
```bash
cd mealer-backend
composer install
cp .env.example .env # Configure your DB and AI keys
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend Setup
```bash
cd mealer-web
npm install
npm run dev
```

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

---
Developed with ❤️ by [DevMwarabu](https://github.com/DevMwarabu)
# Mealer
