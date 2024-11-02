import React from "react";

const ProjectDataTable = () => {
  const data = [
    {
      id: 1,
      name: "Project 1",
      todoCount: 3,
      inProgressCount: 5,
      overdueCount: 1,
      completedCount: 10,
      totalTasks: 19,
    },
    {
      id: 2,
      name: "Project 2",
      todoCount: 8,
      inProgressCount: 2,
      overdueCount: 0,
      completedCount: 5,
      totalTasks: 15,
    },
    {
      id: 3,
      name: "Project 3",
      todoCount: 2,
      inProgressCount: 4,
      overdueCount: 3,
      completedCount: 8,
      totalTasks: 17,
    },
    {
      id: 4,
      name: "Project 4",
      todoCount: 7,
      inProgressCount: 3,
      overdueCount: 1,
      completedCount: 6,
      totalTasks: 17,
    },
    {
      id: 5,
      name: "Project 5",
      todoCount: 4,
      inProgressCount: 6,
      overdueCount: 2,
      completedCount: 9,
      totalTasks: 21,
    },
    {
      id: 6,
      name: "Project 6",
      todoCount: 1,
      inProgressCount: 8,
      overdueCount: 0,
      completedCount: 7,
      totalTasks: 16,
    },
    {
      id: 7,
      name: "Project 7",
      todoCount: 5,
      inProgressCount: 4,
      overdueCount: 2,
      completedCount: 5,
      totalTasks: 16,
    },
    {
      id: 8,
      name: "Project 8",
      todoCount: 6,
      inProgressCount: 3,
      overdueCount: 1,
      completedCount: 4,
      totalTasks: 14,
    },
    {
      id: 9,
      name: "Project 9",
      todoCount: 2,
      inProgressCount: 5,
      overdueCount: 3,
      completedCount: 6,
      totalTasks: 16,
    },
    {
      id: 10,
      name: "Project 10",
      todoCount: 3,
      inProgressCount: 6,
      overdueCount: 2,
      completedCount: 8,
      totalTasks: 19,
    },
    {
      id: 11,
      name: "Project 11",
      todoCount: 4,
      inProgressCount: 7,
      overdueCount: 1,
      completedCount: 9,
      totalTasks: 21,
    },
    {
      id: 12,
      name: "Project 12",
      todoCount: 2,
      inProgressCount: 3,
      overdueCount: 0,
      completedCount: 10,
      totalTasks: 15,
    },
    {
      id: 13,
      name: "Project 13",
      todoCount: 5,
      inProgressCount: 2,
      overdueCount: 4,
      completedCount: 6,
      totalTasks: 17,
    },
    {
      id: 14,
      name: "Project 14",
      todoCount: 1,
      inProgressCount: 7,
      overdueCount: 3,
      completedCount: 8,
      totalTasks: 19,
    },
    {
      id: 15,
      name: "Project 15",
      todoCount: 6,
      inProgressCount: 4,
      overdueCount: 2,
      completedCount: 7,
      totalTasks: 19,
    },
  ];
  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left bg-gray-100 text-gray-600">
              S.No
            </th>
            <th className="border px-4 py-2 text-left bg-gray-100 text-gray-600">
              Project Name
            </th>
            <th className="border px-4 py-2 text-left bg-gray-100 text-gray-600">
              Todo
            </th>
            <th className="border px-4 py-2 text-left bg-gray-100 text-gray-600">
              In Progress
            </th>
            <th className="border px-4 py-2 text-left bg-gray-100 text-gray-600">
              Overdue
            </th>
            <th className="border px-4 py-2 text-left bg-gray-100 text-gray-600">
              Completed
            </th>
            <th className="border px-4 py-2 text-left bg-gray-100 text-gray-600">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((project, index) => (
            <tr key={project.id} className="odd:bg-white even:bg-gray-50">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{project.name}</td>
              <td className="border px-4 py-2 text-center">
                {project.todoCount}
              </td>
              <td className="border px-4 py-2 text-center">
                {project.inProgressCount}
              </td>
              <td className="border px-4 py-2 text-center">
                {project.overdueCount}
              </td>
              <td className="border px-4 py-2 text-center">
                {project.completedCount}
              </td>
              <td className="border px-4 py-2 text-center">
                {project.totalTasks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDataTable;
