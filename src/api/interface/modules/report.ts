//上报数据

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

/**
 * 待提交 - 校验结果查看
 */
export interface ResCheckResult {
  //表名
  tableName: string;
  //字段编号
  fieldCode: string;
  //外债编号
  foreignCurrencyCode: string;
  //出错编号
  errorCode: string;
  //错误信息
  errorMessage: string;
  //数据日期
  dataDate: string;
  [property: string]: any;
}
