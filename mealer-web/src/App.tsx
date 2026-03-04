import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './features/dashboard/Dashboard';
import MealLogger from './features/meals/MealLogger';
import MealPlanner from './features/recipes/MealPlanner';
import GroceryList from './features/groceries/GroceryList';
import Analytics from './features/analytics/Analytics';
import Settings from './features/settings/Settings';
import Community from './features/community/Community';
import PantryInventory from './features/pantry/PantryInventory';
import Rewards from './features/gamification/Rewards';
import OnboardingWizard from './features/auth/OnboardingWizard';
import SimulationEngine from './features/recipes/SimulationEngine';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/meals/log" element={<MealLogger />} />
            <Route path="/planner" element={<MealPlanner />} />
            <Route path="/groceries" element={<GroceryList />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/community" element={<Community />} />
            <Route path="/pantry" element={<PantryInventory />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/simulations" element={<SimulationEngine />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/onboarding" element={<OnboardingWizard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
