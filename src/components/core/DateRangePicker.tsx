import React, { FC, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

interface DatePickerFieldProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const DatePickerField: FC<DatePickerFieldProps> = ({ value, onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onChange(date);
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <div className="relative w-full">
      <div
        className="flex items-center border border-gray-300 rounded-md shadow-sm p-2 cursor-pointer"
        onClick={toggleCalendar}
      >
        <input
          type="text"
          value={
            selectedDate ? selectedDate.toLocaleDateString() : "Select Date"
          }
          readOnly
          className="flex-grow outline-none"
        />
        <CalendarIcon className="text-gray-500 ml-2" />{" "}
      </div>

      {isCalendarOpen && (
        <div className="absolute top-medium mt-2 z-10 p-4 bg-white border border-gray-300 rounded-md shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            className="border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerField;
