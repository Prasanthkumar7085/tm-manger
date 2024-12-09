import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "@tanstack/react-router";
import tagIcon from "@/assets/tag- icon.svg";
import Loading from "@/components/core/Loading";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  addTagAPI,
  getTagsDropdownAPI,
  getTasksBasedTagsAPI,
  removeTagAPI,
} from "@/lib/services/tasks";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

interface TagsComponentProps {
  errorMessages?: any;
  setErrorMessages?: React.Dispatch<React.SetStateAction<any>> | any;
}

const TagsComponent: React.FC<TagsComponentProps> = ({ errorMessages }) => {
  const { taskId } = useParams({ strict: false });
  const [tagsRefresh, setTagsRefresh] = useState(0);
  const [tagsDropdown, setTagsDropdown] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [tagsloading, setTagsLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [task, setTask] = useState<any>({});

  const { isLoading: isTaskTagsLoading, isError: isTaskTagsError } = useQuery({
    queryKey: ["getSingleTaskTags", taskId, tagsRefresh],
    queryFn: async () => {
      const tagsResponse = await getTasksBasedTagsAPI(taskId);
      const tagsData = tagsResponse?.data?.data.map((tag: any) => ({
        id: tag.id,
        tag_id: tag.tag_id,
        title: tag.title,
      }));
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
      if (response?.status === 200 || response?.status === 201) {
        setTagsDropdown(response?.data?.data || []);
      } else {
        setTagsDropdown([]);
      }
    } catch (error) {
      toast.error("Failed to fetch tag suggestions");
      setTagsDropdown([]);
    } finally {
      setTagsLoading(false);
    }
  };

  const { mutate: addTag } = useMutation({
    mutationFn: async (payload: any) => {
      return await addTagAPI(taskId, payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        fetchTagsDropdown();
        setTagsRefresh((prev) => prev + 1);
      } else {
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
      return await removeTagAPI(payload?.tagId);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setTagsRefresh((prev) => prev + 1);
      } else {
        setTagsRefresh((prev) => prev + 1);
        throw new Error("Failed to remove tag");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred. Please try again.");
      console.error(error);
    },
  });

  const handleTagSelect = (tag: any) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleConfirmTags = () => {
    const tagTitles = selectedTags.map((tag) => tag.title);
    if (tagTitles.length > 0) {
      addTag({ tags: tagTitles });
    }
    setSelectedTags([]);
    setPopoverOpen(false);
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  const handleTagDelete = (tagId: string) => {
    removeTag({ tagId });
  };

  const handleTagDeleteInAdd = (tag: any) => {
    setTask((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((t: any) => t !== tag),
    }));
  };

  const handleAddNewTag = async () => {
    if (searchTerm.trim() === "") {
      toast.error("Please enter a valid tag name.");
      return;
    }
    addTag({ tags: [searchTerm.trim()] });
    setSearchTerm("");
  };

  useEffect(() => {
    fetchTagsDropdown();
  }, []);

  return (
    <div>
      <div className="border mt-2">
        <div className="card-header border-b px-4 py-0 flex justify-between items-center gap-x-2 bg-gray-50">
          <h3 className="leading-1 text-black text-[1.1em]">Tags</h3>
          <div>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                    <CommandGroup>
                      {tagsDropdown?.map((tagItem: any) => {
                        const isDisabled = task?.tags?.some(
                          (t: any) => t.tag_id === tagItem.id
                        );
                        return (
                          <CommandItem
                            key={tagItem.id}
                            onSelect={() => handleTagSelect(tagItem)}
                            disabled={isDisabled}
                            className={`${
                              selectedTags.some((t) => t.id === tagItem.id)
                                ? "bg-blue-100"
                                : ""
                            }`}
                          >
                            {selectedTags.some((t) => t.id === tagItem.id) && (
                              <Check className="mr-2 text-green-500" />
                            )}
                            {tagItem.title}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>

                    {searchTerm &&
                      !tagsDropdown.some(
                        (tag) =>
                          tag.title.toLowerCase() === searchTerm.toLowerCase()
                      ) && (
                        <CommandItem
                          className="text-green-600 cursor-pointer"
                          onSelect={handleAddNewTag}
                        >
                          Add New Tag: "{searchTerm}"
                        </CommandItem>
                      )}
                  </CommandList>
                </Command>
                <div className="flex justify-end gap-2 p-2">
                  <Button
                     className="bg-white border-transparent px-6 text-[#000000] text-sm font-medium"
                      variant="outline" onClick={handleClearTags}>
                    Clear
                  </Button>
                  <Button
                    className="bg-[#000000] text-white px-6 font-medium text-sm rounded-[4px]"
                    onClick={handleConfirmTags}
                    disabled={selectedTags.length === 0}
                  >
                    Confirm
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="card-body relative">
          <div className="max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 space-y-2 pt-3 pl-3 pr-3">
            <div className="flex flex-wrap">
              {task?.tags?.length > 0 ? (
                task?.tags.map((tag: any) => (
                  <div
                    key={tag.id || tag}
                    className="bg-[#00B8121A] text-[#00B812] text-md font-medium mr-2 mb-2 flex items-center px-2 py-0 border rounded-full"
                  >
                    {tag.title || tag}
                    <p
                      className="ml-1 text-[#000000] rotate-[45deg] font-medium cursor-pointer !text-[1.1rem] leading-3"
                      onClick={() => {
                        if (location.pathname.includes("/add")) {
                          handleTagDeleteInAdd(tag);
                        } else {
                          handleTagDelete(tag.id);
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
                  <img src={tagIcon} alt="No tags" className="w-5 h-5 mr-1" />
                  <span className="text-center">No tags found</span>
                </div>
              )}
            </div>
          </div>
          <Loading loading={tagsloading || isTaskTagsLoading} />
        </div>
      </div>

      {errorMessages?.tags && (
        <p style={{ color: "red" }}>{errorMessages?.tags?.[0]}</p>
      )}
    </div>
  );
};

export default TagsComponent;
//
