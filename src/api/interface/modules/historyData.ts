//历史数据模块

export interface ResHistoryData {
  //所属模块名称
  moduleName: string;
  //表单名称
  formName: string;
  // 历史数据条数
  historyDataNum: number;
  [property: string]: any;
}

//历史数据详情<历史数据条数>
export interface ResHistoryDataDetail {
  //操作人
  operator: string;
  //操作日期
  operatDate: string;
  [property: string]: any;
}
