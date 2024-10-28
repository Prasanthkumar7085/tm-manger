export interface ProjectPayload {
  title: string;
  description: string;
  project_members?: { user_id: number; role: string }[];
  code: string;
}
export interface MemberPayload {
  user_id: number;
  role: string;
}
