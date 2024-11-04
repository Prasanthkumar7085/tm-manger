import { statusUpdateAPI } from "@/lib/services/tasks";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

function TaskStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("In Progress");
  const statuses = ["In Progress", "Completed", "Pending"];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectStatus = (status: any) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };
  const { mutate } = useMutation({
    mutationFn: async (payload: any) => {
      return statusUpdateAPI;
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    },
  });

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-4 py-2 border border-blue-300 rounded-md text-blue-500 bg-white hover:bg-blue-100"
      >
        <span className="text-lg">{selectedStatus}</span>
        <svg
          className="ml-2 w-3 h-3 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
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
