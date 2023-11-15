/**
 * 遍历列的所有内容，获取最宽一列的宽度
 * @param arr
 */
const getMaxLength = (arr: string[]) => {
  return arr.reduce((acc, item) => {
    if (item) {
      const calcLen = getTextWidth(item);
      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};
/**
 * 使用span标签包裹内容，然后计算span的宽度 width： px
 * @param valArr
 */
let fragment = document.createDocumentFragment();
const getTextWidth = (str: string) => {
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.className = "columnsWidthSpan";
  span.style.position = "absolute";
  span.style.whiteSpace = "nowrap";
  span.innerText = str;
  fragment.appendChild(span);
  // 将文档片段附加到 body 中
  document.body.appendChild(fragment);
  const width = span.getBoundingClientRect().width;
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
  // 1.获取该列的所有数据
  const arr = processTableData.map((x: { [x: string]: any }) => {
    // console.log(x[prop]);
    return x[prop];
  });
  arr.push(label); // 把每列的表头也加进去算
  // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
  let maxLength = getMaxLength(arr);
  // 3.统一移除span标签
  document.querySelectorAll(".columnsWidthSpan").forEach(function (el) {
    el.parentNode?.removeChild(el);
  });
  return maxLength > 200 ? 200 + 25 + "px" : maxLength + 25 + "px";
};

export { flexColumnWidth };
