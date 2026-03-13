import React from "react";
function Input({
  label,
  error,
  id,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-500 placeholder:text-slate-400 focus:ring-2 ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export default Input;


