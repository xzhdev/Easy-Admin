//报文下载模块
export interface ResMessageDownload {
  //上传状态
  uploadStatus: string;
  //所属模块名
  moduleName: string;
  //业务表名
  formName: string;
  //报文名称
  messageName: string;
  //创建报文中文名
  chineseName: string;
  //创建日期
  createTime: string;
  //报文期数
  period: string;
  [property: string]: any;
}

//反馈报文解析模块
export interface ResMessageParse {
  //解析日期
  parseDate: string;
  //反馈日期
  feedbackDate: string;
  //模块名称
  moduleName: string;
  //报文名称
  messageName: string;
  //数据状态
  dataStatus: string;
  //错误文件名称
  errorFileName: string;
  //总记录数
  totalNum: number;
  //成功的记录数
  successNum: number;
  //失败的记录数
  failNum: number;
  [property: string]: any;
}

//错误详情
export interface ResMessageParseDetail {
  //业务主键
  messageId: string;
  //错误文件名称
  errorFileName: string;
  //模块名称
  moduleName: string;
  //出错字段英文标识
  errorFieldEnglishName: string;
  //出错字段中文标识
  errorFieldChineseName: string;
  //出错原因
  errorReason: string;
  [property: string]: any;
}
