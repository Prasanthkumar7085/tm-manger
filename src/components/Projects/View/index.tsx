import React from "react";
import TotalProjectsCounts from "../TotalCounts";

const projectData = {
  name: "DLW Gowtham",
  totalTasks: 500,
  toDo: 100,
  inProgress: 300,
  overdue: 50,
  completed: 50,
  createdAt: "04-01-2023",
  createdBy: "Mark",
  tasks: {
    todo: [
      {
        title: "DLW Sales",
        description: "Give flyers to Millinium medication care",
        comments: 76,
        members: 3,
      },
    ],
    completed: [
      {
        title: "DLW Sample Management",
        description: "Take Monthly Kits deliver to Texas Region",
        comments: 76,
        members: 3,
      },
      {
        title: "DLW Lab Operations",
        description: "Operations for the lab",
        comments: 66,
        members: 4,
      },
    ],
    overdue: [
      {
        title: "DLW Data Entry",
        description: "Add more data entry team",
        comments: 76,
        members: 3,
      },
      {
        title: "DLW Billing",
        description: "Add more billing entries",
        comments: 66,
        members: 2,
      },
    ],
  },
};

const ProjectView = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-semibold">Project View</h1>

        {/* Project Info */}
        {/* <div className="mt-6 flex items-center justify-between bg-white p-6 rounded-lg shadow"> */}
        <div className="flex items-center">
          <div>
            <h2 className="text-xl font-semibold">{projectData.name}</h2>
            <p>Add all Sales Repo Monthly Targets for UTI</p>
          </div>
        </div>
        <div className="flex space-x-6">
          <TotalProjectsCounts />
        </div>
        {/* </div> */}

        {/* Tasks Section */}
        <div className="mt-8 grid grid-cols-5 gap-4">
          {/* To Do */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">To Do</h3>
            {projectData.tasks.todo.map((task, index) => (
              <div key={index} className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm">{task.description}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span>Comments: {task.comments}</span>
                  <span>Members: {task.members}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Completed */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">Completed</h3>
            {projectData.tasks.completed.map((task, index) => (
              <div key={index} className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm">{task.description}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span>Comments: {task.comments}</span>
                  <span>Members: {task.members}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Overdue */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">Overdue</h3>
            {projectData.tasks.overdue.map((task, index) => (
              <div key={index} className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm">{task.description}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span>Comments: {task.comments}</span>
                  <span>Members: {task.members}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectView;
