/**
 * 遍历列的所有内容，获取最宽一列的宽度
 * @param arr
 */
const getMaxLength = (arr: string[], context: CanvasRenderingContext2D) => {
  return arr.reduce((acc, item) => {
    if (item) {
      const calcLen = getTextWidth(item, context);
      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};

/**
 * 使用 Canvas 绘制文本并测量宽度
 * @param str
 * @param context
 */
const getTextWidth = (str: string, context: CanvasRenderingContext2D) => {
  context.font = "16px Arial"; // 设置字体样式
  const width = context.measureText(str).width;
  return width;
};

/**
 * el-table-column 自适应列宽
 * @param processTableData: 表格数据
 * @param label: 表名
 * @param prop: 字段
 */
const flexColumnWidth = (processTableData: any[], label: string, prop: string) => {
  if (!processTableData || processTableData.length === 0) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  // 1.获取该列的所有数据
  const arr = processTableData.map((x: { [x: string]: any }) => {
    return x[prop];
  });
  arr.push(label); // 把每列的表头也加进去算

  // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
  let maxLength = getMaxLength(arr, context);

  // 3.释放 Canvas 对象
  canvas.remove();

  return maxLength > 200 ? 200 + 25 + "px" : maxLength + 25 + "px";
};

export { flexColumnWidth };
