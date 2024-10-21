const ProjectCard = ({ project }: any) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-40">
      <div className="text-lg font-semibold">{project.title}</div>
      <p className="text-sm text-gray-500">{project.description}</p>
      <div className="flex items-center space-x-2 mt-4"></div>
    </div>
  );
};

export default ProjectCard;
