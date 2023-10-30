//报文生成模块

export interface ResMessage {
  formName: string;
  moduleName: string;
  notGenerateNumber: number;
  [property: string]: any;
}
export interface ResDetailMessage {
  operationType: string;
  [property: string]: any;
}
