// 登录模块
export interface ReqLoginForm {
  username: string;
  password: string;
  code: string;
  language: string;
}
export interface ResLogin {
  token: string;
}
export interface ResAuthButtons {
  [key: string]: string[];
}
export interface ResCode {
  needVerificationCode: string;
}
export interface ResChangePass {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
