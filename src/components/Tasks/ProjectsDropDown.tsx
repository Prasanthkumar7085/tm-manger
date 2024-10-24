import React, { useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

interface ProjectDropDownProps {
  projects: any[];
  onSelectProject: (projectId: string) => void;
}

const ProjectDropDown: React.FC<ProjectDropDownProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedProject, setSelectedProject] = useState<string>("all");

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    onSelectProject(value === "all" ? "" : value);
  };

  return (
    <Select onValueChange={handleProjectChange} value={selectedProject}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Project" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Projects</SelectItem>{" "}
        {projects?.map((project: any) => (
          <SelectItem key={project.id} value={project.id}>
            {project.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectDropDown;
