import selectDropIcon from "@/assets/select-dropdown.svg";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CommandEmpty } from "cmdk";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface Tag {
  id: number;
  title: string;
}

interface TagsSearchFilterProps {
  tagsData: Tag[];
  selectedTags: Tag[];
  setSelectedTags: any;
  onSelectTags: (selectedTags: Tag[]) => void;
}

const TagsSearchFilter = ({
  tagsData,
  selectedTags,
  setSelectedTags,
  onSelectTags,
}: TagsSearchFilterProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tempTags, setTempTags] = useState<number[]>([]);

  const toggleTag = (tagId: number): void => {
    setTempTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const confirmSelection = (): void => {
    const selectedTags = tagsData.filter((tag) => tempTags.includes(tag.id));
    setSelectedTags(selectedTags);
    setOpen(false);
    onSelectTags(selectedTags);
  };

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[220px] h-[35px] grid grid-cols-[30px_150px_25px] items-center !px-12  py-0 bg-[#F4F4F6] border-[#E2E2E2] rounded-[8px] text-[#00000099] relative overflow-hidden"
          >
            <div className="flex items-center gap-1 justify-start w-[100%] ">
              {selectedTags.length === 0 ? (
                <p>Select Tags</p>
              ) : (
                <div className="flex items-center gap-1 justify-between w-[96%]">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex justify-start items-center">
                      {selectedTags.slice(0, 2).map((tag, index) => (
                        <p
                          key={tag.id}
                          title={tag.title}
                          className="text-[#00B812] text-md font-medium rounded-full capitalize truncate max-w-[80px] m-0"
                        >
                          {tag.title}
                          {index < 1 && ","}{" "}
                        </p>
                      ))}
                    </div>

                    {selectedTags.length > 2 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center w-6 h-6 border-2 border-white rounded-full bg-gray-200 text-xs font-semibold cursor-pointer">
                            +{selectedTags.length - 2}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white p-2 rounded-md shadow-md">
                          <div className="max-w-[250px]">
                            {selectedTags.map((tag) => (
                              <p
                                key={tag.id}
                                className="text-sm text-gray-700 capitalize"
                              >
                                {tag.title}
                              </p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedTags.length > 0 && (
              <X
                className="cursor-pointer text-red-700 w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 mr-6"
                onClick={() => {
                  setSelectedTags([]);
                  setTempTags([]);
                  onSelectTags([]);
                }}
              />
            )}

            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
              <img
                src={selectDropIcon}
                alt="Dropdown Icon"
                className="w-5 h-5"
              />
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[250px] p-0 bg-white border rounded-sm z-[99999]">
          <Command>
            <CommandInput placeholder="Search Tags" />
            <CommandList className="max-h-[220px] z-[99999]">
              <CommandGroup>
                {tagsData?.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.title}
                    onSelect={() => toggleTag(tag.id)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${tempTags.includes(tag.id) ? "opacity-100" : "opacity-0"}`}
                    />
                    <p className="capitalize cursor-pointer">{tag.title}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandEmpty className="text-center">No tags found.</CommandEmpty>
            </CommandList>
            <div className="flex justify-end space-x-2 p-2 border-t">
              <Button
                className="bg-white border-transparent px-6 text-[#000000] text-sm font-medium"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTags([]);
                  setTempTags([]);
                  onSelectTags([]);
                  setOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                className="bg-[#000000] text-white px-6 font-medium text-sm rounded-[4px]"
                size="sm"
                variant="outline"
                onClick={confirmSelection}
              >
                Confirm
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default TagsSearchFilter;
