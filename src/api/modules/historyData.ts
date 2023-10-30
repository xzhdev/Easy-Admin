import { HistoryData } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 历史数据模块
 */
// 获取模块列表
export const getHistoryDataList = (params?: any) => {
  return http.get<ResPage<HistoryData.ResHistoryData>>(PORT1 + `/historyData/list`, params, { loading: false });
};

//详情列表
export const getHistoryDataDetailList = (params?: any) => {
  return http.get<ResPage<HistoryData.ResHistoryDataDetail>>(PORT1 + `/historyData/detail/list`, params, { loading: false });
};
