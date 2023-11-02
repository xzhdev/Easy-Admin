//定义语言切换,前端转后端切换
const languages = new Map([
  ["en", "en_US"],
  ["zh", "zh_CN"]
]);

export const synLanguageConfig: any = (key: string) => {
  return languages.get(key) ? languages.get(key) : "zh_CN";
};
