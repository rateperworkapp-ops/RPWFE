import React from "react";
import { useEffect, useMemo, useState } from "react";
import payoutService from "../services/payoutService";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import Table from "../components/common/Table";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

function normalizePayouts(data) {
  const list = Array.isArray(data) ? data : [];

  return list.map((item, index) => ({
    id: item.id || `payout-${index}`,
    worker_name: item.worker?.name || item.worker_name || "-",
    department_name: item.department?.name || item.department_name || item.worker?.department?.name || "-",
    period_type: item.period_type || "-",
    period_start: item.period_start || "-",
    period_end: item.period_end || "-",
    total_quantity: item.total_quantity ?? item.quantity ?? 0,
    total_amount: item.total_amount ?? item.total_salary ?? 0,
    status: item.status || "pending",
    paid_at: item.paid_at || item.paidAt || "",
    created_at: item.created_at || item.createdAt || ""
  }));
}

function PayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadPayouts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await payoutService.getAll();
      setPayouts(normalizePayouts(data));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch payouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  const filteredPayouts = useMemo(() => {
    return payouts.filter((payout) => {
      const periodMatch = periodFilter === "all" || payout.period_type === periodFilter;
      const statusMatch = statusFilter === "all" || payout.status === statusFilter;
      return periodMatch && statusMatch;
    });
  }, [payouts, periodFilter, statusFilter]);

  const handleMarkPaid = async (payoutId) => {
    try {
      setActionLoadingId(String(payoutId));
      await payoutService.markAsPaid(payoutId);
      await loadPayouts();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to mark payout as paid.");
    } finally {
      setActionLoadingId("");
    }
  };

  const columns = [
    { key: "worker_name", header: "Worker" },
    { key: "department_name", header: "Department" },
    { key: "period_type", header: "Period Type" },
    { key: "period_start", header: "Period Start", render: (row) => formatDate(row.period_start) },
    { key: "period_end", header: "Period End", render: (row) => formatDate(row.period_end) },
    { key: "total_quantity", header: "Total Quantity" },
    { key: "total_amount", header: "Total Amount" },
    { key: "status", header: "Status" },
    { key: "paid_at", header: "Paid At", render: (row) => formatDate(row.paid_at) },
    { key: "created_at", header: "Created At", render: (row) => formatDate(row.created_at) },
    {
      key: "actions",
      header: "Actions",
      render: (row) => {
        if (row.status === "paid") {
          return (
            <Button variant="success" className="px-3 py-1" disabled>
              Paid
            </Button>
          );
        }

        return (
          <Button
            variant="primary"
            className="px-3 py-1"
            onClick={() => handleMarkPaid(row.id)}
            disabled={actionLoadingId === String(row.id)}
          >
            {actionLoadingId === String(row.id) ? "Processing..." : "Mark as Paid"}
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            id="period-type-filter"
            label="Period Type"
            value={periodFilter}
            onChange={(event) => setPeriodFilter(event.target.value)}
            options={[
              { value: "all", label: "all" },
              { value: "weekly", label: "weekly" },
              { value: "monthly", label: "monthly" }
            ]}
          />

          <Select
            id="status-filter"
            label="Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[
              { value: "all", label: "all" },
              { value: "pending", label: "pending" },
              { value: "paid", label: "paid" }
            ]}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Table columns={columns} data={filteredPayouts} loading={loading} emptyMessage="No payouts found." />
    </div>
  );
}

export default PayoutsPage;


