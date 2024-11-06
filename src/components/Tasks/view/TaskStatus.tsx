import { taskStatusConstants } from "@/lib/helpers/statusConstants";
import { statusUpdateAPI } from "@/lib/services/tasks";
import { useMutation } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

function TaskStatus({
  taskId,
  setUpdateDetailsOfTask,
  selectedStatus,
  setSelectedStatus,
}: {
  taskId: string | any;
  setUpdateDetailsOfTask: any;
  selectedStatus:
    | {
        label: string;
        value: string;
      }
    | any;
  setSelectedStatus: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for dropdown

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectStatus = (status: any) => {
    setSelectedStatus(status);
    setIsOpen(false);
    mutate(status.value);
  };

  const { mutate } = useMutation({
    mutationFn: async (payload: any) => {
      return updateTaskStatus(payload);
    },
  });

  const updateTaskStatus = async (status: string) => {
    try {
      const body = {
        status: status,
      };

      const response = await statusUpdateAPI(taskId, body);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setUpdateDetailsOfTask((prev: any) => prev + 1);
      } else {
        toast.error("Failed to change status");
        setUpdateDetailsOfTask((prev: any) => prev + 1);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
      setUpdateDetailsOfTask((prev: any) => prev + 1);
    } finally {
      setIsOpen(false);
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
    <div className="relative inline-block text-left pb-4" ref={dropdownRef}>
   <button
  onClick={toggleDropdown}
  className={`text-md px-2 h-[35px] border  font-normal rounded-[4px] flex items-center max-w-[140px] justify-between ${
    selectedStatus?.value === 'TODO'
      ? 'bg-white text-[#6F42C1] border-[#6F42C1]'
      : selectedStatus?.value === 'IN_PROGRESS'
      ? 'bg-white text-[#007BFF] border-[#007BFF]'
       : selectedStatus?.value === 'OVER_DUE'
      ? 'bg-white text-[#A71D2A] border-[#A71D2A]'
      : selectedStatus?.value === 'COMPLETED'
      ? 'bg-white text-[#28A745] border-[#28A745]'
      : 'bg-white text-[#5FADFF] border-[#007BFF]'
  }`}
>
  <span>{selectedStatus?.label || "Default Status"}</span>
  <svg
    className="ml-2 w-8 h-8 text-[#696969]"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M5.5 7.5L10 12l4.5-4.5H5.5z" />
  </svg>
</button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {taskStatusConstants.map(
              (status: { label: string; value: string }) => (
                <li
                  key={status?.label}
                  onClick={() => selectStatus(status)}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500 cursor-pointer"
                >
                  {status?.label}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TaskStatus;
