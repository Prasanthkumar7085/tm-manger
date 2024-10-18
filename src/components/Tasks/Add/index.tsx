import Loading from "@/components/core/Loading";
import UploadFiles from "@/components/core/UploadDocuments";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { toast } from "sonner";

const AddTask = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState({
    project: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    tags: "",
    assignee: "",
  });

  const handleChange = (e: any) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    toast.success("Task added successfully!");
    navigate({ to: "/tasks" });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Add Task</h2>
          <form>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Select Project
                  </label>
                  <select
                    name="project"
                    value={task.project}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Select Project</option>
                    <option>Labsquire </option>
                    <option>Analytics</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter Task Title"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter Task Description"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <UploadFiles />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Select priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={task.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter tag"
                  />
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                    Restaurant
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Assign To
                  </label>
                  <select
                    name="assignee"
                    value={task.assignee}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Select a person</option>
                    <option>Pavan</option>
                    <option>Gowtham</option>
                    <option>Sudhakar</option>
                    <option>Kedar</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                className="px-6 py-2 bg-red-500 text-white rounded-md mr-2"
                onClick={() => navigate({ to: "/tasks" })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </main>
      {/* <Loading loading={} /> */}
    </div>
  );
};

export default AddTask;
