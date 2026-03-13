import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { getApiErrorMessage, mapValidationErrors } from "../utils/authFormErrors";

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState(() => location.state?.message || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.message) {
      return;
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setApiError("");
    setNotice("");
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
      await login({ email: form.email.trim(), password: form.password });
      navigate("/", { replace: true });
    } catch (error) {
      const validationErrors = mapValidationErrors(error?.response?.data?.errors);

      if (Object.keys(validationErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...validationErrors }));
      }

      setApiError(
        error?.response?.status === 401
          ? getApiErrorMessage(error, "Invalid email or password.")
          : getApiErrorMessage(error, "Login failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Manager Login</h1>
        <p className="mt-1 text-sm text-slate-500">Factory Worker Productivity Dashboard</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="login-email"
            name="email"
            type="text"
            label="Email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            id="login-password"
            name="password"
            type="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {notice ? <p className="text-sm text-green-700">{notice}</p> : null}
          {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Need an account?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
            Register as manager
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
