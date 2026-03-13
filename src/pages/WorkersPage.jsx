import React from "react";
import { useEffect, useState } from "react";
import workerService from "../services/workerService";
import departmentService from "../services/departmentService";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Table from "../components/common/Table";
import WorkerForm from "../components/forms/WorkerForm";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [workersData, departmentsData] = await Promise.all([
        workerService.getAll(),
        departmentService.getAll()
      ]);

      setWorkers(Array.isArray(workersData) ? workersData : []);
      setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch workers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getDepartment = (worker) => {
    if (worker.department) {
      return worker.department;
    }

    return departments.find((department) => String(department.id) === String(worker.department_id));
  };

  const handleCreateClick = () => {
    setEditingWorker(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (worker) => {
    setEditingWorker({
      ...worker,
      department_id: worker.department_id || worker.department?.id || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (worker) => {
    const confirmed = window.confirm(`Delete worker \"${worker.name}\"?`);

    if (!confirmed) {
      return;
    }

    try {
      await workerService.remove(worker.id);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete worker.");
    }
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (editingWorker) {
        await workerService.update(editingWorker.id, payload);
      } else {
        await workerService.create(payload);
      }

      setIsModalOpen(false);
      setEditingWorker(null);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save worker.");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "department",
      header: "Department",
      render: (row) => getDepartment(row)?.name || "-"
    },
    {
      key: "payment_type",
      header: "Payment Type",
      render: (row) => getDepartment(row)?.payment_type || row.payment_type || "-"
    },
    {
      key: "rate",
      header: "Rate",
      render: (row) => getDepartment(row)?.rate || row.rate || "-"
    },
    {
      key: "created_at",
      header: "Created At",
      render: (row) => formatDate(row.created_at || row.createdAt)
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" className="px-3 py-1" onClick={() => handleEditClick(row)}>
            Edit
          </Button>
          <Button variant="danger" className="px-3 py-1" onClick={() => handleDelete(row)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-800">Workers</h3>
        <Button onClick={handleCreateClick}>Add Worker</Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Table columns={columns} data={workers} loading={loading} emptyMessage="No workers found." />

      <Modal
        isOpen={isModalOpen}
        title={editingWorker ? "Edit Worker" : "Add Worker"}
        onClose={() => setIsModalOpen(false)}
      >
        <WorkerForm
          initialValues={editingWorker}
          departments={departments}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </div>
  );
}

export default WorkersPage;


