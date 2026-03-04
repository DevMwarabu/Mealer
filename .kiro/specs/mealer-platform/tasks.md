# Implementation Plan: Mealer Platform

## Overview

This implementation plan breaks down the Mealer platform into discrete coding tasks across project setup, database layer, backend API, frontend components, AI features, analytics, caching, security, and testing. The platform uses Laravel (PHP) for the backend, React with TypeScript for the frontend, MySQL for the database, and Redis for caching.

## Tasks

- [ ] 1. Project Setup and Infrastructure
  - [x] 1.1 Initialize Laravel backend project
    - Create Laravel project using composer: `composer create-project laravel/laravel mealer-backend`
    - Set up directory structure following Laravel conventions
    - Install core dependencies: Laravel Sanctum, Laravel Horizon (queue), Predis (Redis)
    - Configure .env file for MySQL database (mealer_platform, root user, no password, 127.0.0.1:3306)
    - _Requirements: 18.1, 18.6_
  
  - [~] 1.2 Initialize React frontend project
    - Create React app with Vite and TypeScript: `npm create vite@latest mealer-web -- --template react-ts`
    - Set up project structure: src/api/, src/components/, src/features/, src/hooks/, src/layouts/, src/routes/, src/store/, src/utils/
    - Install dependencies: axios, @tanstack/react-query, zustand, react-router-dom, recharts, tailwindcss
    - Configure Tailwind CSS with postcss and autoprefixer
    - Configure .env for API base URL (http://localhost:8000/api)
    - _Requirements: 22.1_
  
  - [x] 1.3 Create MySQL database and configure connections
    - Create mealer_platform database in MySQL with utf8mb4 charset
    - Configure Laravel database connection in config/database.php
    - Test database connection with `php artisan migrate:status`
    - _Requirements: 1.1, 19.1_


- [ ] 2. Database Schema and Migrations
  - [x] 2.1 Create User model and authentication tables
    - Create Laravel migration for users table with name, email, password, daily_calorie_target, monthly_budget_target, height, weight
    - Add unique index on email column
    - Create User model extending Authenticatable with fillable fields
    - _Requirements: 1.1, 1.2, 20.2_
  
  - [~] 2.2 Create Ingredient catalog tables
    - Create migration for ingredients table with name, category_id, avg_price, calories_per_unit, protein, carbs, fat, fiber, iron, calcium, vitamin_d, sodium, sugar
    - Create migration for ingredient_categories table with name
    - Add indexes on name (for search) and category_id
    - Create Ingredient and IngredientCategory models with relationships
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [~] 2.3 Create Meal and MealItem tables
    - Create migration for meals table with user_id, meal_type (enum: breakfast, lunch, dinner, snack), consumed_at, total_cost, total_calories, total_protein, total_carbs, total_fat, total_sodium, total_sugar, notes
    - Create migration for meal_items table with meal_id, ingredient_id, quantity, unit, cost, calories
    - Add composite index on (user_id, consumed_at) for meals table
    - Add foreign keys with onDelete('cascade')
    - Create Meal and MealItem models with relationships
    - _Requirements: 2.1, 2.4, 2.5, 19.1_
  
  - [~] 2.4 Create GroceryPurchase and GroceryItem tables
    - Create migration for groceries table with user_id, store_name, purchased_at, total_amount
    - Create migration for grocery_items table with grocery_id, ingredient_id, quantity, price, expiry_date, health_grade (enum: A-F), food_classification (enum: whole_food, processed, ultra_processed)
    - Add composite index on (user_id, purchased_at) for groceries table
    - Add foreign keys with onDelete('cascade')
    - Create Grocery and GroceryItem models with relationships
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 19.2_
  
  - [~] 2.5 Create Recipe tables
    - Create migration for recipes table with user_id, title, description, instructions (text), prep_time, difficulty (enum: easy, medium, hard), ai_generated (boolean)
    - Create migration for recipe_ingredients table with recipe_id, ingredient_id, quantity, unit
    - Add indexes on user_id and difficulty
    - Create Recipe and RecipeIngredient models with relationships
    - _Requirements: 5.1, 5.2, 5.6_
  
  - [~] 2.6 Create health tracking tables
    - Create migration for water_logs table with user_id, amount_ml, logged_at
    - Create migration for body_metrics table with user_id, weight, bmi, body_fat_percentage, measured_at
    - Add composite indexes on (user_id, logged_at) and (user_id, measured_at)
    - Create WaterLog and BodyMetric models with relationships
    - _Requirements: 13.1, 14.1_
  
  - [~] 2.7 Create AI and analytics tables
    - Create migration for ai_logs table with user_id, log_type, context (json), prediction (json), confidence, created_at
    - Create migration for alerts table with user_id, alert_type, severity, message, is_read, created_at
    - Create migration for audit_logs table with user_id, action, resource, ip_address, user_agent, created_at
    - Add indexes on user_id and created_at for all tables
    - Create AILog, Alert, and AuditLog models
    - _Requirements: 7.4, 12.6, 20.4_



- [ ] 3. Authentication and Authorization
  - [~] 3.1 Implement Laravel Sanctum authentication
    - Install and configure Laravel Sanctum
    - Create AuthController with register, login, logout methods
    - Implement JWT token generation with 24-hour expiry
    - Add password hashing with bcrypt (cost factor 12)
    - _Requirements: 1.2, 20.2, 20.3_
  
  - [~] 3.2 Implement row-level security middleware
    - Create middleware to enforce user_id filtering on all queries
    - Apply middleware to all protected routes
    - Test that users cannot access other users' data
    - _Requirements: 1.4, 20.1_
  
  - [-] 3.3 Implement API rate limiting
    - Configure rate limiting to 100 requests per minute per user
    - Add rate limit headers to API responses
    - Create custom rate limit exceeded response
    - _Requirements: 1.5_


- [ ] 4. Core API Endpoints - Meals
  - [~] 4.1 Create MealController with CRUD operations
    - Implement index() method with pagination and date filtering
    - Implement store() method to create meals with meal_items
    - Implement show() method to retrieve meal with items and ingredients
    - Implement update() method to modify meals
    - Implement destroy() method to delete meals
    - _Requirements: 2.1, 18.1_
  
  - [~] 4.2 Implement automatic meal calculations
    - Create MealService to calculate total_cost from meal_items
    - Create MealService to calculate total_calories from meal_items
    - Calculate and store nutrition snapshot (protein, carbs, fat, sodium, sugar)
    - Trigger calculations on meal save
    - _Requirements: 2.2, 2.3, 2.5_
  
  - [~] 4.3 Add meal validation rules
    - Validate meal_type is one of: breakfast, lunch, dinner, snack
    - Validate consumed_at is a valid datetime
    - Validate meal_items array has at least one item
    - Validate ingredient_id exists in ingredients table
    - _Requirements: 2.6, 20.5_


- [ ] 5. Core API Endpoints - Groceries
  - [~] 5.1 Create GroceryController with CRUD operations
    - Implement index() method with pagination and date filtering
    - Implement store() method to create grocery purchases with items
    - Implement show() method to retrieve purchase with items
    - Implement update() method to modify purchases
    - Implement destroy() method to delete purchases
    - _Requirements: 4.1, 18.1_
  
  - [~] 5.2 Implement automatic grocery calculations
    - Create GroceryService to calculate total_amount from grocery_items
    - Classify each grocery_item as whole_food, processed, or ultra_processed
    - Assign health_grade (A-F) based on nutritional profile
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [~] 5.3 Add grocery validation rules
    - Validate store_name is not empty
    - Validate purchased_at is a valid datetime
    - Validate expiry_date is after purchased_at
    - Validate grocery_items array has at least one item
    - _Requirements: 20.5_


- [ ] 6. Core API Endpoints - Ingredients
  - [~] 6.1 Create IngredientController with CRUD operations
    - Implement index() method with search and pagination
    - Implement store() method to create custom ingredients
    - Implement show() method to retrieve ingredient details
    - Implement update() method to modify ingredients
    - Implement destroy() method to delete ingredients
    - _Requirements: 3.3, 3.4, 18.1_
  
  - [~] 6.2 Implement ingredient search
    - Add search functionality by name with LIKE query
    - Return results within 200ms for typical queries
    - Add pagination to search results
    - _Requirements: 3.3_
  
  - [~] 6.3 Seed ingredient database
    - Create seeder with common ingredients (vegetables, proteins, grains, dairy)
    - Include nutritional data for each ingredient
    - Run seeder to populate initial catalog
    - _Requirements: 3.1, 3.2_


- [ ] 7. Core API Endpoints - Recipes
  - [~] 7.1 Create RecipeController with CRUD operations
    - Implement index() method with filtering by difficulty
    - Implement store() method to create recipes with ingredients
    - Implement show() method to retrieve recipe with ingredients
    - Implement update() method to modify recipes
    - Implement destroy() method to delete recipes
    - _Requirements: 5.1, 18.1_
  
  - [~] 7.2 Implement recipe calculations
    - Calculate total macro breakdown from recipe_ingredients
    - Calculate estimated total_cost from current ingredient prices
    - Display calculations in recipe show response
    - _Requirements: 5.3, 5.4_
  
  - [~] 7.3 Implement recipe-to-meal conversion
    - Create endpoint POST /recipes/{id}/convert-to-meal
    - Create meal with meal_items from recipe_ingredients
    - Set consumed_at to current timestamp
    - Return created meal
    - _Requirements: 5.5_


- [ ] 8. Health Score Calculation
  - [~] 8.1 Create HealthScoreService
    - Implement calculateNutritionBalance() method (40% weight)
    - Implement calculateBudgetEfficiency() method (20% weight)
    - Implement calculateDiversityIndex() method (20% weight)
    - Implement calculateConsistencyScore() method (20% weight)
    - Combine into overall health_score (0-100)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [~] 8.2 Create HealthScoreController
    - Implement GET /health-score endpoint
    - Calculate daily health score for authenticated user
    - Cache result in Redis with 1-hour TTL
    - Return score with breakdown of components
    - _Requirements: 6.7, 19.3_
  
  - [~] 8.3 Add health score to dashboard
    - Include health_score in dashboard API response
    - Add trend indicator (up, down, stable) based on 7-day comparison
    - _Requirements: 15.1_


- [ ] 9. Hydration and Body Metrics
  - [~] 9.1 Create WaterLogController
    - Implement POST /water-logs to log water intake
    - Implement GET /water-logs to retrieve daily logs
    - Calculate daily hydration total
    - Update within 200ms
    - _Requirements: 13.1, 13.2_
  
  - [~] 9.2 Implement hydration target calculation
    - Calculate target as 35ml per kg of body weight
    - Display progress as percentage of target
    - _Requirements: 13.3, 13.5_
  
  - [~] 9.3 Create BodyMetricController
    - Implement POST /body-metrics to log measurements
    - Implement GET /body-metrics with 7-day, 30-day, 90-day views
    - Auto-calculate BMI from weight and height
    - _Requirements: 14.1, 14.2, 14.5_


- [ ] 10. Dashboard API
  - [~] 10.1 Create DashboardController
    - Implement GET /dashboard endpoint
    - Aggregate health_score, monthly spending, daily calories
    - Include grocery cost breakdown by category
    - Include active alerts
    - Include top 5 expensive ingredients
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_
  
  - [~] 10.2 Implement dashboard caching
    - Cache dashboard data in Redis with 15-minute TTL
    - Invalidate cache on relevant data changes
    - Ensure dashboard loads within 2 seconds
    - _Requirements: 15.7, 15.8, 19.4_


- [ ] 11. AI Feature - Budget Forecasting
  - [~] 11.1 Create BudgetForecastService
    - Analyze current month spending patterns
    - Calculate average daily spending
    - Project end-of-month spending
    - Calculate forecast confidence percentage
    - _Requirements: 7.1, 7.3_
  
  - [~] 11.2 Implement over-budget alerts
    - Check if forecast exceeds budget_target by 10%
    - Generate alert if threshold exceeded
    - Store alert in alerts table
    - _Requirements: 7.2_
  
  - [~] 11.3 Create BudgetForecastJob
    - Create Laravel job for async processing
    - Store results in ai_logs table
    - Cache results for 24 hours
    - _Requirements: 7.4, 7.5, 7.6_


- [ ] 12. AI Feature - Waste Detection
  - [~] 12.1 Create WasteDetectionService
    - Scan grocery_items for expired items (past expiry_date)
    - Generate expiry alerts for items expiring within 3 days
    - Identify unused items (purchased >14 days ago, no meal_item usage)
    - Calculate monthly waste_cost
    - _Requirements: 9.1, 9.2, 9.3, 9.5_
  
  - [~] 12.2 Implement recipe suggestions for unused items
    - Query recipes containing unused ingredients
    - Rank by number of matching ingredients
    - Return top 5 suggestions
    - _Requirements: 9.4_
  
  - [~] 12.3 Create WasteDetectionJob
    - Schedule daily job to run waste detection
    - Store results in ai_logs
    - Generate alerts for expiring items
    - _Requirements: 9.6_


- [ ] 13. AI Feature - Nutrition Intelligence
  - [~] 13.1 Create NutritionAnalysisService
    - Analyze daily calorie intake vs target (detect >10% surplus/deficit)
    - Analyze macro ratios (protein <15%, carbs >60%, fat >40%)
    - Detect patterns persisting for 7+ days
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [~] 13.2 Implement meal timing analysis
    - Detect late_night_eating (meals after 10 PM, 3+ days/week)
    - Detect skipped_breakfast (no breakfast before 11 AM, 3+ days/week)
    - Calculate fasting_intervals between last and first meal
    - _Requirements: 10.4, 24.1, 24.2, 24.3_
  
  - [~] 13.3 Create NutritionAnalysisJob
    - Store pattern detection in ai_logs
    - Generate trend alerts
    - Display alerts on dashboard within 1 hour
    - _Requirements: 10.5, 10.6_


- [ ] 14. AI Feature - Nutrition Risk Detection
  - [~] 14.1 Create NutritionRiskService
    - Check daily sodium >2300mg (generate high_sodium alert)
    - Check daily sugar >50g (generate excess_sugar alert)
    - Check protein <0.8g/kg for 5+ days (generate low_protein alert)
    - Check calories <1200 for 7+ days (generate chronic_deficit alert)
    - Check calories >target+500 for 7+ days (generate chronic_surplus alert)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [~] 14.2 Display risk alerts on dashboard
    - Include risk alerts in dashboard API response
    - Mark alerts as prominent/high priority
    - _Requirements: 12.6_


- [ ] 15. Analytics and Reports
  - [~] 15.1 Create MonthlyReportService
    - Calculate total_spending for month
    - Calculate average_daily_calories
    - Calculate macro_distribution percentages
    - Calculate meal_frequency by meal_type
    - Calculate cost_per_calorie and cost_per_100g_protein
    - _Requirements: 16.1, 16.2_
  
  - [~] 15.2 Implement expensive ingredients analysis
    - Query top 10 most expensive ingredients from past 30 days
    - Group by ingredient and sum costs
    - _Requirements: 16.3_
  
  - [~] 15.3 Implement eating pattern analysis
    - Cluster meals by time_of_day
    - Calculate diversity_index (vegetable variety, protein variety)
    - _Requirements: 16.4, 16.5_
  
  - [~] 15.4 Create MonthlyReportJob
    - Schedule nightly batch job to precompute reports
    - Store results in Redis cache
    - _Requirements: 16.6_


- [ ] 16. Data Export
  - [~] 16.1 Create ExportController
    - Implement GET /export/csv endpoint
    - Implement GET /export/json endpoint
    - Export meals, groceries, body_metrics
    - Include data dictionary
    - _Requirements: 17.1, 17.4_
  
  - [~] 16.2 Implement export generation
    - Generate exports within 30 seconds for <10k records
    - Process large exports (>10k) via job queue
    - Notify user when export is ready
    - _Requirements: 17.3, 17.5_


- [ ] 17. Frontend - Project Setup
  - [~] 17.1 Configure Axios API client
    - Create src/api/axios.ts with base URL configuration
    - Add request interceptor for JWT token
    - Add response interceptor for error handling
    - Configure withCredentials for CORS
    - _Requirements: 18.1_
  
  - [~] 17.2 Set up React Query
    - Configure QueryClient in main.tsx
    - Wrap app with QueryClientProvider
    - Configure default query options (staleTime, cacheTime)
    - _Requirements: 19.3_
  
  - [~] 17.3 Set up Zustand store
    - Create src/store/userStore.ts for user state
    - Create src/store/authStore.ts for authentication state
    - _Requirements: 20.3_
  
  - [~] 17.4 Configure React Router
    - Set up routes for dashboard, meals, groceries, recipes, health
    - Implement protected route wrapper
    - Add 404 page
    - _Requirements: 22.1_


- [ ] 18. Frontend - Authentication
  - [~] 18.1 Create authentication API layer
    - Create src/api/auth.api.ts with register, login, logout functions
    - Handle JWT token storage in localStorage
    - _Requirements: 1.2, 20.3_
  
  - [~] 18.2 Create Login and Register pages
    - Create src/features/auth/Login.tsx
    - Create src/features/auth/Register.tsx
    - Add form validation
    - Handle authentication errors
    - _Requirements: 1.2_
  
  - [~] 18.3 Implement protected routes
    - Create ProtectedRoute component
    - Redirect to login if not authenticated
    - Check token expiry
    - _Requirements: 20.3_


- [ ] 19. Frontend - Dashboard
  - [~] 19.1 Create Dashboard API layer
    - Create src/api/dashboard.api.ts with fetchDashboard function
    - Use React Query for caching
    - _Requirements: 15.7_
  
  - [~] 19.2 Create Dashboard page
    - Create src/features/dashboard/Dashboard.tsx
    - Display health score with trend indicator
    - Display monthly spending with budget percentage
    - Display daily calories with target percentage
    - Display grocery cost breakdown chart
    - Display active alerts
    - Display top 5 expensive ingredients
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_
  
  - [~] 19.3 Create HealthScore component
    - Create src/components/HealthScore.tsx
    - Display score with color coding (green >80, yellow 60-80, red <60)
    - Show breakdown of components
    - _Requirements: 6.6_
  
  - [~] 19.4 Create charts with Recharts
    - Create CalorieTrend chart component
    - Create SpendingBreakdown chart component
    - Create MacroDistribution chart component
    - _Requirements: 15.4_


- [ ] 20. Frontend - Meals
  - [~] 20.1 Create Meals API layer
    - Create src/api/meals.api.ts with CRUD functions
    - Use React Query mutations for create/update/delete
    - _Requirements: 2.1_
  
  - [~] 20.2 Create Meals list page
    - Create src/features/meals/MealsList.tsx
    - Display meals with date filtering
    - Show meal_type, consumed_at, total_cost, total_calories
    - Add pagination
    - _Requirements: 2.1_
  
  - [~] 20.3 Create Add Meal form
    - Create src/features/meals/AddMeal.tsx
    - Select meal_type from dropdown
    - Add meal_items with ingredient search
    - Auto-calculate totals as items are added
    - Display nutrition breakdown
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [~] 20.4 Create Meal detail view
    - Create src/features/meals/MealDetail.tsx
    - Display all meal information
    - Show nutrition snapshot
    - Allow edit and delete
    - _Requirements: 2.5_


- [ ] 21. Frontend - Groceries
  - [~] 21.1 Create Groceries API layer
    - Create src/api/groceries.api.ts with CRUD functions
    - Use React Query mutations
    - _Requirements: 4.1_
  
  - [~] 21.2 Create Groceries list page
    - Create src/features/groceries/GroceriesList.tsx
    - Display purchases with date filtering
    - Show store_name, purchased_at, total_amount
    - Add pagination
    - _Requirements: 4.1_
  
  - [~] 21.3 Create Add Grocery form
    - Create src/features/groceries/AddGrocery.tsx
    - Input store_name and purchased_at
    - Add grocery_items with ingredient, quantity, price, expiry_date
    - Auto-calculate total_amount
    - Display health_grade and food_classification
    - _Requirements: 4.1, 4.4, 4.5_
  
  - [~] 21.4 Implement expiry tracking
    - Display items expiring soon with warning
    - Show waste alerts
    - _Requirements: 9.2_


- [ ] 22. Frontend - Recipes
  - [~] 22.1 Create Recipes API layer
    - Create src/api/recipes.api.ts with CRUD functions
    - Add convertToMeal function
    - _Requirements: 5.1_
  
  - [~] 22.2 Create Recipes list page
    - Create src/features/recipes/RecipesList.tsx
    - Filter by difficulty
    - Show AI-generated badge
    - _Requirements: 5.1_
  
  - [~] 22.3 Create Recipe detail view
    - Create src/features/recipes/RecipeDetail.tsx
    - Display instructions and ingredients
    - Show macro breakdown and estimated cost
    - Add "Convert to Meal" button
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [~] 22.4 Create Add Recipe form
    - Create src/features/recipes/AddRecipe.tsx
    - Input title, instructions, prep_time, difficulty
    - Add recipe_ingredients
    - _Requirements: 5.1_


- [ ] 23. Frontend - Health Analytics
  - [~] 23.1 Create Health API layer
    - Create src/api/health.api.ts for water logs and body metrics
    - _Requirements: 13.1, 14.1_
  
  - [~] 23.2 Create Hydration tracker
    - Create src/features/health/HydrationTracker.tsx
    - Log water intake
    - Display daily progress bar
    - Show hydration target
    - _Requirements: 13.1, 13.2, 13.5_
  
  - [~] 23.3 Create Body Metrics tracker
    - Create src/features/health/BodyMetrics.tsx
    - Log weight, body_fat_percentage
    - Display BMI calculation
    - Show 7-day, 30-day, 90-day trend charts
    - _Requirements: 14.1, 14.2, 14.5_
  
  - [~] 23.4 Create Health Analytics page
    - Create src/features/health/HealthAnalytics.tsx
    - Display macro trends
    - Display sodium/sugar alerts
    - Display budget vs nutrition graph
    - _Requirements: 10.6, 12.6_


- [ ] 24. Redis Caching Setup
  - [~] 24.1 Install and configure Redis
    - Install Redis on local machine or use Docker
    - Configure Laravel Redis connection in .env
    - Test connection with `php artisan tinker`
    - _Requirements: 19.3_
  
  - [~] 24.2 Implement caching for dashboard
    - Cache dashboard data with 15-minute TTL
    - Invalidate cache on data changes
    - _Requirements: 15.7, 19.4_
  
  - [~] 24.3 Implement caching for AI results
    - Cache health_score with 1-hour TTL
    - Cache budget forecast with 24-hour TTL
    - _Requirements: 6.7, 7.6, 19.3_


- [ ] 25. Queue System Setup
  - [~] 25.1 Configure Laravel Queue
    - Set QUEUE_CONNECTION=redis in .env
    - Install Laravel Horizon for queue monitoring
    - Configure queue workers
    - _Requirements: 7.5, 9.6_
  
  - [~] 25.2 Create queue jobs
    - Create BudgetForecastJob
    - Create WasteDetectionJob
    - Create NutritionAnalysisJob
    - Create MonthlyReportJob
    - _Requirements: 7.5, 9.6, 10.5, 16.6_
  
  - [~] 25.3 Schedule jobs
    - Configure Laravel scheduler for daily/nightly jobs
    - Test job execution
    - _Requirements: 9.6, 16.6_


- [ ] 26. Security Implementation
  - [~] 26.1 Implement input validation
    - Add validation rules to all form requests
    - Sanitize user input to prevent SQL injection
    - Sanitize output to prevent XSS
    - _Requirements: 20.5_
  
  - [~] 26.2 Configure CORS
    - Set allowed origins in config/cors.php
    - Restrict to authorized frontend domains
    - _Requirements: 20.7_
  
  - [~] 26.3 Implement audit logging
    - Create middleware to log all data access
    - Store in audit_logs table
    - Include user_id, action, resource, ip_address, user_agent
    - _Requirements: 20.4_
  
  - [~] 26.4 Configure HTTPS
    - Set up SSL certificate for production
    - Force HTTPS in production environment
    - Configure TLS 1.3
    - _Requirements: 20.6_


- [ ] 27. Testing
  - [~] 27.1 Write unit tests for services
    - Test HealthScoreService calculations
    - Test MealService calculations
    - Test GroceryService calculations
    - Test BudgetForecastService
    - Test WasteDetectionService
    - Test NutritionAnalysisService
    - _Requirements: All_
  
  - [~] 27.2 Write API integration tests
    - Test authentication endpoints
    - Test meal CRUD endpoints
    - Test grocery CRUD endpoints
    - Test recipe CRUD endpoints
    - Test dashboard endpoint
    - Test health endpoints
    - _Requirements: 18.1_
  
  - [~] 27.3 Write frontend component tests
    - Test Dashboard component
    - Test Meals components
    - Test Groceries components
    - Test Recipes components
    - Test Health components
    - _Requirements: 15.8_
  
  - [~] 27.4 Perform end-to-end testing
    - Test complete user flows (register, login, add meal, view dashboard)
    - Test AI features with sample data
    - Test caching behavior
    - Test queue job execution
    - _Requirements: All_


- [ ] 28. Deployment Preparation
  - [~] 28.1 Create production environment configuration
    - Set up production .env file
    - Configure production database credentials (not root)
    - Configure production Redis connection
    - Set APP_ENV=production and APP_DEBUG=false
    - _Requirements: 20.2_
  
  - [~] 28.2 Optimize Laravel for production
    - Run `php artisan config:cache`
    - Run `php artisan route:cache`
    - Run `php artisan view:cache`
    - Enable OPcache
    - _Requirements: 19.7_
  
  - [~] 28.3 Build React for production
    - Run `npm run build` to create optimized bundle
    - Configure web server to serve static files
    - Enable gzip compression
    - _Requirements: 22.4_
  
  - [~] 28.4 Set up monitoring and logging
    - Configure Laravel logging
    - Set up error tracking (e.g., Sentry)
    - Monitor queue jobs
    - Monitor Redis cache hit rates
    - _Requirements: 19.7_
