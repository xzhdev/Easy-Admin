import { MessageManage } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api/index";

/**
 * @name 报文下载分页列表
 */
export const getMessageDownloadList = (params?: any) => {
  return http.get<ResPage<MessageManage.ResMessageDownload>>(PORT1 + `/messageDownload/list`, params, { loading: false });
};
/**
 * @name 反馈报文解析分页列表
 */
export const getFeedbackMesParseList = (params?: any) => {
  return http.get<ResPage<MessageManage.ResMessageParse>>(PORT1 + `/feedbackMesParse/list`, params, { loading: false });
};
/**
 * @name 反馈报文解析_错误详情
 */
export const getFeedbackMesParseErrorList = (params?: any) => {
  return http.get<ResPage<MessageManage.ResMessageParseDetail>>(PORT1 + `/feedbackMesParse/errorDetail/list`, params, {
    loading: false
  });
};
/**
 * @name 报文下载
 */
export const getMessageDownload = (params?: any) => {
  return http.download(PORT1 + `/messageDownload/add`, params);
};
/**
 * @name 获取反馈文件
 */
export const getFeedbackFile = (params?: any) => {
  return http.download(PORT1 + `/feedbackMesParse/download`, params);
};
