import { DateRangePicker } from "rsuite";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { predefinedRanges } from "./CommonComponents/DatePickerRanges";
import "rsuite/dist/rsuite.css";

const DateRangeFilter = ({ dateValue, onChangeData }: any) => {
  const updateDateValues = (newDate: any) => {
    if (newDate) {
      const date1 = dayjs(newDate[0]).format("YYYY-MM-DD");
      const date2 = dayjs(newDate[1]).format("YYYY-MM-DD");
      onChangeData(date1, date2);
    } else {
      onChangeData("", "");
    }
  };
  console.log(updateDateValues, "values");

  return (
    <DateRangePicker
      className="!bg-[#F4F4F6] border border-[#E2E2E2] rounded-[8px] placeholder:text-[#00000066]"
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
