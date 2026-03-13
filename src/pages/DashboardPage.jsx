import React from "react";
import { useEffect, useState } from "react";
import workerService from "../services/workerService";
import departmentService from "../services/departmentService";
import reportService from "../services/reportService";
import Loader from "../components/common/Loader";

function toLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDailyReport(payload) {
  return {
    totalQuantity: Number(payload?.total_quantity ?? 0) || 0,
    totalSalary: Number(payload?.total_amount ?? 0) || 0
  };
}

function DashboardPage() {
  const [stats, setStats] = useState({
    totalProductionToday: 0,
    totalSalaryToday: 0,
    totalWorkers: 0,
    totalDepartments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const today = toLocalDateInputValue(new Date());
        const [workersData, departmentsData, dailyReport] = await Promise.all([
          workerService.getAll(),
          departmentService.getAll(),
          reportService.getDaily(today)
        ]);

        const daily = normalizeDailyReport(dailyReport);

        setStats({
          totalProductionToday: daily.totalQuantity,
          totalSalaryToday: daily.totalSalary,
          totalWorkers: Array.isArray(workersData) ? workersData.length : 0,
          totalDepartments: Array.isArray(departmentsData) ? departmentsData.length : 0
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    { label: "Total Production Today", value: stats.totalProductionToday },
    { label: "Total Salary Today", value: stats.totalSalaryToday },
    { label: "Total Workers", value: stats.totalWorkers },
    { label: "Total Departments", value: stats.totalDepartments }
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;


