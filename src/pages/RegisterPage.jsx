import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { getApiErrorMessage, mapValidationErrors } from "../utils/authFormErrors";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setApiError("");
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    setErrors({});

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        email: form.email.trim(),
        password: form.password
      });

      navigate("/login", {
        replace: true,
        state: {
          message: response?.message || "Registration successful. Please log in."
        }
      });
    } catch (error) {
      const validationErrors = mapValidationErrors(error?.response?.data?.errors);

      if (Object.keys(validationErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...validationErrors }));
      }

      setApiError(
        error?.response?.status === 409
          ? getApiErrorMessage(error, "This email is already registered.")
          : getApiErrorMessage(error, "Registration failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Register Manager</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a manager account, then log in to access the dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="register-email"
            name="email"
            type="text"
            label="Email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            id="register-password"
            name="password"
            type="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Go to login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
