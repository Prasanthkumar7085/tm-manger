import { Button } from "@/components/ui/button";

interface TagsComponentProps {
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  task: any;
  setTask: React.Dispatch<React.SetStateAction<any>>;
  errorMessages: any;
  setErrorMessages: React.Dispatch<React.SetStateAction<any>>;
}

const TagsComponent: React.FC<TagsComponentProps> = ({
  tagInput,
  setTagInput,
  task,
  setTask,
  errorMessages,
  setErrorMessages,
}) => {
  const handleTagSubmit = () => {
    if (tagInput.trim() && !task.tags.includes(tagInput.trim())) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: [""],
      }));
      setTask((prev: any) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
    if (task.tags.includes(tagInput.trim())) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: ["Tag already exists"],
      }));
    }
  };

  const handleTagDelete = (tag: any) => {
    setTask((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((t: any) => t !== tag),
    }));
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">Tags</label>
      <div className="flex">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTagSubmit();
              e.preventDefault();
            }
          }}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter tag"
        />
        <Button type="button" onClick={handleTagSubmit} className="ml-2">
          Add
        </Button>
      </div>
      {errorMessages.tags && (
        <p style={{ color: "red" }}>{errorMessages?.tags?.[0]}</p>
      )}
      <div className="flex flex-wrap mt-2">
        {task.tags.map((tag: any, index: number) => (
          <div
            key={index}
            className="flex items-center mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded mr-2"
          >
            {tag}
            <p
              className="ml-1 text-red-500 rotate-[45deg] cursor-pointer"
              onClick={() => handleTagDelete(tag)}
            >
              +
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsComponent;
