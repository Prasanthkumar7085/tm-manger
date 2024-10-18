import dayjs from "dayjs";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.css";

import {
  addDays,
  addMonths,
  endOfMonth,
  startOfMonth,
  subDays,
} from "rsuite/esm/internals/utils/date";
const GlobalDateRangeFilter = ({
  onChangeData,
  DatePickerplacement,
  dateFilterDefaultValue,
}: {
  onChangeData: any;
  DatePickerplacement?: any;
  dateFilterDefaultValue?: any;
}) => {
  const predefinedRanges: any = [
    {
      label: "Today",
      value: [new Date(), new Date()],
      placement: "left",
    },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },

    {
      label: "Last 30 days",
      value: [subDays(new Date(), 29), new Date()],
      placement: "left",
    },
    {
      label: "This month",
      value: [startOfMonth(new Date()), new Date()],
      placement: "left",
    },
    {
      label: "Last month",
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "Last 3 months",
      value: [
        startOfMonth(addMonths(new Date(), -3)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },

    {
      label: "Last 6 months",
      value: [
        startOfMonth(addMonths(new Date(), -6)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "Last 9 months",
      value: [
        startOfMonth(addMonths(new Date(), -9)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "Last year",
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear(), 0, 0),
      ],
      placement: "left",
    },

    {
      label: "This year",
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      placement: "left",
    },
  ];

  //update date values or format the date values
  const updateDateValues = (newDate: any) => {
    if (newDate) {
      const date1 = dayjs(newDate[0]).format("YYYY-MM-DD");
      const date2 = dayjs(newDate[1]).format("YYYY-MM-DD");
      onChangeData(date1, date2);
    } else {
      onChangeData("", "");
    }
  };

  return (
    <div className="w-[40%]">
      <DateRangePicker
        placement={DatePickerplacement ? DatePickerplacement : "bottomEnd"}
        ranges={predefinedRanges}
        value={dateFilterDefaultValue}
        format="MM/dd/yyyy"
        disabledDate={(date: any) => {
          return date.getTime() >= new Date().getTime();
        }}
        className="border-gray-300 rounded-md px-3 py-1 text-sm text-gray-600 "
        placeholder={"Start Date - End Date"}
        onChange={(newDate: any) => {
          updateDateValues(newDate);
        }}
      />
    </div>
  );
};

export default GlobalDateRangeFilter;
