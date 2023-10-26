import { ResPage, Report } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 机构大额结售汇资金
 */
// 获取模块列表
export const getFundsList = (params?: any) => {
  return http.get<ResPage<Report.Funds.ResFunds>>(PORT1 + `/funds/list`, params, { loading: false });
};

//新增
export const addLoan = (params?: any) => {
  return http.get<ResPage<Report.Funds.ResFunds>>(PORT1 + `/funds/list`, params, { loading: false });
};

//编辑
export const editLoan = (params?: any) => {
  return http.get<ResPage<Report.Funds.ResFunds>>(PORT1 + `/funds/list`, params, { loading: false });
};
