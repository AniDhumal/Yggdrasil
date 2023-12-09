import React, { useState } from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const modalClass = isOpen ? 'block' : 'hidden';

  return (
    <div className={`fixed inset-0 ${modalClass} overflow-y-auto`}>
      <div className="flex items-center justify-center min-h-screen p-4 bg-slate-500 bg-opacity-60">
        <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-thin">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              &#x2715;
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};