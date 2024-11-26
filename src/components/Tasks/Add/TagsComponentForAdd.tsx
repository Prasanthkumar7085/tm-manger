import tagIcon from "@/assets/tag- icon.svg";
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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronsUpDown, Check } from "lucide-react";
import { getTagsDropdownAPI } from "@/lib/services/tasks";
import ta from "date-fns/locale/ta";

interface TagsComponentProps {
  task: any;
  setTask: React.Dispatch<React.SetStateAction<any>>;
  errorMessages?: any;
}

const TagsComponentForAdd: React.FC<TagsComponentProps> = ({
  task,
  setTask,
  errorMessages,
}) => {
  const [tagsDropdown, setTagsDropdown] = useState<any[]>([]);
  const [allSelectedTags, setAllSelectedTags] = useState<any[]>([]);
  const [newTags, setNewTags] = useState<any[]>([]);
  const [confirmedSelectedTags, setConfirmedSelectedTags] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [tagsLoading, setTagsLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

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

  useEffect(() => {
    fetchTagsDropdown();
  }, []);

  const handleTagSelect = (tag: any) => {
    if (tag.newTag) {
      setNewTags([...newTags, tag]);
      setConfirmedSelectedTags([...confirmedSelectedTags, tag]);
    } else if (allSelectedTags.some((t) => t.id === tag.id)) {
      setAllSelectedTags(allSelectedTags.filter((t) => t.id !== tag.id));
    } else {
      setAllSelectedTags([...allSelectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: any) => {
    if (tag.newTag) {
      setNewTags(newTags.filter((t) => t.title !== tag.title));
    } else {
      setAllSelectedTags(allSelectedTags.filter((t) => t.id !== tag.id));
      setConfirmedSelectedTags(
        confirmedSelectedTags.filter((t) => t.id !== tag.id)
      );
    }
  };

  const handleConfirmTags = () => {
    let taskDetails = { ...task };
    setConfirmedSelectedTags((prev) => [...prev, ...allSelectedTags]);
    const tagIds = [...confirmedSelectedTags, ...allSelectedTags]
      .map((tag) => tag.id)
      .filter(Boolean);
    let newTagsarray = newTags.map((tag) => tag.title);
    if (tagIds?.length > 0) {
      taskDetails["tag_ids"] = [...tagIds];
      console.log(tagIds, "tags ids");
    }
    if (newTagsarray?.length > 0) {
      taskDetails["tags"] = [...newTagsarray];
    }
    setTask(taskDetails);
    setAllSelectedTags([]);
    setNewTags([]);
    setPopoverOpen(false);
    setSearchTerm("");
  };

  const handleClearTags = () => {
    setAllSelectedTags([]);
    setNewTags([]);
    setPopoverOpen(false);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setSearchTerm("");
  };

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
                  disabled={tagsLoading}
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
                        const isSelected = allSelectedTags.some(
                          (t) => t.id === tagItem.id
                        );
                        const isDisabled = confirmedSelectedTags?.some(
                          (t: any) => t.id === tagItem.id
                        );
                        return (
                          <CommandItem
                            key={tagItem.id}
                            disabled={isDisabled}
                            onSelect={() => handleTagSelect(tagItem)}
                            className={`${isSelected ? "bg-blue-100" : ""}`}
                          >
                            {isSelected && (
                              <Check className="mr-2 text-green-500" />
                            )}
                            {tagItem.title}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
                {searchTerm &&
                tagsDropdown.some(
                  (t) =>
                    (t.title.toLowerCase() == searchTerm?.toLowerCase()) ===
                    false
                ) ? (
                  <p
                    key="newTag"
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      handleTagSelect({
                        title: searchTerm,
                        newTag: true,
                      })
                    }
                  >
                    Create new tag: {searchTerm}
                  </p>
                ) : (
                  ""
                )}
                <div className="flex justify-between p-2">
                  <Button variant="outline" onClick={handleClearTags}>
                    Clear
                  </Button>
                  <Button
                    onClick={handleConfirmTags}
                    disabled={
                      allSelectedTags.length === 0 && newTags.length === 0
                    }
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
              {confirmedSelectedTags.length > 0 ? (
                confirmedSelectedTags.map((tag: any) => (
                  <div
                    key={tag.id}
                    className="bg-[#00B8121A] text-[#00B812] text-md font-medium mr-2 mb-2 flex items-center px-2 py-0 border rounded-full"
                  >
                    {tag.title}
                    <button
                      className="ml-1 text-[#000000] rotate-[45deg] font-medium cursor-pointer !text-[1.1rem] leading-3"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      +
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-1 w-[200px] mx-auto">
                  <img src={tagIcon} alt="No tags" className="w-5 h-5 mr-1" />
                  <span className="text-center">No tags selected</span>
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

export default TagsComponentForAdd;
