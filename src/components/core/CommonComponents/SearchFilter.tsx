import React, { FC } from "react";
import { Input } from "@/components/ui/input";

interface SearchFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchField: FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder = "Search By Name",
}) => {
  return (
    <div className="w-full">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
    </div>
  );
};

export default SearchField;
