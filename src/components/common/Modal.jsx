import React from "react";
function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-lg font-semibold text-slate-500 hover:text-slate-700"
            aria-label="Close modal"
          >
            x
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;


