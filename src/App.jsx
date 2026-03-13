import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import WorkersPage from "./pages/WorkersPage";
import WorkEntriesPage from "./pages/WorkEntriesPage";
import ReportsPage from "./pages/ReportsPage";
import PayoutsPage from "./pages/PayoutsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/work-entries" element={<WorkEntriesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/payouts" element={<PayoutsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
