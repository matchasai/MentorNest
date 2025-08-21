// Card component for course previews
import React from "react";

const Card = ({ title, mentor, price, children }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-gray-600 text-sm">Mentor: {mentor}</p>
    <p className="text-blue-600 font-bold">₹{price}</p>
    {children}
  </div>
);

export default Card; 