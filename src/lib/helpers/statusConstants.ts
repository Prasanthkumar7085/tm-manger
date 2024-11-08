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
export const activityStatus: any = [
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

export const taskStatusConstants: any = [
  {
    value: "TODO",
    label: "Todo",
    color: "#6f42c1",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "#007bff",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "#28a745",
  },
  {
    value: "OVER_DUE",
    label: "Over Due",
    color: "#a71d2a",
  },
];

export const taskPriorityConstants = [
  {
    value: "HIGH",
    label: "High",
    color: "#ff3c58",
  },
  {
    value: "LOW",
    label: "Low",
    color: "#499dff",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    color: "#ffa000",
  },
];
export const roleConstants = [
  { value: "admin", label: "Admin" },
  // { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "user", label: "User" },

  // { value: "MAINTAINER", label: "Maintainer" },
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
export const RoleValues = roleConstants.reduce(
  (acc, role) => {
    acc[role.value] = role.value;
    return acc;
  },
  {} as Record<string, string>
);
export const projectWiseConstants = [
  { value: "ADMIN", label: "Admin" },
  // { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "USER", label: "User" },

  // { value: "MAINTAINER", label: "Maintainer" },
];
