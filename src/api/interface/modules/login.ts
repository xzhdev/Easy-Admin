// 登录模块
export interface ReqLoginForm {
  username: string;
  password: string;
}
export interface ResLogin {
  access_token: string;
}
export interface ResAuthButtons {
  [key: string]: string[];
}
