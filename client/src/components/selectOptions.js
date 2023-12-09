import React from 'react';

const SelectOptions = () => {
  return (
    <div className="relative inline-block text-left">
      {/* Trigger button */}
      <button type="button" className="inline-flex justify-between w-32 px-4 py-2 bg-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        Select
        <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown content */}
      <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
        <div className="py-1">
          {/* Option 1 */}
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Option 1</a>
          {/* Option 2 */}
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Option 2</a>
          {/* Option 3 */}
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Option 3</a>
        </div>
      </div>

      {/* Line connecting options */}
      <div className="absolute top-1/2 left-full w-2 h-px bg-gray-300 transform -translate-y-1/2"></div>
    </div>
  );
};

export default SelectOptions;