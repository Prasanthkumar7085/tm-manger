import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./Card";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";

const dummyProjects = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    name: `Project ${i + 1}`,
    description: `Description for project ${i + 1}`,
    members: Array(5)
      .fill(0)
      .map((_, j) => ({
        name: `Member ${j + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${j + 1}`,
      })),
  }));

const fetchProjects = async (page: any, search: any) => {
  return dummyProjects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );
};

export const Projects = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["projects", page, search],
    queryFn: () => fetchProjects(page, search),
  });

  if (isLoading) return <div>Loading...</div>;
  const handleNavigation = () => {
    navigate({
      to: "/projects/add",
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border px-3 py-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={handleNavigation}
        >
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
