import { DateRangePicker } from "rsuite";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { predefinedRanges } from "./CommonComponents/DatePickerRanges";
import "rsuite/dist/rsuite.css";

const DateRangeFilter = ({ dateValue, onChangeData }: any) => {
  const [selectedDate, setSelectedDate] = useState(dateValue);

  const updateDateValues = (newDate: any) => {
    if (newDate) {
      const date1 = dayjs(newDate[0]).format("YYYY-MM-DD");
      const date2 = dayjs(newDate[1]).format("YYYY-MM-DD");
      setSelectedDate(newDate);
      onChangeData(date1, date2);
    } else {
      setSelectedDate([]);
      onChangeData("", "");
    }
  };

  return (
    <DateRangePicker
      editable={false}
      placeholder={"Select Date"}
      placement="bottomEnd"
      ranges={predefinedRanges}
      value={selectedDate}
      onChange={updateDateValues}
      showHeader={false}
    />
  );
};

export default DateRangeFilter;
