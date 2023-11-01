//跑批

/**
 * 任务列表响应
 **/
export interface ResTaskList {
  //报表名称
  reportName: string;
  //任务名称
  taskName: string;
  //任务说明
  taskDescription: string;
  //任务文件路径
  taskFilePath: string;
  //备注
  remark: string;
  [property: string]: any;
}
/**
 * 日志列表响应
 */
export interface ResLogList {
  //任务名称
  taskName: string;
  //开始时间
  startTime: string;
  //任务状态
  taskStatus: string;
  //结束时间
  endTime: string;
  [property: string]: any;
}
