import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-800">404</h1>
        <p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;


