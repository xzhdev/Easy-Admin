// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    access_token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}

//上报数据管理模块
export namespace Report {
  /**
   * 机构大额结售汇资金
   */
  export namespace Funds {
    /**
     * 机构大额结售汇资金列表响应
     **/
    export interface ResFunds {
      moduleName: string; //所属模块名称
      formName: string; //表单名称
      pendingAudit: number; //待审核数量
      pendingSubmit: number; //待提交数量
      passAudit: number; //审核通过数量
      [property: string]: any;
    }
    /**
     * 待提交/待审核/审核通过 列表响应
     */
    export interface ResDetailFunds {
      operationName: string; //操作名
      dataRollback?: string; //数据打回
      validationStatus: string; //校验状态
      auditFailureReason: string; //审核不通过原因
      dealerCode: string; //经销商编号
      dealerName: string; //经销商名称
      loanType: string; //贷款类型
      vehicleIdentificationNumber: string; //车辆识别号
      creditContractCode: string; //信贷合同编号
      loanNoteCode: string; //信贷借据号
      detailSubjectCode: string; //明细科目编号
      detailSubjectName: string; //明细科目名称
      currency: string; //币种
      loanDate: string; //放款日期
      dueDate: string; //到期日期
      loanAmount: string; //贷款金额
      loanInterestRate: string; //贷款利率
      thirdPartyDiscountRate: string; //第三方贴息利率
      [property: string]: any;
    }
  }
}

//报文生成模块
export namespace MessageGenerate {
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
}

//报文管理模块
export namespace MessageManage {
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
}

//历史数据
export namespace HistoryData {
  //历史数据模块
  export interface ResHistoryData {
    //所属模块名称
    moduleName: string;
    //表单名称
    formName: string;
    // 历史数据条数
    historyDataNum: number;
  }

  //历史数据详情<历史数据条数>
  export interface ResHistoryDataDetail {
    //操作人
    operator: string;
    //操作日期
    operatDate: string;
  }
}
