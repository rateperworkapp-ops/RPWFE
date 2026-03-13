import React from "react";
import { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

function GeneratePayoutForm({
  initialValues,
  workers = [],
  periodType,
  onSubmit,
  onCancel,
  loading = false
}) {
  const [form, setForm] = useState({
    worker_id: String(initialValues?.worker_id || ""),
    period_type: initialValues?.period_type || periodType,
    period_start: initialValues?.period_start || "",
    period_end: initialValues?.period_end || ""
  });
  const [errors, setErrors] = useState({});

  const workerOptions = workers.map((worker) => ({
    value: String(worker.id),
    label: worker.name
  }));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.worker_id) {
      nextErrors.worker_id = "Worker is required.";
    }

    if (!form.period_type) {
      nextErrors.period_type = "Period type is required.";
    }

    if (!form.period_start) {
      nextErrors.period_start = "Period start is required.";
    }

    if (!form.period_end) {
      nextErrors.period_end = "Period end is required.";
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
      worker_id: form.worker_id,
      period_type: form.period_type,
      period_start: form.period_start,
      period_end: form.period_end
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Select
        id="payout-worker"
        name="worker_id"
        label="Worker"
        value={form.worker_id}
        onChange={handleChange}
        options={workerOptions}
        error={errors.worker_id}
        disabled
      />

      <Select
        id="payout-period-type"
        name="period_type"
        label="Period Type"
        value={form.period_type}
        onChange={handleChange}
        options={[
          { value: "weekly", label: "weekly" },
          { value: "monthly", label: "monthly" }
        ]}
        error={errors.period_type}
        disabled
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="payout-period-start"
          name="period_start"
          type="date"
          label="Period Start"
          value={form.period_start}
          onChange={handleChange}
          error={errors.period_start}
        />

        <Input
          id="payout-period-end"
          name="period_end"
          type="date"
          label="Period End"
          value={form.period_end}
          onChange={handleChange}
          error={errors.period_end}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Payout"}
        </Button>
      </div>
    </form>
  );
}

export default GeneratePayoutForm;


