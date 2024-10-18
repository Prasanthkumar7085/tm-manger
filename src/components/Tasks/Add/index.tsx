import React, { useState } from "react";

const AddTask = () => {
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      {/* <aside className="bg-blue-900 text-white w-64 p-4">
        <div className="text-xl font-bold mb-8">Labsquire</div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="block px-4 py-2 hover:bg-blue-700 rounded">
                Dashboard
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="block px-4 py-2 bg-blue-700 rounded">
                Tasks
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="block px-4 py-2 hover:bg-blue-700 rounded">
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-700 rounded">
                Users
              </a>
            </li>
          </ul>
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Add Task</h2>
          <form>
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
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
                  <label className="block text-gray-700 font-bold mb-2">
                    Upload Attachments
                  </label>
                  <div className="border-2 border-dashed rounded-md p-4">
                    <p className="text-gray-500 text-sm">
                      Drag & Drop your file here Or Click to add files
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
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

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="px-6 py-2 bg-red-500 text-white rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTask;
