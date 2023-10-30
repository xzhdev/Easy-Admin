// 请求响应参数（不包含data）
interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
declare interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
declare interface ResPage<T> extends ReqPage {
  list: T[];
  total: number;
}

// 分页请求参数
declare interface ReqPage {
  pageNum: number;
  pageSize: number;
}
