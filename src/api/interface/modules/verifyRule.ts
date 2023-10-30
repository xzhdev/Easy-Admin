//校验规则模块
export interface ResVerifyRule {
  //规则字段
  ruleField: string;
  //是否生效
  effective: string;
  [property: string]: any;
}
