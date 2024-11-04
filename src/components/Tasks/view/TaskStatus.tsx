import React, { useState } from 'react';

function TaskStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('In Progress');
  const statuses = ['In Progress', 'Completed', 'Pending'];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectStatus = (status) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-[#e7e7e7] text-white px-4 h-[35px] font-semibold rounded-lg flex items-center"
      >
        <span>{selectedStatus}</span>
        <svg className="ml-2 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 7.5L10 12l4.5-4.5H5.5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {statuses.map((status) => (
              <li
                key={status}
                onClick={() => selectStatus(status)}
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500 cursor-pointer"
              >
                {status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TaskStatus;
