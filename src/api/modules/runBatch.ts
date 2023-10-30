import { RunBatch } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api/index";

/**
 * @name 跑批任务列表
 */
export const getTaskRunBatch = (params?: any) => {
  return http.get<ResPage<RunBatch.ResTaskList>>(PORT1 + `/runbatch/list`, params, { loading: false });
};
/**
 * @name 跑批日志列表
 */
export const getLogRunBatch = (params?: any) => {
  return http.get<ResPage<RunBatch.ResLogList>>(PORT1 + `/runbatch/log`, params, { loading: false });
};
/**
 * @name 新增跑批任务
 */
export const addTaskRunBatch = (params?: any) => {
  return http.get(PORT1 + `/runbatch/add`, params);
};

/**
 * @name 编辑跑批任务
 */
export const editTaskRunBatch = (params?: any) => {
  return http.get(PORT1 + `/runbatch/edit`, params);
};
