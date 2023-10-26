import { ref } from "vue";
// 判断文本是否溢出
export const useIsTextOverFlowed = () => {
  const showTooltipMap = ref(new Map());

  const isTextOverflowed = (e: MouseEvent, key: string) => {
    const target = e.target as HTMLElement;
    const target_weight = target?.scrollHeight;
    const target_content_weight = target.clientHeight;
    showTooltipMap.value.set(key, target_weight > target_content_weight);
  };
  const getShowTooltip = (key: string) => {
    return !showTooltipMap.value.get(key);
  };
  return {
    getShowTooltip,
    isTextOverflowed
  };
};
