import { ElMessage } from "element-plus";
type SelectionType = "single" | undefined | null;

/**
 * @param selectedList 勾选的数据 默认 []
 * @param selectionType 限制的类型
 * @param callBack 通过验证后执行的自定义回调函数
 */
export function useTableSelectResTips(selectedList: any[] = [], selectionType?: SelectionType, callBack?: Function) {
  if (selectedList.length === 0) return ElMessage.warning("请选择数据！");
  if (selectedList.length > 1 && selectionType === "single") return ElMessage.warning("请选择至多一条数数据");
  callBack && callBack();
}
