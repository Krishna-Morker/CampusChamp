import { useState } from "react";

export default function Modal({ isOpen, onClose, onSubmit, mes, setInputValue, InputValue }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-600 p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">{mes}</h2>
        <input
          type="number"
          value={InputValue}
          className="w-full px-4 py-2 border rounded-md mb-4 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter points"
        />
        <div className="flex justify-between">
          <button
            onClick={onSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-150"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
