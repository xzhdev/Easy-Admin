import { ref } from "vue";

export const useIsTextOverFlowed = () => {
  const showTooltipMap = ref(new Map());

  const isTextOverflowed = (e: MouseEvent, key: string) => {
    const target = e.target as HTMLElement;
    const target_weight = target?.scrollHeight;
    const target_content_weight = target.clientHeight;
    showTooltipMap.value.set(key, target_weight > target_content_weight);
    console.log(target_weight, target_content_weight, showTooltipMap);
  };
  const getShowTooltip = (key: string) => {
    console.log(!showTooltipMap.value.get(key), showTooltipMap);

    return !showTooltipMap.value.get(key);
  };
  return {
    getShowTooltip,
    isTextOverflowed
  };
};
