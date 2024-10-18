const ProjectCard = ({ project }: any) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-40">
      <div className="text-lg font-semibold">{project.name}</div>
      <p className="text-sm text-gray-500">{project.description}</p>
      <div className="flex items-center space-x-2 mt-4">
        {project.members.map((member: any, idx: any) => (
          <img
            key={idx}
            className="h-8 w-8 rounded-full"
            src={member.avatar}
            alt={member.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
