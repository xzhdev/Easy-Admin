import { Commen } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 业务模块
 */
// 获取模块列表
export const getBusinessList = (params?: any) => {
  return http.get<ResPage<Commen.Business.ResBusiness>>(PORT1 + `/business/list`, params, { loading: false });
};
