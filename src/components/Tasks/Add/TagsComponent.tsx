import { Button } from "@/components/ui/button";
import {
  addTagAPI,
  getTagsDropdownAPI,
  getTasksBasedTagsAPI,
  removeTagAPI,
} from "@/lib/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import tagIcon from "@/assets/tag- icon.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface TagsComponentProps {
  task: any;
  setTask: React.Dispatch<React.SetStateAction<any>>;
  errorMessages?: any;
  setErrorMessages?: React.Dispatch<React.SetStateAction<any>> | any;
}

const TagsComponent: React.FC<TagsComponentProps> = ({
  task,
  setTask,
  errorMessages,
  setErrorMessages,
}) => {
  const { taskId } = useParams({ strict: false });
  const [tagsRefresh, setTagsRefresh] = useState(0);
  const [tagsDropdown, setTagsDropdown] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [tagsloading, setTagsLoading] = useState(false);

  const { isLoading: isTaskTagsLoading, isError: isTaskTagsError } = useQuery({
    queryKey: ["getSingleTaskTags", taskId, tagsRefresh],
    queryFn: async () => {
      const tagsResponse = await getTasksBasedTagsAPI(taskId);
      const tagsData = tagsResponse?.data?.data.map((tag: any) => ({
        id: tag.id,
        title: tag.title,
      }));
      console.log(tagsData, "tagsData");

      try {
        if (tagsResponse?.status === 200 || tagsResponse?.status === 201) {
          setTask((prev: any) => ({
            ...prev,
            tags: tagsData || [],
          }));
        } else {
          throw new Error("Failed to fetch task tags");
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
    enabled: Boolean(taskId),
  });

  const fetchTagsDropdown = async () => {
    try {
      setTagsLoading(true);
      const response = await getTagsDropdownAPI();
      console.log(response, "response");
      if (response?.status === 200 || response?.status === 201) {
        setTagsDropdown(response?.data?.data || []);
      } else {
        setTagsDropdown([]);
      }
    } catch (error) {
      toast.error("Failed to fetch tag suggestions");
      console.error(error);
      setTagsDropdown([]);
    } finally {
      setTagsLoading(false);
    }
  };

  useEffect(() => {
    fetchTagsDropdown();
  }, []);

  const { mutate: addTag } = useMutation({
    mutationFn: async (payload: any) => {
      return await addTagAPI(taskId, payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        fetchTagsDropdown();
        setTagsRefresh((prev) => prev + 1);
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
      console.log(payload?.tagId, "payload");
      return await removeTagAPI(payload?.tagId);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setTagsRefresh((prev) => prev + 1);
      } else {
        throw new Error("Failed to remove tag");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred. Please try again.");
      console.error(error);
    },
  });

  const handleTagSelect = (tag: any) => {
    if (task?.tags?.some((t: any) => t.title === tag.title)) {
      toast.error("Tag already added to this task.");
      return;
    }
    setTask((prev: any) => ({
      ...prev,
      tags: [...prev.tags, { id: tag.id, title: tag.title }],
    }));
    addTag({ title: tag.title });
  };

  const handleAddNewTag = async () => {
    if (searchTerm.trim() === "") {
      toast.error("Please enter a valid tag name.");
      return;
    }
    addTag({ title: searchTerm.trim() });
    setSearchTerm("");
  };

  const handleTagDelete = (tagId: string) => {
    removeTag({ tagId });
  };

  return (
    <div>
      <div className="border mt-2">
        <div className="card-header border-b px-4 py-0 flex justify-between items-center gap-x-2 bg-gray-50">
          <h3 className="leading-1 text-black text-[1.1em]">Tags</h3>
          <div>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={tagsloading}
                  className="flex justify-start bg-[#F4F4F6] h-[35px] w-[220px] relative text-[#00000099] font-normal text-sm pl-2 border border-[#E2E2E2]"
                >
                  Add Tag
                  <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-700 text-white rounded-full w-[20px] h-[20px] p-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0 bg-white">
                <Command>
                  <CommandInput
                    placeholder="Search tags..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    {tagsloading ? (
                      <CommandEmpty>Loading...</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {tagsDropdown?.map((tagItem: any) => (
                          <CommandItem
                            key={tagItem.id}
                            onSelect={() => handleTagSelect(tagItem)}
                          >
                            {tagItem.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {searchTerm &&
                      !tagsDropdown.some(
                        (tag) =>
                          tag.title.toLowerCase() === searchTerm.toLowerCase()
                      ) && (
                        <CommandItem
                          className="text-green-600"
                          onSelect={handleAddNewTag}
                        >
                          Add New Tag: "{searchTerm}"
                        </CommandItem>
                      )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="card-body">
          <div className="max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 space-y-2 pt-3 pl-3 pr-3">
            <div className="flex flex-wrap">
              {task?.tags?.length > 0 ? (
                task?.tags.map((tag: any) => (
                  <div
                    key={tag.id}
                    className="bg-[#00B8121A] text-[#00B812] text-md font-medium mr-2 mb-2 flex items-center px-2 py-0 border rounded-full"
                  >
                    {tag.title}
                    <p
                      className="ml-1 text-[#000000] rotate-[45deg] font-medium cursor-pointer !text-[1.1rem] leading-3"
                      onClick={() => handleTagDelete(tag.id)}
                    >
                      +
                    </p>
                  </div>
                ))
              ) : isTaskTagsLoading ? (
                ""
              ) : (
                <div className="flex items-center justify-center py-1 w-[200px] mx-auto">
                  <img src={tagIcon} alt="No tags" className="w-5 h-5 mr-1" />
                  <span className="text-center">No tags found</span>
                </div>
              )}
            </div>
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
