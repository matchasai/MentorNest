import React from "react";

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full relative">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
      </div>
    </div>
  );
};

export default Modal; 