import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  addTagAPI,
  getTagsDropdownAPI,
  getTasksBasedTagsAPI,
  removeTagAPI,
} from "@/lib/services/tasks";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Check, Command } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [tagsDropdown, setTagsDropdown] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoading: isTaskTagsLoading, isError: isTaskTagsError } = useQuery({
    queryKey: ["getSingleTaskTags", taskId, tagsRefresh],
    queryFn: async () => {
      const tagsResponse = await getTasksBasedTagsAPI(taskId);
      const tagsData = tagsResponse?.data?.data?.map((tag: any) => tag.title);
      try {
        if (tagsResponse?.status === 200 || tagsResponse?.status === 201) {
          setTags(tagsResponse?.data?.data || []);
          setTask((prev: any) => ({
            ...prev,
            tags: tagsData || [], // Ensure tagsData is an array
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

  const fetchTagsDropdown = async () => {
    try {
      const response = await getTagsDropdownAPI();
      if (response?.status === 200 || response?.status === 201) {
        console.log(response?.data?.data, "sdfsd");
        setTagsDropdown(response?.data?.data || []);
        setIsDropdownOpen(true);
      } else {
        setTagsDropdown([]);
        setIsDropdownOpen(false);
      }
    } catch (error) {
      toast.error("Failed to fetch tag suggestions");
      console.error(error);
      setTagsDropdown([]);
      setIsDropdownOpen(false);
    }
  };

  const handleTagSubmit = () => {
    if (task?.tags?.includes(tagInput.trim())) {
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
        tags: [...(prev?.tags || []), tagInput.trim()],
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
      tags: (prev?.tags || []).filter((t: any) => t !== tag),
    }));
    let tagId = tags.find((t: any) => t.title === tag)?.id;
    removeTag({
      tagId: tagId,
    });
  };

  return (
    <div className="border mt-2">
      <div className="card-header border-b px-4 py-0 flex justify-between items-center gap-x-2 bg-gray-50">
        <h3 className="leading-1 text-black text-[1.1em]">Tags</h3>
        <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <PopoverTrigger asChild>
            <div className="flex space-x-3 items-center bg-slate-50 border border-green-600 rounded-md pr-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isTaskTagsLoading) {
                    handleTagSubmit();
                    setIsDropdownOpen(false);
                    e.preventDefault();
                  }
                }}
                className="bg-slate-50 h-[25px] p-2 w-full rounded-md"
                placeholder="Enter tag"
                onFocus={() => fetchTagsDropdown()}
              />

              <Button
                type="button"
                variant="add"
                disabled={isTaskTagsLoading}
                size="DefaultButton"
                onClick={() => {
                  handleTagSubmit();
                  setIsDropdownOpen(false);
                }}
                className="h-[20px] bg-green-600 px-3"
              >
                Add
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-white">
            <Command>
              <CommandInput placeholder="Search Tags" />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {tagsDropdown?.length > 0
                    ? tagsDropdown.map((tag, index) =>
                        tag?.title ? (
                          <CommandItem
                            className="cursor-pointer"
                            key={index}
                            value={tag?.title}
                            onSelect={(currentvale) => {
                              setTagInput(currentvale);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                tagInput === tag?.title
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "green",
                                display: "inline-block",
                                marginRight: "8px",
                              }}
                            ></span>
                            {tag?.title}
                          </CommandItem>
                        ) : null
                      )
                    : ""}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="card-body">
        <div className="max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 space-y-2 pt-3 pl-3 pr-3">
          <div className="flex flex-wrap">
            {task?.tags?.length > 0 ? (
              task?.tags?.map((tag: any, index: any) => (
                <div
                  key={index}
                  className="bg-[#00B8121A] text-[#00B812] text-md font-medium mr-2 mb-2 flex items-center px-2 py-0 border rounded-full"
                >
                  {tag}
                  <p
                    className="ml-1 text-[#000000] rotate-[45deg] font-medium cursor-pointer !text-[1.1rem] leading-3"
                    onClick={() => {
                      if (!isTaskTagsLoading) {
                        handleTagDelete(tag);
                      }
                    }}
                  >
                    +
                  </p>
                </div>
              ))
            ) : isTaskTagsLoading ? (
              ""
            ) : (
              <div className="flex items-center justify-center py-1 w-[200px] mx-auto">
                <span className="text-center">No tags found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {errorMessages?.tags && (
        <p style={{ color: "red" }}>{errorMessages?.tags?.[0]}</p>
      )}
    </div>
  );
};

export default TagsComponent;
