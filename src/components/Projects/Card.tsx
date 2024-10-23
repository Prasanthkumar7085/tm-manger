const ProjectCard = ({ project }: any) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-40 w-full max-w-sm relative">
      <div className="flex flex-col items-start justify-between">
        <div className="w-8 h-8">
          <img
            src={"/favicon.png"}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-lg font-semibold">{project.title}</div>
        <p className="text-sm text-gray-500">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
