import React from "react";
import { useEffect, useState } from "react";
import departmentService from "../services/departmentService";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Table from "../components/common/Table";
import DepartmentForm from "../components/forms/DepartmentForm";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreateClick = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (department) => {
    const confirmed = window.confirm(`Delete department \"${department.name}\"?`);

    if (!confirmed) {
      return;
    }

    try {
      await departmentService.remove(department.id);
      await loadDepartments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete department.");
    }
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (editingDepartment) {
        await departmentService.update(editingDepartment.id, payload);
      } else {
        await departmentService.create(payload);
      }

      setIsModalOpen(false);
      setEditingDepartment(null);
      await loadDepartments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save department.");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "payment_type", header: "Payment Type" },
    { key: "rate", header: "Rate" },
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
        <h3 className="text-lg font-semibold text-slate-800">Departments</h3>
        <Button onClick={handleCreateClick}>Add Department</Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Table columns={columns} data={departments} loading={loading} emptyMessage="No departments found." />

      <Modal
        isOpen={isModalOpen}
        title={editingDepartment ? "Edit Department" : "Add Department"}
        onClose={() => setIsModalOpen(false)}
      >
        <DepartmentForm
          initialValues={editingDepartment}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </div>
  );
}

export default DepartmentsPage;


