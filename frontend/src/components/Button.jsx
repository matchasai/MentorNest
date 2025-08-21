// Button component for consistent styling
import React from "react";

const Button = ({ children, onClick, type = "button", className = "", disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export default Button; 