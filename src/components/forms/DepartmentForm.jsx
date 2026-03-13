import React from "react";
import { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const paymentTypeOptions = [
  { value: "", label: "Select payment type" },
  { value: "kg", label: "kg" },
  { value: "piece", label: "piece" }
];

function DepartmentForm({ initialValues, onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    payment_type: initialValues?.payment_type || "",
    rate: initialValues?.rate ?? ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.payment_type) {
      nextErrors.payment_type = "Payment type is required.";
    }

    const rateValue = Number(form.rate);
    if (form.rate === "" || Number.isNaN(rateValue) || rateValue < 0) {
      nextErrors.rate = "Rate must be 0 or greater.";
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
      payment_type: form.payment_type,
      rate: Number(form.rate)
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        id="department-name"
        name="name"
        label="Name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Select
        id="department-payment-type"
        name="payment_type"
        label="Payment Type"
        value={form.payment_type}
        onChange={handleChange}
        options={paymentTypeOptions}
        error={errors.payment_type}
      />

      <Input
        id="department-rate"
        name="rate"
        type="number"
        label="Rate"
        value={form.rate}
        onChange={handleChange}
        min="0"
        step="0.01"
        error={errors.rate}
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

export default DepartmentForm;


