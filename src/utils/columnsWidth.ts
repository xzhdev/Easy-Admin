/**
 * @typedef {Object} Options
 * @property {number} [fontSize=16] - 用于计算的字体大小。默认为16。
 * @property {number} [extraWidth=0] - 添加到计算得出的最大宽度的额外宽度。默认为0。
 */
interface Options {
  fontSize?: number;
  extraWidth?: number;
}

/**
 * 计算给定数组中元素的最大宽度，考虑字体大小和任何额外宽度。
 *
 * @param {string[]} arr - 用于计算最大宽度的字符串数组。
 * @param {Options} options  - 包含字体大小和额外宽度的对象。
 * @param {number} options.fontSize - 用于计算的字体大小。默认为16。
 * @param {number} options.extraWidth - 添加到计算得出的最大宽度的额外宽度。默认为0。
 * @returns {number} - 数组中元素的最大宽度。
 */
const getMaxWidth = (arr: string[], options: Options) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  const max = arr.reduce((acc, item) => {
    if (item) {
      const calcLen = getTextWidth(item, context, options);
      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
  // 释放 Canvas 对象
  canvas.remove();
  return max;
};

/**
 * 计算给定文本字符串的宽度（以像素为单位）。
 *
 * @param {string} str - 要计算宽度的文本字符串。
 * @param {CanvasRenderingContext2D} context - 用于测量文本的画布渲染上下文。
 * @param {number} [fontSize=16] - 测量文本时要使用的字体大小。默认为16。
 * @param {number} [extraWidth=0] - 要添加到计算宽度的额外宽度。默认为0。
 * @return {number} 文本字符串的宽度（以像素为单位）。
 */
const fontFamily = window.getComputedStyle(document.body).getPropertyValue("font-family");
const getTextWidth = (str: string, context: CanvasRenderingContext2D, { fontSize = 16, extraWidth = 0 }: Options) => {
  context.font = `${fontSize}px ${fontFamily}`; // 设置字体样式 15px是表头的字体大小
  const width = context.measureText(str).width;
  return width + extraWidth;
};

export { getMaxWidth };
