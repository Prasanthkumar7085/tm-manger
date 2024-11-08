import { RoleValues } from "./statusConstants";

export const loginHelper = (user_type: any) => {
  if (user_type == "admin" || "lead" || "manager") {
  }
};
export const canAddTask = (user_type: string) => {
  return user_type !== "user";
};
