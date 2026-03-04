# Requirements Document

## Introduction

Mealer is an AI-driven meal and grocery intelligence platform that combines meal consumption tracking, grocery expenditure analysis, recipe management, and AI-powered recommendations to provide actionable financial and health insights. The system transforms daily eating habits into data-driven intelligence for budget optimization and nutritional awareness.

## Glossary

- **Mealer_System**: The complete platform including backend API, database, frontend applications, and AI services
- **User**: An authenticated individual using the platform to track meals, groceries, and health metrics
- **Meal**: A recorded eating event with associated ingredients, cost, calories, and consumption timestamp
- **Meal_Item**: An individual ingredient within a meal with quantity, cost, and calorie data
- **Ingredient**: A cataloged food item with nutritional profile (calories, protein, carbs, fat, fiber, micronutrients)
- **Grocery_Purchase**: A recorded shopping transaction with store, date, total amount, and line items
- **Grocery_Item**: An individual product within a grocery purchase with quantity, price, and expiry date
- **Recipe**: A structured set of instructions and ingredients with preparation time and difficulty rating
- **AI_Engine**: The machine learning subsystem providing predictions, recommendations, and pattern detection
- **Health_Score**: A calculated daily index (0-100) based on nutrition balance, budget efficiency, diversity, and consistency
- **Budget_Target**: User-defined monthly spending limit for food and groceries
- **Calorie_Target**: User-defined daily caloric intake goal
- **Macro**: Macronutrient measurement (protein, carbohydrates, fat)
- **Micro**: Micronutrient measurement (iron, calcium, vitamin D, sodium, sugar, fiber)
- **Waste_Detection**: AI analysis identifying expired or unused groceries
- **Processed_Food**: Food items classified as processed, ultra-processed, or whole food based on ingredient analysis
- **Diversity_Index**: Metric measuring variety in vegetable consumption, protein sources, and whole food ratio
- **Dashboard**: Primary analytics interface displaying health score, spending trends, and alerts
- **API_Layer**: RESTful and GraphQL endpoints for client-server communication
- **Cache_Layer**: Redis-based storage for computed analytics and AI results
- **Job_Queue**: Asynchronous task processor for AI computations and batch analytics

## Requirements

### Requirement 1: User Authentication and Profile Management

**User Story:** As a user, I want to create and manage my profile with personalized health and budget targets, so that the system can provide tailored recommendations.

#### Acceptance Criteria

1. THE Mealer_System SHALL store User profiles with daily_calorie_target and monthly_budget_target
2. WHEN a User registers, THE Mealer_System SHALL create an authenticated account with JWT token
3. WHEN a User updates their calorie_target or budget_target, THE Mealer_System SHALL persist the changes within 500ms
4. THE Mealer_System SHALL enforce row-level data isolation ensuring Users access only their own data
5. THE Mealer_System SHALL implement API rate limiting of 100 requests per minute per User

### Requirement 2: Meal Consumption Tracking

**User Story:** As a user, I want to record meals with ingredients and automatically calculate nutritional and cost data, so that I can track my daily intake.

#### Acceptance Criteria

1. WHEN a User creates a Meal, THE Mealer_System SHALL record meal_type, consumed_at timestamp, total_cost, and total_calories
2. WHEN a User adds Meal_Items to a Meal, THE Mealer_System SHALL calculate total_cost as the sum of all Meal_Item costs
3. WHEN a User adds Meal_Items to a Meal, THE Mealer_System SHALL calculate total_calories as the sum of all Meal_Item calories
4. THE Mealer_System SHALL store Meal_Items with quantity, cost, and calories for each Ingredient
5. WHEN a Meal is saved, THE Mealer_System SHALL store a nutrition snapshot to avoid recalculation on future queries
6. THE Mealer_System SHALL support meal_type values of breakfast, lunch, dinner, and snack

### Requirement 3: Ingredient Catalog Management

**User Story:** As a user, I want access to a comprehensive ingredient database with nutritional information, so that I can accurately track my meals.

#### Acceptance Criteria

1. THE Mealer_System SHALL maintain an Ingredient catalog with calories, protein, carbs, fat, and fiber per 100g
2. THE Mealer_System SHALL store Micro data for Ingredients including iron, calcium, vitamin_d, sodium, and sugar
3. WHEN a User searches for an Ingredient, THE Mealer_System SHALL return matching results within 200ms
4. THE Mealer_System SHALL allow Users to create custom Ingredients with nutritional data
5. WHEN an Ingredient is referenced in a Meal_Item, THE Mealer_System SHALL retrieve nutritional data from the catalog

### Requirement 4: Grocery Purchase Tracking

**User Story:** As a user, I want to record grocery purchases with itemized details and expiry dates, so that I can analyze spending and reduce waste.

#### Acceptance Criteria

1. WHEN a User creates a Grocery_Purchase, THE Mealer_System SHALL record store_name, purchased_at timestamp, and total_amount
2. THE Mealer_System SHALL store Grocery_Items with quantity, price, and expiry_date for each purchase
3. WHEN a Grocery_Purchase is saved, THE Mealer_System SHALL calculate total_amount as the sum of all Grocery_Item prices
4. THE Mealer_System SHALL classify each Grocery_Item as processed, ultra_processed, or whole_food
5. THE Mealer_System SHALL assign a health_grade (A through F) to each Grocery_Item based on nutritional profile

### Requirement 5: Recipe Management System

**User Story:** As a user, I want to create, view, and use recipes with ingredient lists and instructions, so that I can plan meals efficiently.

#### Acceptance Criteria

1. THE Mealer_System SHALL store Recipes with instructions, prep_time, difficulty, and ai_generated flag
2. THE Mealer_System SHALL maintain Recipe_Ingredients linking Recipes to required Ingredients with quantities
3. WHEN a User views a Recipe, THE Mealer_System SHALL calculate total Macro breakdown from Recipe_Ingredients
4. WHEN a User views a Recipe, THE Mealer_System SHALL calculate estimated total_cost from current Ingredient prices
5. THE Mealer_System SHALL allow Users to convert a Recipe directly into a Meal with one action
6. THE Mealer_System SHALL support difficulty values of easy, medium, and hard

### Requirement 6: Health Score Calculation

**User Story:** As a user, I want a daily health score that reflects my nutrition, budget, diversity, and consistency, so that I can track overall wellness.

#### Acceptance Criteria

1. THE Mealer_System SHALL calculate Health_Score daily as a weighted sum: nutrition_balance (40%), budget_efficiency (20%), diversity_index (20%), consistency_score (20%)
2. THE Mealer_System SHALL compute nutrition_balance based on proximity to Calorie_Target and Macro targets
3. THE Mealer_System SHALL compute budget_efficiency based on spending relative to Budget_Target
4. THE Mealer_System SHALL compute diversity_index based on vegetable variety, protein source variety, and whole food ratio
5. THE Mealer_System SHALL compute consistency_score based on meal timing regularity and target adherence over 7 days
6. THE Mealer_System SHALL express Health_Score as an integer from 0 to 100
7. THE Mealer_System SHALL cache Health_Score calculations in the Cache_Layer for 1 hour

### Requirement 7: Budget Forecasting AI

**User Story:** As a user, I want AI predictions of my end-of-month spending with over-budget alerts, so that I can adjust my grocery habits proactively.

#### Acceptance Criteria

1. WHEN a User requests a budget forecast, THE AI_Engine SHALL predict end-of-month spending based on current spending patterns
2. WHEN predicted spending exceeds Budget_Target by 10%, THE AI_Engine SHALL generate an over-budget alert
3. THE AI_Engine SHALL calculate forecast confidence as a percentage based on historical data availability
4. THE AI_Engine SHALL store prediction results in ai_logs with context and prediction JSON
5. THE Mealer_System SHALL process budget forecast requests asynchronously via the Job_Queue
6. THE Mealer_System SHALL cache forecast results in the Cache_Layer for 24 hours

### Requirement 8: Smart Grocery List Generation

**User Story:** As a user, I want AI-generated grocery lists optimized for my meal plans, pantry inventory, and budget, so that I can shop efficiently.

#### Acceptance Criteria

1. WHEN a User requests a grocery list, THE AI_Engine SHALL generate a list based on planned Meals, existing Grocery_Items, and Budget_Target
2. THE AI_Engine SHALL exclude Ingredients already available in the User's pantry with sufficient quantity
3. THE AI_Engine SHALL prioritize Ingredients that maximize nutrition per dollar spent
4. THE AI_Engine SHALL group list items by store category for shopping convenience
5. THE AI_Engine SHALL calculate estimated total cost for the generated list
6. THE Mealer_System SHALL process grocery list generation asynchronously via the Job_Queue

### Requirement 9: Waste Detection Model

**User Story:** As a user, I want AI detection of expired groceries and unused ingredients, so that I can reduce food waste and save money.

#### Acceptance Criteria

1. THE AI_Engine SHALL scan Grocery_Items daily to identify items past their expiry_date
2. WHEN a Grocery_Item expires within 3 days, THE AI_Engine SHALL generate an expiry alert
3. THE AI_Engine SHALL identify Grocery_Items purchased more than 14 days ago with no corresponding Meal_Item usage
4. WHEN unused Grocery_Items are detected, THE AI_Engine SHALL suggest Recipes utilizing those Ingredients
5. THE AI_Engine SHALL calculate monthly waste_cost as the sum of expired and unused Grocery_Item prices
6. THE Mealer_System SHALL process waste detection asynchronously via the Job_Queue on a daily schedule

### Requirement 10: Calorie and Macro Intelligence

**User Story:** As a user, I want AI analysis of my calorie and macro trends with surplus, deficiency, and pattern detection, so that I can optimize my nutrition.

#### Acceptance Criteria

1. THE AI_Engine SHALL analyze daily calorie intake and detect surplus (>10% over target) or deficit (>10% under target) patterns
2. THE AI_Engine SHALL analyze Macro ratios and detect protein deficiency (<15% of calories), high carb (>60% of calories), or high fat (>40% of calories) patterns
3. WHEN a nutritional pattern persists for 7 consecutive days, THE AI_Engine SHALL generate a trend alert
4. THE AI_Engine SHALL identify meal timing patterns including late_night_eating (after 10 PM), skipped_breakfast, and fasting_intervals
5. THE AI_Engine SHALL store pattern detection results in ai_logs with context JSON
6. THE Mealer_System SHALL display trend alerts on the Dashboard within 1 hour of detection

### Requirement 11: Recipe Personalization AI

**User Story:** As a user, I want AI-suggested recipes based on my budget, macro targets, and available ingredients, so that I can discover meals that fit my goals.

#### Acceptance Criteria

1. WHEN a User requests recipe suggestions, THE AI_Engine SHALL recommend Recipes matching the User's Budget_Target and Calorie_Target within 20% tolerance
2. THE AI_Engine SHALL prioritize Recipes using Ingredients already in the User's pantry
3. THE AI_Engine SHALL filter Recipes to match User dietary preferences stored in the profile
4. THE AI_Engine SHALL rank Recipes by a composite score: budget_fit (30%), macro_fit (30%), ingredient_availability (25%), diversity_bonus (15%)
5. THE AI_Engine SHALL generate new Recipes when existing catalog matches are insufficient, setting ai_generated flag to true
6. THE Mealer_System SHALL process recipe suggestions asynchronously via the Job_Queue

### Requirement 12: Nutrition Risk Detection

**User Story:** As a user, I want automated alerts for nutritional risks like high sodium, excess sugar, or chronic calorie deficit, so that I can address health concerns early.

#### Acceptance Criteria

1. WHEN daily sodium intake exceeds 2300mg, THE AI_Engine SHALL generate a high_sodium alert
2. WHEN daily sugar intake exceeds 50g, THE AI_Engine SHALL generate an excess_sugar alert
3. WHEN daily protein intake falls below 0.8g per kg of body weight for 5 consecutive days, THE AI_Engine SHALL generate a low_protein alert
4. WHEN daily calorie intake falls below 1200 calories for 7 consecutive days, THE AI_Engine SHALL generate a chronic_deficit alert
5. WHEN daily calorie intake exceeds Calorie_Target by 500 calories for 7 consecutive days, THE AI_Engine SHALL generate a chronic_surplus alert
6. THE Mealer_System SHALL display risk alerts prominently on the Dashboard

### Requirement 13: Hydration Tracking

**User Story:** As a user, I want to log water intake and receive hydration reminders, so that I can maintain proper hydration levels.

#### Acceptance Criteria

1. THE Mealer_System SHALL store water_logs with amount_ml and logged_at timestamp
2. WHEN a User logs water intake, THE Mealer_System SHALL update daily hydration total within 200ms
3. THE Mealer_System SHALL calculate daily hydration target as 35ml per kg of body weight
4. WHEN daily hydration falls below 50% of target by 6 PM, THE AI_Engine SHALL generate a dehydration_risk alert
5. THE Mealer_System SHALL display hydration progress on the Dashboard as a percentage of daily target

### Requirement 14: Body Metrics Tracking

**User Story:** As a user, I want to record weight, BMI, and body fat measurements with trend analysis, so that I can monitor physical changes over time.

#### Acceptance Criteria

1. THE Mealer_System SHALL store body_metrics with weight, bmi, body_fat_percentage, and measured_at timestamp
2. WHEN a User logs body_metrics, THE Mealer_System SHALL calculate BMI as weight_kg divided by height_m squared
3. THE AI_Engine SHALL analyze body_metrics trends over 30-day periods and detect weight_gain (>2kg increase) or weight_loss (>2kg decrease) patterns
4. THE AI_Engine SHALL correlate body_metrics trends with calorie intake patterns and generate insights
5. THE Mealer_System SHALL display body_metrics trends on the Dashboard with 7-day, 30-day, and 90-day views

### Requirement 15: Dashboard Analytics Interface

**User Story:** As a user, I want a comprehensive dashboard showing health score, spending trends, calorie patterns, and alerts, so that I can monitor my progress at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display current Health_Score with trend indicator (up, down, stable)
2. THE Dashboard SHALL display monthly spending total with percentage of Budget_Target consumed
3. THE Dashboard SHALL display daily calorie intake with percentage of Calorie_Target consumed
4. THE Dashboard SHALL display grocery cost breakdown by category (produce, protein, dairy, grains, other)
5. THE Dashboard SHALL display active alerts including waste alerts, risk alerts, and budget alerts
6. THE Dashboard SHALL display top 5 most expensive Ingredients from the past 30 days
7. THE Mealer_System SHALL cache Dashboard queries in the Cache_Layer for 15 minutes
8. WHEN a User loads the Dashboard, THE Mealer_System SHALL render all components within 2 seconds

### Requirement 16: Monthly Analytics Reports

**User Story:** As a user, I want detailed monthly reports on food costs, nutrition trends, and eating patterns, so that I can review and improve my habits.

#### Acceptance Criteria

1. THE Mealer_System SHALL generate monthly reports including total_spending, average_daily_calories, macro_distribution, and meal_frequency
2. THE Mealer_System SHALL calculate cost_per_calorie and cost_per_100g_protein metrics in monthly reports
3. THE Mealer_System SHALL identify the top 10 most expensive Ingredients in monthly reports
4. THE Mealer_System SHALL analyze eating time patterns and cluster Meals by time_of_day in monthly reports
5. THE Mealer_System SHALL compute monthly Diversity_Index showing vegetable variety and protein source variety
6. THE Mealer_System SHALL precompute monthly reports via nightly batch jobs and store results in the Cache_Layer

### Requirement 17: Data Export Functionality

**User Story:** As a user, I want to export my meal, grocery, and health data in standard formats, so that I can use the data in other tools or share with professionals.

#### Acceptance Criteria

1. THE Mealer_System SHALL export User data in CSV format including Meals, Grocery_Purchases, and body_metrics
2. THE Mealer_System SHALL export User data in JSON format with complete relational structure
3. WHEN a User requests a data export, THE Mealer_System SHALL generate the export file within 30 seconds for datasets under 10,000 records
4. THE Mealer_System SHALL include a data dictionary in exports explaining all fields and units
5. THE Mealer_System SHALL process large exports (>10,000 records) asynchronously via the Job_Queue and notify Users when complete

### Requirement 18: API Layer Architecture

**User Story:** As a developer, I want a well-structured API with REST and GraphQL endpoints, so that I can build client applications efficiently.

#### Acceptance Criteria

1. THE API_Layer SHALL provide RESTful endpoints for all CRUD operations on Meals, Grocery_Purchases, Recipes, and User profiles
2. THE API_Layer SHALL provide GraphQL endpoints for complex queries requiring nested data relationships
3. THE API_Layer SHALL return responses in JSON format with consistent error structure
4. WHEN an API request fails validation, THE API_Layer SHALL return HTTP 400 with descriptive error messages
5. WHEN an API request fails authentication, THE API_Layer SHALL return HTTP 401 with token expiry information
6. THE API_Layer SHALL include API versioning in URL paths (e.g., /api/v1/meals)
7. THE API_Layer SHALL document all endpoints using OpenAPI 3.0 specification

### Requirement 19: Performance Optimization

**User Story:** As a user, I want fast response times and smooth interactions, so that the platform feels responsive and reliable.

#### Acceptance Criteria

1. THE Mealer_System SHALL use composite indexes on (user_id, consumed_at) for Meal queries
2. THE Mealer_System SHALL use composite indexes on (user_id, purchased_at) for Grocery_Purchase queries
3. THE Mealer_System SHALL store AI results in the Cache_Layer with TTL of 1 hour for frequently accessed predictions
4. THE Mealer_System SHALL store Dashboard data in the Cache_Layer with TTL of 15 minutes
5. WHEN the Grocery_Purchase table exceeds 1 million records, THE Mealer_System SHALL partition the table by year
6. THE Mealer_System SHALL process AI computations asynchronously via the Job_Queue to avoid blocking API requests
7. THE Mealer_System SHALL respond to 95% of API requests within 500ms under normal load (100 requests per second)

### Requirement 20: Security and Data Protection

**User Story:** As a user, I want my personal health and financial data protected with industry-standard security measures, so that my privacy is maintained.

#### Acceptance Criteria

1. THE Mealer_System SHALL enforce row-level security ensuring Users access only their own Meals, Grocery_Purchases, and Recipes
2. THE Mealer_System SHALL hash User passwords using bcrypt with cost factor of 12
3. THE Mealer_System SHALL issue JWT tokens with 24-hour expiry for authenticated sessions
4. THE Mealer_System SHALL log all data access operations in audit_logs with user_id, action, resource, and timestamp
5. THE Mealer_System SHALL validate and sanitize all User input to prevent SQL injection and XSS attacks
6. THE Mealer_System SHALL transmit all data over HTTPS with TLS 1.3 or higher
7. THE Mealer_System SHALL implement CORS policies restricting API access to authorized frontend domains

### Requirement 21: Recipe Parser and Pretty Printer

**User Story:** As a user, I want to import recipes from text format and export them in readable format, so that I can easily share and reuse recipes.

#### Acceptance Criteria

1. WHEN a User provides recipe text, THE Mealer_System SHALL parse it into structured Recipe and Recipe_Ingredients objects
2. WHEN recipe text is invalid or incomplete, THE Mealer_System SHALL return descriptive parsing errors
3. THE Mealer_System SHALL format Recipe objects into human-readable text with ingredients list and instructions
4. FOR ALL valid Recipe objects, parsing the pretty-printed output SHALL produce an equivalent Recipe object (round-trip property)
5. THE Mealer_System SHALL support common recipe formats including ingredient quantities in grams, cups, tablespoons, and teaspoons

### Requirement 22: Mobile Application Support

**User Story:** As a user, I want to access Mealer from my mobile device with a native app experience, so that I can track meals and groceries on the go.

#### Acceptance Criteria

1. THE Mealer_System SHALL provide API endpoints optimized for mobile bandwidth with pagination support
2. THE Mealer_System SHALL support offline data entry with synchronization when connectivity is restored
3. WHEN a mobile client syncs offline data, THE Mealer_System SHALL resolve conflicts using last-write-wins strategy
4. THE Mealer_System SHALL compress API responses using gzip when requested by mobile clients
5. THE Mealer_System SHALL support push notifications for alerts and reminders to mobile devices

### Requirement 23: Food Diversity Analysis

**User Story:** As a user, I want analysis of my food diversity including vegetable variety and protein sources, so that I can ensure a balanced diet.

#### Acceptance Criteria

1. THE AI_Engine SHALL calculate weekly vegetable_variety as the count of unique vegetable Ingredients consumed
2. THE AI_Engine SHALL calculate weekly protein_source_variety as the count of unique protein Ingredients consumed
3. THE AI_Engine SHALL calculate weekly whole_food_ratio as the percentage of Meals using whole_food Ingredients versus Processed_Food
4. WHEN vegetable_variety falls below 5 unique items per week, THE AI_Engine SHALL generate a low_diversity alert
5. WHEN whole_food_ratio falls below 60%, THE AI_Engine SHALL generate a processed_food_warning alert
6. THE Mealer_System SHALL display diversity metrics on the Dashboard with weekly and monthly trends

### Requirement 24: Meal Timing Pattern Analysis

**User Story:** As a user, I want analysis of my meal timing patterns including late-night eating and fasting intervals, so that I can optimize my eating schedule.

#### Acceptance Criteria

1. THE AI_Engine SHALL detect late_night_eating when Meals are consumed after 10 PM on 3 or more days per week
2. THE AI_Engine SHALL detect skipped_breakfast when no Meal with meal_type breakfast is logged before 11 AM on 3 or more days per week
3. THE AI_Engine SHALL calculate fasting_intervals as the time between the last Meal of one day and the first Meal of the next day
4. WHEN fasting_intervals exceed 16 hours on 3 or more days per week, THE AI_Engine SHALL detect an intermittent_fasting pattern
5. THE AI_Engine SHALL correlate meal timing patterns with Health_Score and generate insights
6. THE Mealer_System SHALL display meal timing analysis on the Dashboard with pattern visualizations

### Requirement 25: Cost-Per-Nutrition Analysis

**User Story:** As a user, I want to see cost efficiency metrics like cost per 100g protein and cost per 1000 calories, so that I can optimize my grocery spending.

#### Acceptance Criteria

1. THE Mealer_System SHALL calculate cost_per_100g_protein for each Ingredient as (price / protein_grams) * 100
2. THE Mealer_System SHALL calculate cost_per_1000_calories for each Ingredient as (price / calories) * 1000
3. THE Mealer_System SHALL rank Ingredients by cost_per_100g_protein and display the top 10 most efficient protein sources
4. THE Mealer_System SHALL rank Ingredients by cost_per_1000_calories and display the top 10 most efficient calorie sources
5. THE Mealer_System SHALL include cost-per-nutrition metrics in monthly reports
6. THE Dashboard SHALL display cost-per-nutrition trends over 30-day periods

## Notes

This requirements document defines the core functionality for the Mealer platform MVP (Phase 1 and Phase 2). Advanced features such as chronic condition modes, family accounts, and nutritionist dashboards are deferred to future phases and will require separate requirements documentation.

All AI-powered features (Requirements 7-12, 14, 23-24) depend on sufficient historical data. The system should gracefully handle cold-start scenarios where Users have limited data by providing informational messages rather than predictions.

Database performance requirements (Requirement 19) assume MySQL 8+ with InnoDB engine and appropriate hardware resources. Production deployment requires dedicated database user credentials, not root access.

Security requirements (Requirement 20) establish baseline protections. Production deployment requires additional measures including regular security audits, penetration testing, and compliance with data protection regulations (GDPR, CCPA) based on deployment region.
