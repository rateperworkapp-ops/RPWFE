import React from "react";
import { useMemo, useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

function getWorkerRate(worker) {
  if (worker?.department?.rate != null) {
    return Number(worker.department.rate);
  }

  if (worker?.rate != null) {
    return Number(worker.rate);
  }

  return 0;
}

function WorkEntryForm({ workers = [], onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState({
    worker_id: "",
    work_date: "",
    quantity: ""
  });
  const [errors, setErrors] = useState({});

  const workerOptions = useMemo(
    () => [
      { value: "", label: "Select worker" },
      ...workers.map((worker) => ({ value: String(worker.id), label: worker.name }))
    ],
    [workers]
  );

  const selectedWorker = workers.find((worker) => String(worker.id) === form.worker_id);
  const rate = getWorkerRate(selectedWorker);
  const previewAmount = rate * (Number(form.quantity) || 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.worker_id) {
      nextErrors.worker_id = "Worker is required.";
    }

    if (!form.work_date) {
      nextErrors.work_date = "Work date is required.";
    }

    const quantityValue = Number(form.quantity);
    if (form.quantity === "" || Number.isNaN(quantityValue) || quantityValue < 0) {
      nextErrors.quantity = "Quantity must be 0 or greater.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setForm({ worker_id: "", work_date: "", quantity: "" });
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      worker_id: form.worker_id,
      work_date: form.work_date,
      quantity: Number(form.quantity)
    });

    resetForm();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-3">
        <Select
          id="work-entry-worker"
          name="worker_id"
          label="Worker"
          value={form.worker_id}
          onChange={handleChange}
          options={workerOptions}
          error={errors.worker_id}
        />

        <Input
          id="work-entry-date"
          name="work_date"
          type="date"
          label="Work Date"
          value={form.work_date}
          onChange={handleChange}
          error={errors.work_date}
        />

        <Input
          id="work-entry-quantity"
          name="quantity"
          type="number"
          label="Quantity"
          min="0"
          step="0.01"
          value={form.quantity}
          onChange={handleChange}
          error={errors.quantity}
        />
      </div>

      {selectedWorker && form.quantity ? (
        <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
          Preview: {Number(form.quantity)} x {rate.toFixed(2)} = {previewAmount.toFixed(2)}
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} type="button" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Work Entry"}
        </Button>
      </div>
    </form>
  );
}

export default WorkEntryForm;
