// 用户管理模块
export interface ReqUserParams extends ReqPage {
  username: string;
  gender: number;
  idCard: string;
  email: string;
  address: string;
  createTime: string[];
  status: number;
}
export interface ResUserList {
  id: string;
  username: string;
  gender: number;
  user: { detail: { age: number } };
  idCard: string;
  email: string;
  address: string;
  createTime: string;
  status: number;
  avatar: string;
  photo: any[];
  children?: ResUserList[];
}
export interface ResStatus {
  userLabel: string;
  userValue: number;
}
export interface ResGender {
  genderLabel: string;
  genderValue: number;
}
export interface ResDepartment {
  id: string;
  name: string;
  children?: ResDepartment[];
}
export interface ResRole {
  id: string;
  name: string;
  children?: ResDepartment[];
}
