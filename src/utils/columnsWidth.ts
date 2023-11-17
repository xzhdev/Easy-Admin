/**
 * 计算字符串数组中项的最大长度。
 *
 * @param {string[]} arr - 要计算最大长度的字符串数组。
 * @param {CanvasRenderingContext2D} context - 用于测量文本宽度的渲染上下文。
 * @return {number} 数组中项的最大长度。
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
 * 根据画布上下文中使用的字体样式和大小计算给定文本字符串的宽度。
 *
 * @param {string} str - 要计算宽度的文本字符串。
 * @param {CanvasRenderingContext2D} context - 画布渲染上下文对象。
 * @return {number} 文本字符串的宽度（以像素为单位）。
 */
const fontFamily = window.getComputedStyle(document.body).getPropertyValue("font-family");
const getTextWidth = (str: string, context: CanvasRenderingContext2D) => {
  context.font = `15px ${fontFamily}`; // 设置字体样式 15px是表头的字体大小
  const width = context.measureText(str).width;
  return width;
};

/**
 * 计算流程表格中弹性列的宽度。
 *
 * @param {any[]} processTableData - 表格的数据。
 * @param {string} label - 列的标签。
 * @param {string} prop - 列的属性。
 * @return {string} 弹性列的计算宽度。
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
  // 4. 计算最终宽度：200px 自定义宽度 + 12px + 12px 左右padding + 2px border，因为eltable取整数，并不会把maxLength的小数加上，所有我们加个1px，保证eltable 去小数后不会影响我们的宽度
  return maxLength > 200 ? 200 + 24 + 2 + 1 + "px" : maxLength + 24 + 2 + 1 + "px";
};

export { flexColumnWidth };
