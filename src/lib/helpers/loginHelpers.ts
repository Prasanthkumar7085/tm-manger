import { RoleValues } from "./statusConstants";

export const loginHelper = (user_type: any) => {
  if (user_type == "admin" || "lead" || "manager") {
  }
};
export const canAddTask = (user_type: string) => {
  return user_type !== "user";
};

export const isMananger = (
  project_members: any,
  user_id: string,
  user_type: string
) => {
  if (project_members?.length > 0) {
    let manager = project_members.find(
      (member: any) => member.user_id == user_id && member.role == "MANAGER"
    );
    return manager ? true : false;
  }
};
export const isProjectAdmin = (
  project_members: any,
  user_id: string,
  user_type: string
) => {
  if (project_members?.length > 0) {
    let admin = project_members.find(
      (member: any) => member.user_id == user_id && member.role == "ADMIN"
    );
    return admin ? true : false;
  }
};

export const isProjectMemberOrNot = (project_members: any, user_id: string) => {
  console.log(project_members, "project_members");
  console.log(user_id, "user_id");
  if (project_members?.length > 0) {
    let member = project_members.find(
      (member: any) => member.user_id == user_id
    );
    console.log(member, "member");
    return member ? true : false;
  }
};
