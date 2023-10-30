import { MessageGenerate } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api/index";

/**
 * @name 报文生成分页列表
 */
// 获取模块列表
export const getMessageGenerateList = (params?: any) => {
  return http.get<ResPage<MessageGenerate.ResMessage>>(PORT1 + `/messageGenerate/list`, params, { loading: false });
};

/**
 * @name 生成报文分页列表
 */
// 获取模块列表
export const getGenerateMessageList = (params?: any) => {
  return http.get<ResPage<MessageGenerate.ResDetailMessage>>(PORT1 + `/messageGenerateDetail/list`, params, { loading: false });
};
