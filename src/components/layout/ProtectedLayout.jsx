import React from "react";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <div className="hidden md:block md:min-h-screen md:w-64">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative h-full w-72 max-w-[85%] shadow-xl">
            <div className="flex items-center justify-end bg-slate-900 px-3 py-2">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md px-2 py-1 text-lg text-slate-100"
                aria-label="Close menu"
              >
                x
              </button>
            </div>
            <Sidebar
              onNavigate={() => setIsMobileMenuOpen(false)}
              onLogout={logout}
              showLogout
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProtectedLayout;


