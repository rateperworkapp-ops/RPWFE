import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const titles = {
  "/": "Dashboard",
  "/departments": "Departments",
  "/workers": "Workers",
  "/work-entries": "Work Entries",
  "/reports": "Reports",
  "/payouts": "Payouts"
};

function Header({ onMenuClick }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md border border-slate-300 px-2 py-1 text-lg text-slate-700 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
        <h2 className="text-lg font-semibold text-slate-800 md:text-xl">{titles[location.pathname] || "Page"}</h2>
      </div>
      <Button variant="secondary" onClick={logout} className="hidden md:inline-flex">
        Logout
      </Button>
    </header>
  );
}

export default Header;


