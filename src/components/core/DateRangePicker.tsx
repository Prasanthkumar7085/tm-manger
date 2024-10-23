import { DateRangePicker } from "rsuite";

import dayjs from "dayjs";
import { predefinedRanges } from "./CommonComponents/DatePickerRanges";
import "rsuite/DatePicker/styles/index.css";

const DateRangeFilter = ({ dateValue, onChangeData }: any) => {
  const updateDateValues = (newDate: any) => {
    if (newDate) {
      const [fromDate, toDate] = newDate;
      const date1 = dayjs(fromDate).startOf("day").toISOString();
      const date2 = dayjs(toDate).endOf("day").toISOString();

      onChangeData(date1, date2);
    } else {
      onChangeData("", "");
    }
  };

  return (
    <DateRangePicker
      editable={false}
      placeholder={"Select Date"}
      ranges={predefinedRanges}
      placement="bottomEnd"
      value={dateValue}
      onChange={updateDateValues}
      showHeader={false}
    />
  );
};

export default DateRangeFilter;
