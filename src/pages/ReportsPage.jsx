import React from "react";
import { useEffect, useMemo, useState } from "react";
import reportService from "../services/reportService";
import payoutService from "../services/payoutService";
import workerService from "../services/workerService";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import Table from "../components/common/Table";
import GeneratePayoutForm from "../components/forms/GeneratePayoutForm";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

function toLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentWeekRange() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(today);
  start.setDate(today.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    startDate: toLocalDateInputValue(start),
    endDate: toLocalDateInputValue(end)
  };
}

function getMonthRange(month) {
  const [year, monthNumber] = month.split("-").map(Number);

  if (!year || !monthNumber) {
    return { start: "", end: "" };
  }

  const start = toLocalDateInputValue(new Date(year, monthNumber - 1, 1));
  const end = toLocalDateInputValue(new Date(year, monthNumber, 0));

  return { start, end };
}

function normalizeReport(payload) {
  const rowsRaw = payload?.per_worker || [];

  const rows = (Array.isArray(rowsRaw) ? rowsRaw : []).map((row, index) => ({
    id: row.worker_id || `row-${index}`,
    worker_id: row.worker_id || "",
    worker_name: row.worker_name || "-",
    department_name: row.department_name || "-",
    total_quantity: Number(row.total_quantity ?? 0) || 0,
    total_amount: Number(row.total_amount ?? 0) || 0,
    payout_id_for_range: row.payout_id_for_range || null,
    payout_status_for_range: row.payout_status_for_range || null
  }));

  const quantityFromRows = rows.reduce((sum, row) => sum + row.total_quantity, 0);
  const amountFromRows = rows.reduce((sum, row) => sum + row.total_amount, 0);

  const totalQuantity = Number(payload?.total_quantity ?? quantityFromRows) || 0;
  const totalAmount = Number(payload?.total_amount ?? amountFromRows) || 0;

  return {
    rows,
    summary: {
      totalQuantity,
      totalAmount
    }
  };
}

function ReportsPage() {
  const today = toLocalDateInputValue(new Date());
  const currentWeek = getCurrentWeekRange();

  const [activeTab, setActiveTab] = useState("daily");
  const [dailyDate, setDailyDate] = useState(today);
  const [weeklyStartDate, setWeeklyStartDate] = useState(currentWeek.startDate);
  const [weeklyEndDate, setWeeklyEndDate] = useState(currentWeek.endDate);
  const [monthlyMonth, setMonthlyMonth] = useState(today.slice(0, 7));
  const [reportRows, setReportRows] = useState([]);
  const [summary, setSummary] = useState({ totalQuantity: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [workers, setWorkers] = useState([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateInitialValues, setGenerateInitialValues] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadWorkers = async () => {
    try {
      const data = await workerService.getAll();
      setWorkers(Array.isArray(data) ? data : []);
    } catch {
      setWorkers([]);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      let data;

      if (activeTab === "daily") {
        data = await reportService.getDaily(dailyDate);
      } else if (activeTab === "weekly") {
        data = await reportService.getWeekly(weeklyStartDate, weeklyEndDate);
      } else {
        data = await reportService.getMonthly(monthlyMonth);
      }

      const normalized = normalizeReport(data);
      setReportRows(normalized.rows);
      setSummary(normalized.summary);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch report.");
      setReportRows([]);
      setSummary({ totalQuantity: 0, totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [activeTab, dailyDate, weeklyStartDate, weeklyEndDate, monthlyMonth]);

  const periodRange = useMemo(() => {
    if (activeTab === "weekly") {
      return { start: weeklyStartDate, end: weeklyEndDate };
    }

    if (activeTab === "monthly") {
      return getMonthRange(monthlyMonth);
    }

    return { start: "", end: "" };
  }, [activeTab, weeklyStartDate, weeklyEndDate, monthlyMonth]);

  const handleMarkPaid = async (payoutId) => {
    try {
      setActionLoadingId(String(payoutId));
      await payoutService.markAsPaid(payoutId);
      await loadReport();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to mark payout as paid.");
    } finally {
      setActionLoadingId("");
    }
  };

  const openGenerateModal = (row) => {
    setGenerateInitialValues({
      worker_id: row.worker_id,
      period_type: activeTab,
      period_start: periodRange.start,
      period_end: periodRange.end
    });
    setIsGenerateModalOpen(true);
  };

  const handleGeneratePayout = async (payload) => {
    try {
      setActionLoadingId(`generate-${payload.worker_id}`);
      await payoutService.generate(payload);
      setIsGenerateModalOpen(false);
      await loadReport();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate payout.");
    } finally {
      setActionLoadingId("");
    }
  };

  const columns = [
    { key: "worker_name", header: "Worker" },
    { key: "department_name", header: "Department" },
    { key: "total_quantity", header: "Total Quantity" },
    { key: "total_amount", header: "Total Salary" }
  ];

  if (activeTab === "weekly" || activeTab === "monthly") {
    columns.push({
      key: "payout_status_for_range",
      header: "Payout Status",
      render: (row) => row.payout_status_for_range || "not_generated"
    });

    columns.push({
      key: "payout_action",
      header: "Payout Action",
      render: (row) => {
        const status = row.payout_status_for_range;
        const payoutId = row.payout_id_for_range;

        if (payoutId && status === "paid") {
          return (
            <Button variant="success" className="px-3 py-1" disabled>
              Paid
            </Button>
          );
        }

        if (payoutId && status === "pending") {
          return (
            <Button
              variant="primary"
              className="px-3 py-1"
              disabled={actionLoadingId === String(payoutId)}
              onClick={() => handleMarkPaid(payoutId)}
            >
              {actionLoadingId === String(payoutId) ? "Processing..." : "Mark as Paid"}
            </Button>
          );
        }

        return (
          <Button
            variant="secondary"
            className="px-3 py-1"
            disabled={!row.worker_id || !periodRange.start || !periodRange.end}
            onClick={() => openGenerateModal(row)}
          >
            Generate Payout
          </Button>
        );
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <Button variant={activeTab === "daily" ? "primary" : "secondary"} onClick={() => setActiveTab("daily")}>
            Daily
          </Button>
          <Button
            variant={activeTab === "weekly" ? "primary" : "secondary"}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={activeTab === "monthly" ? "primary" : "secondary"}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {activeTab === "daily" ? (
            <Input
              id="daily-date"
              type="date"
              label="Date"
              value={dailyDate}
              onChange={(event) => setDailyDate(event.target.value)}
            />
          ) : null}

          {activeTab === "weekly" ? (
            <>
              <Input
                id="weekly-start"
                type="date"
                label="Start Date"
                value={weeklyStartDate}
                onChange={(event) => setWeeklyStartDate(event.target.value)}
              />
              <Input
                id="weekly-end"
                type="date"
                label="End Date"
                value={weeklyEndDate}
                onChange={(event) => setWeeklyEndDate(event.target.value)}
              />
            </>
          ) : null}

          {activeTab === "monthly" ? (
            <Input
              id="monthly-month"
              type="month"
              label="Month"
              value={monthlyMonth}
              onChange={(event) => setMonthlyMonth(event.target.value)}
            />
          ) : null}

          <div className="flex items-end">
            <Button onClick={loadReport} disabled={loading}>
              {loading ? "Loading..." : "Load Report"}
            </Button>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total Quantity</p>
          <p className="mt-1 text-xl font-semibold text-slate-800">{summary.totalQuantity}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total Salary</p>
          <p className="mt-1 text-xl font-semibold text-slate-800">{summary.totalAmount}</p>
        </div>
      </div>

      <Table columns={columns} data={reportRows} loading={loading} emptyMessage="No report records found." />

      <Modal
        isOpen={isGenerateModalOpen}
        title="Generate Payout"
        onClose={() => setIsGenerateModalOpen(false)}
      >
        <GeneratePayoutForm
          initialValues={generateInitialValues}
          workers={workers}
          periodType={activeTab}
          loading={Boolean(actionLoadingId && actionLoadingId.startsWith("generate-"))}
          onCancel={() => setIsGenerateModalOpen(false)}
          onSubmit={handleGeneratePayout}
        />
      </Modal>

      {activeTab === "weekly" || activeTab === "monthly" ? (
        <p className="text-xs text-slate-500">
          Selected range: {formatDate(periodRange.start)} to {formatDate(periodRange.end)}
        </p>
      ) : null}
    </div>
  );
}

export default ReportsPage;


