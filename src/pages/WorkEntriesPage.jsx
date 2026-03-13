import React from "react";
import { useEffect, useState } from "react";
import workerService from "../services/workerService";
import workEntryService from "../services/workEntryService";
import WorkEntryForm from "../components/forms/WorkEntryForm";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Table from "../components/common/Table";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

function WorkEntriesPage() {
  const [workers, setWorkers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [workersData, entriesData] = await Promise.all([
        workerService.getAll(),
        workEntryService.getAll()
      ]);

      setWorkers(Array.isArray(workersData) ? workersData : []);
      setEntries(Array.isArray(entriesData) ? entriesData : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch work entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClick = () => {
    setError("");
    setIsModalOpen(true);
  };

  const getWorker = (entry) => {
    if (entry.worker) {
      return entry.worker;
    }

    return workers.find((worker) => String(worker.id) === String(entry.worker_id));
  };

  const getDepartment = (entry) => {
    const worker = getWorker(entry);

    if (entry.department) {
      return entry.department;
    }

    return worker?.department || null;
  };

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      await workEntryService.create(payload);
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create work entry.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "worker",
      header: "Worker",
      render: (row) => getWorker(row)?.name || row.worker_name || "-"
    },
    {
      key: "department",
      header: "Department",
      render: (row) => getDepartment(row)?.name || row.department_name || "-"
    },
    {
      key: "work_date",
      header: "Date",
      render: (row) => formatDate(row.work_date || row.date)
    },
    { key: "quantity", header: "Quantity" },
    {
      key: "rate",
      header: "Rate",
      render: (row) => row.rate || getDepartment(row)?.rate || "-"
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => row.amount || row.total_amount || "-"
    },
    {
      key: "created_at",
      header: "Created At",
      render: (row) => formatDate(row.created_at || row.createdAt)
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-800">Work Entries</h3>
        <Button onClick={handleCreateClick}>Add Work Entry</Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Table columns={columns} data={entries} loading={loading} emptyMessage="No work entries found." />

      <Modal
        isOpen={isModalOpen}
        title="Add Work Entry"
        onClose={() => setIsModalOpen(false)}
      >
        <WorkEntryForm
          workers={workers}
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </div>
  );
}

export default WorkEntriesPage;
