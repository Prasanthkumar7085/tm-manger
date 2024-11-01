import { Button } from "@/components/ui/button";
import {
  addTagAPI,
  getTasksBasedTagsAPI,
  removeTagAPI,
} from "@/lib/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

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
  const { taskId } = useParams({ strict: false });
  const [tagsRefresh, setTagsRefresh] = useState(0);
  const [tags, setTags] = useState<any>([]);

  const { isLoading: isTaskTagsLoading, isError: isTaskTagsError } = useQuery({
    queryKey: ["getSingleTaskTags", taskId, tagsRefresh],
    queryFn: async () => {
      const tagsResponse = await getTasksBasedTagsAPI(taskId);
      const tagsData = tagsResponse?.data?.data.map((tag: any) => tag.title);
      try {
        if (tagsResponse?.status === 200 || tagsResponse?.status === 201) {
          setTags(tagsResponse?.data?.data || []);
          setTask((prev: any) => ({
            ...prev,
            tags: tagsData || [],
          }));
        } else {
          throw new Error("Failed to fetch task");
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
    enabled: Boolean(taskId),
  });

  const { mutate: addTag } = useMutation({
    mutationFn: async (payload: any) => {
      return await addTagAPI(taskId, payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        // toast.success(response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error("An error occurred. Please try again.");
      console.error(error);
      setTagsRefresh((prev) => prev + 1);
    },
  });

  const { mutate: removeTag } = useMutation({
    mutationFn: async (payload: any) => {
      return await removeTagAPI(payload?.tagId);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        // toast.success(response?.data?.message);
      } else {
        throw new Error("Failed to remove tag");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred. Please try again.");
      console.error(error);
      setTagsRefresh((prev) => prev + 1);
    },
  });

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
      if (taskId) {
        addTag({
          title: tagInput,
        });
      }
    }
    if (task.tags.includes(tagInput.trim())) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: ["Tag already exists"],
      }));
    }
  };

  const handleTagDelete = (tag: any) => {
    console.log(tag, "tag");
    setTask((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((t: any) => t !== tag),
    }));
    let tagId = tags.find((t: any) => t.title === tag)?.id;
    removeTag({
      tagId: tagId,
    });
  };

  console.log(task.tags, "fsd0i32");
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
        {task.tags?.length > 0
          ? task.tags.map((tag: any, index: number) => (
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
            ))
          : isTaskTagsLoading
            ? ""
            : "No Tags Found"}
      </div>
    </div>
  );
};

export default TagsComponent;
