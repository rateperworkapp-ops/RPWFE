import React from "react";
function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;


