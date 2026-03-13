import React from "react";
import { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

function WorkerForm({ initialValues, departments = [], onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    department_id: initialValues?.department_id || ""
  });
  const [errors, setErrors] = useState({});

  const departmentOptions = [
    { value: "", label: "Select department" },
    ...departments.map((department) => ({
      value: String(department.id),
      label: department.name
    }))
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.department_id) {
      nextErrors.department_id = "Department is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: form.name.trim(),
      department_id: form.department_id
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        id="worker-name"
        name="name"
        label="Name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Select
        id="worker-department"
        name="department_id"
        label="Department"
        value={form.department_id}
        onChange={handleChange}
        options={departmentOptions}
        error={errors.department_id}
      />

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} type="button" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

export default WorkerForm;


