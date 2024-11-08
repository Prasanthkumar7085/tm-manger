import { capitalizeWords } from "@/lib/helpers/CapitalizeWords";
import {
  taskPriorityConstants,
  taskStatusConstants,
} from "@/lib/helpers/statusConstants";
import { priorityUpdateAPI, statusUpdateAPI } from "@/lib/services/tasks";
import { useMutation } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

function PriorityStatus({
  taskId,
  setUpdatePriority,
  selectedPriority,
  setSelectedPriority,
  viewData,
}: {
  taskId: string | any;
  setUpdatePriority: any;
  selectedPriority:
    | {
        label: string;
        value: string;
      }
    | any;
  setSelectedPriority: any;
  viewData: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectPriority = (priority: any) => {
    setSelectedPriority(priority);
    setIsOpen(false);
    mutate({ priority: priority.value });
  };

  const { mutate } = useMutation({
    mutationFn: async (payload: { priority: string }) => {
      return updateTaskPriority(payload);
    },
  });

  const updateTaskPriority = async (payload: { priority: string }) => {
    try {
      setLoading(true);
      const response = await priorityUpdateAPI(taskId, payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setUpdatePriority((prev: any) => prev + 1);
      } else {
        toast.error("Failed to change Priority");
        setUpdatePriority((prev: any) => prev + 1);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
      setUpdatePriority((prev: any) => prev + 1);
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        disabled={loading}
        onClick={toggleDropdown}
        className={`border pl-4 rounded-lg flex items-center font-sans font-medium ${
          (selectedPriority?.value || viewData?.priority) === "HIGH"
            ? "border-[#ff3c58] text-[#ff3c58]"
            : (selectedPriority?.value || viewData?.priority) === "MEDIUM"
              ? "border-[#ffa000] text-[#ffa000]"
              : (selectedPriority?.value || viewData?.priority) === "LOW"
                ? " border-[#499dff] text-[#499dff]"
                : " border-[#000] text-black"
        }`}
      >
        {selectedPriority?.label
          ? selectedPriority.label
          : capitalizeWords(viewData?.priority)}
        <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 7.5L10 12l4.5-4.5H5.5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {taskPriorityConstants.map(
              (priority: { label: string; value: string }) => (
                <li
                  key={priority?.label}
                  onClick={() => selectPriority(priority)}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500 cursor-pointer"
                >
                  {priority?.label}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PriorityStatus;
