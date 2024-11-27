import { Input } from "@/components/ui/input";
import { IReportsFilters } from "@/lib/interfaces";
import closeIcon from "@/assets/close iocn.svg";

import { Search } from "lucide-react";

const SearchFilter: React.FC<IReportsFilters> = ({
  searchString,
  setSearchString,
  title,
}) => {
  return (
    <div className="relative h-[35px] w-[250px]">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 bg-red-700 text-white rounded-full w-[20px] h-[20px] p-1" />
      <Input
        placeholder={title}
        value={searchString}
        type="text"
        onChange={(e) => setSearchString(e.target.value)}
        className="pl-8 pr-8  text-xs bg-[#FFFFFF] border-[#E2E2E2] rounded-[8px] w-full h-[35px] placeholder:text-[#00000099]  focus:outline-none focus-visible:outline-none"
      />
      {searchString && (
        <button
          onClick={() => setSearchString("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          <img alt="icon" src={closeIcon} className="w-3 h-3 mr-1" />
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
