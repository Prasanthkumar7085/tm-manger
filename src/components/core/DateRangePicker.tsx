import { convertToLabUTC } from "@/lib/helpers/timeZone";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import { predefinedRanges } from "./CommonComponents/DatePickerRanges";
import dayjs from "dayjs";

const DateRangeFilter = ({ dateValue, onChangeData }: any) => {
  const updateDateValues = (newDate: any) => {
    if (newDate) {
      const date1 = convertToLabUTC(newDate[0]);
      console.log(date1, "date1");
      const date2 = convertToLabUTC(newDate[1], true);
      onChangeData(date1, date2);
    } else {
      onChangeData("", "");
    }
  };

  const disableFutureDates = (date: Date) => {
    return dayjs(date).isAfter(dayjs());
  };

  return (
    <DateRangePicker
      className="!bg-[#F4F4F6] border border-[#E2E2E2] rounded-[8px] w-[210px] placeholder:text-[#00000066]"
      editable={false}
      placeholder={"Select Date"}
      placement="bottomEnd"
      ranges={predefinedRanges}
      value={dateValue}
      onChange={updateDateValues}
      showHeader={false}
      cleanable={true}
      shouldDisableDate={disableFutureDates}
    />
  );
};

export default DateRangeFilter;
