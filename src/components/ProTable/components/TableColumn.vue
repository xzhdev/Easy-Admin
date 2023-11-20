<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx" name="TableColumn">
import { inject, ref, useSlots } from "vue";
import { ColumnProps, RenderScope, HeaderRenderScope } from "@/components/ProTable/interface";
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp } from "@/utils";
import { getMaxWidth } from "@/utils/columnsWidth";
const tableData = inject("tableData", ref([]));

defineProps<{ column: ColumnProps }>();

const slots = useSlots();

const enumMap = inject("enumMap", ref(new Map()));

// 渲染表格数据
const renderCellData = (item: ColumnProps, scope: RenderScope<any>) => {
  return enumMap.value.get(item.prop) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop!));
};

// 获取 tag 类型
const getTagType = (item: ColumnProps, scope: RenderScope<any>) => {
  return filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop), item.fieldNames, "tag");
};

// el-table-column 自适应列宽
const flexColumnWidth = (processTableData: any[], label: string, prop: string) => {
  if (!processTableData || processTableData.length === 0) return;
  // 1.获取该列的所有数据
  const arr = processTableData.map((x: { [x: string]: any }) => {
    return x[prop];
  });
  arr.push(label); // 把每列的表头也加进去算
  // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
  let maxLength = getMaxWidth(arr, { fontSize: 15, extraWidth: 27 });
  // 3. 计算最终宽度：200px 自定义宽度 + 12px + 12px 左右padding + 2px border，因为eltable取整数，并不会把maxLength的小数加上，所有我们加个1px，保证eltable 去小数后不会影响我们的宽度
  return maxLength > 227 ? 227 + "px" : maxLength + "px";
};

const RenderTableColumn = (item: ColumnProps) => {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? "center"}
          min-width={item.minWidth ?? flexColumnWidth(tableData.value, item.label as string, item.prop as string)}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: RenderScope<any>) => {
              if (item._children) return item._children.map(child => RenderTableColumn(child));
              if (item.render) return item.render(scope);
              if (slots[handleProp(item.prop!)]) return slots[handleProp(item.prop!)]!(scope);
              if (item.tag) return <el-tag type={getTagType(item, scope)}>{renderCellData(item, scope)}</el-tag>;
              return renderCellData(item, scope);
            },
            header: (scope: HeaderRenderScope<any>) => {
              if (item.headerRender) return item.headerRender(scope);
              if (slots[`${handleProp(item.prop!)}Header`]) return slots[`${handleProp(item.prop!)}Header`]!(scope);
              return item.label;
            }
          }}
        </el-table-column>
      )}
    </>
  );
};
</script>
