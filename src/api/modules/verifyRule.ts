import { VerifyRule } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getVerifyRuleList = (params?: any) => {
  return http.get<ResPage<VerifyRule.ResVerifyRule>>(PORT1 + `/verifyRule/list`, params, { loading: false });
};
