import { convertToLabUTC } from "@/lib/helpers/timeZone";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import { predefinedRanges } from "./CommonComponents/DatePickerRanges";

const DateRangeFilter = ({ dateValue, onChangeData }: any) => {
  const updateDateValues = (newDate: any) => {
    if (newDate) {
      const date1 = convertToLabUTC(newDate[0]);
      const date2 = convertToLabUTC(newDate[1], true);
      onChangeData(date1, date2);
    } else {
      onChangeData("", "");
    }
  };

  return (
    <DateRangePicker
      className="!bg-[#F4F4F6] border border-[#E2E2E2] rounded-[8px] w-[200px] placeholder:text-[#00000066]"
      editable={false}
      placeholder={"Select Date"}
      placement="bottomEnd"
      ranges={predefinedRanges}
      value={dateValue}
      onChange={updateDateValues}
      showHeader={false}
      cleanable={true}
    />
  );
};

export default DateRangeFilter;
