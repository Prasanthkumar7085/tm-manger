export const statusConstants = [
  {
    value: "true",
    label: "Active",
  },
  {
    value: "false",
    label: "In-Active",
  },
];

export const taskStatusConstants: any = [
  {
    value: "TODO",
    label: "Todo",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "OVER_DUE",
    label: "Over Due",
  },
];

export const taskPriorityConstants = [
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
];
export const roleConstants = [
  { value: "ADMIN", label: "Admin" },
  // { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "USER", label: "User" },

  { value: "MAINTAINER", label: "Maintainer" },
];
export const bgColorObjectForStatus: any = {
  HIGH: "#FF3C5833",
  MEDIUM: "#FFA00033",
  LOW: "#499DFF33",
};
export const colorObjectForStatus: any = {
  HIGH: "#FF3C58",
  MEDIUM: "#FFA000",
  LOW: "#499DFF",
};
