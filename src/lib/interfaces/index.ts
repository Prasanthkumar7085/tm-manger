import { Dispatch, SetStateAction } from "react";

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
export interface AddSheetRoverProps {
  userData: any;
  isEditing: any;
  errors: any;
  userType: any;
  userTypes: any;
  userTypeOpen: any;
  loading: boolean;
  isOpen: boolean;
  handleChangeEmail: any;
  setUserTypeOpen: any;
  handleChangePassword: any;
  handleDrawerClose: () => void;
  handleFormSubmit: () => void;
  onChangeStatus: any;
  handleInputChange: any;
}

export interface DynamicPaginationProps {
  paginationDetails: any;

  totalItems?: number;
  capturePageNum: (value: number) => void;
  captureRowPerItems: (value: number) => void;
  initialPage?: number;
  limitOptionsFromProps?: { title: string; value: number }[];
}
export interface StatusFilterProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface SheetRoverProps {
  userPasswordData: any;
  errors: any;
  loading: boolean;
  isOpen: boolean;
  handleCancel: () => void;
  handleUpdateChangePassword: any;
  resetUserPassword: () => void;
}

// export interface DeleteDialogProps {
//   openOrNot: boolean;
//   label: string;
//   onCancelClick: () => void;
//   onOKClick: () => void;
//   deleteLoading: boolean;
// }
export interface pageProps {
  columns: any[];
  data: any[];
  loading?: boolean;

  getData?: any;
  paginationDetails: any;
  removeSortingForColumnIds?: string[];
}

export interface loginProps {
  email: string;
  password: string;
}
export interface resetProps {
  new_password: string;
  confirm_new_password: string;
  reset_password_token: string;
}
export interface IReportsFilters {
  searchString: string;
  setSearchString: any;
  title?: string;
}

export type SheetDemoProps = {
  label: string;
  sheetTitle: string;
  onOKClick: () => void;
  extraField: string;
  memberData: { user_id: number; role: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export interface AddMemberProps {
  addNewMember: (newMember: { value: number; label: string }) => any; // Change type to match
}
export interface deleteProps {
  setDel: Dispatch<SetStateAction<number>>;
  del: any;
  project: any;
  getAllProjects: any;
}
