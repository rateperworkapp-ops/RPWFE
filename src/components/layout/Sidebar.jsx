import React from "react";
import { NavLink } from "react-router-dom";
import Button from "../common/Button";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Departments", path: "/departments" },
  { label: "Workers", path: "/workers" },
  { label: "Work Entries", path: "/work-entries" },
  { label: "Reports", path: "/reports" },
  { label: "Payouts", path: "/payouts" }
];

function Sidebar({ onNavigate, onLogout, showLogout = false }) {
  return (
    <aside className="flex h-full w-full flex-col bg-slate-900 text-slate-100">
      <div className="border-b border-slate-800 px-4 py-4">
        <h1 className="text-lg font-semibold">Factory Manager</h1>
        <p className="text-xs text-slate-400">Productivity Dashboard</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm transition ${
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {showLogout ? (
        <div className="border-t border-slate-800 p-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              if (onNavigate) {
                onNavigate();
              }
              if (onLogout) {
                onLogout();
              }
            }}
          >
            Logout
          </Button>
        </div>
      ) : null}
    </aside>
  );
}

export default Sidebar;


