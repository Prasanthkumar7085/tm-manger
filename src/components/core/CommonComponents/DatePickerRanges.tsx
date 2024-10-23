import {
  addDays,
  endOfMonth,
  startOfMonth,
  addMonths,
  subDays,
} from "rsuite/esm/internals/utils/date";
export const predefinedRanges: any = [
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
