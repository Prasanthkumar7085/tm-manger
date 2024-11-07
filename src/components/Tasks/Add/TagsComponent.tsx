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
  errorMessages?: any;
  setErrorMessages?: React.Dispatch<React.SetStateAction<any>> | any;
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
        toast.success(response?.data?.message);
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
        toast.success(response?.data?.message);
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
    if (task.tags.includes(tagInput.trim())) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: ["Tag already exists"],
      }));
      return;
    }
    if (!tagInput) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: ["Please enter a valid tag"],
      }));
      return;
    }
    if (tagInput.trim()) {
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
  };

  const handleTagDelete = (tag: any) => {
    setTask((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((t: any) => t !== tag),
    }));
    let tagId = tags.find((t: any) => t.title === tag)?.id;
    removeTag({
      tagId: tagId,
    });
  };

  return (
    <div>
      <div>
        <div className="tags-heading flex space-x-3 items-center">
          <label className="block text-[#666666] text-sm font-medium">
            Tags
          </label>
          <div className="flex space-x-3 items-center bg-slate-50 border rounded-md pr-1">
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
              className="bg-slate-50 h-[25px] p-2 w-full rounded-md"
              placeholder="Enter tag"
            />
            <Button
              type="button"
              variant="add"
              size="DefaultButton"
              onClick={handleTagSubmit}
              className="h-[20px] bg-green-600 px-3"
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap mt-2">
          {task?.tags?.length > 0
            ? task?.tags.map((tag: any, index: number) => (
              <div
                key={index}
                className="bg-[#00B8121A] text-[#00B812] text-[0.8em] font-medium  mr-2 mb-2 flex px-2 rounded-full"
              >
                {tag}
                <p
                  className="ml-1 text-[#000000]   rotate-[45deg] font-medium cursor-pointer"
                  onClick={() => handleTagDelete(tag)}
                >
                  +
                </p>
              </div>
            ))
            : isTaskTagsLoading
              ? ""
              : ""}
        </div>
      </div>

      {errorMessages?.tags && (
        <p style={{ color: "red" }}>{errorMessages?.tags?.[0]}</p>
      )}

    </div>
  );
};

export default TagsComponent;
