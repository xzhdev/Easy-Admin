<template>
  <div v-if="columns.length" class="card table-search">
    <div class="activeBack" v-if="back" @click="back"></div>
    <el-form ref="formRef" :model="searchParam">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <GridItem v-for="(item, index) in columns" :key="item.prop" v-bind="getResponsive(item)" :index="index">
          <template #default="scope">
            <el-form-item :label-width="flexColumnWidth(index, 'label', scope.cols)">
              <template #label>
                <el-space :size="4">
                  <span>{{ `${item.search?.label ?? item.label}` }}</span>
                  <el-tooltip v-if="item.search?.tooltip" effect="dark" :content="item.search?.tooltip" placement="top">
                    <i :class="'iconfont icon-yiwen'"></i>
                  </el-tooltip>
                </el-space>
                <span>:</span>
              </template>
              <SearchFormItem :column="item" :search-param="searchParam" />
            </el-form-item>
          </template>
        </GridItem>
        <GridItem suffix>
          <div class="operation">
            <el-button type="primary" :icon="Search" @click="search"> 搜索 </el-button>
            <el-button :icon="Delete" @click="reset"> 重置 </el-button>
            <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">
              {{ collapsed ? "展开" : "合并" }}
              <el-icon class="el-icon--right">
                <component :is="collapsed ? ArrowDown : ArrowUp"></component>
              </el-icon>
            </el-button>
          </div>
        </GridItem>
      </Grid>
    </el-form>
  </div>
</template>
<script setup lang="ts" name="SearchForm">
import { computed, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { BreakPoint } from "@/components/Grid/interface";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { getMaxWidth } from "@/utils/columnsWidth";
import SearchFormItem from "./components/SearchFormItem.vue";
import Grid from "@/components/Grid/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";

interface ProTableProps {
  columns?: ColumnProps[]; // 搜索配置列
  searchParam?: { [key: string]: any }; // 搜索参数
  searchCol: number | Record<BreakPoint, number>;
  search: (params: any) => void; // 搜索方法
  reset: (params: any) => void; // 重置方法
  back?: () => void;
}

// 默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  searchParam: () => ({})
});

// 获取响应式设置
const getResponsive = (item: ColumnProps) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  };
};

// 是否默认折叠搜索项
const collapsed = ref(true);

// 获取响应式断点
const gridRef = ref();
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  props.columns.reduce((prev, current) => {
    prev +=
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0);
    if (typeof props.searchCol !== "number") {
      if (prev >= props.searchCol[breakPoint.value]) show = true;
    } else {
      if (prev >= props.searchCol) show = true;
    }
    return prev;
  }, 0);
  return show;
});

//
/**
 * 将搜索columns，转换为每列的数组
 */
const splitArrayByColumns = (arr: ColumnProps[], columnsNum: number) => {
  const result = Array.from({ length: columnsNum }, (): ColumnProps[] => []);
  arr.forEach((item: ColumnProps, index) => {
    const columnIndex = index % columnsNum;
    result[columnIndex].push(item);
  });
  return result;
};

// 自适应label宽度,返回每列最大的宽度
let splitColumns: ColumnProps[][] = [];
// 列数
let splitCols = 0;
// 宽度列表
let widthList: number[] = [];
// 计算次数，测试用
// let testCount = ref(0);
const flexColumnWidth = (index: number, fieldName: string, cols: number) => {
  if (cols === 0) return;
  //当列数发生改变时，才重新分列
  if (splitCols !== cols) {
    //清空存储的列宽
    widthList = [];
    // 同步列数
    splitCols = cols;
    //分列后的二维数组
    splitColumns = splitArrayByColumns(props.columns, cols);
    //进行计算
    return caclWidth();
  } else {
    // widthList 是否已经存储该列宽度
    if (!widthList[index % cols]) {
      //不存在时，进行计算
      return caclWidth();
    } else {
      //存在，直接读取
      return widthList[index % cols];
    }
  }

  function caclWidth() {
    const arr = splitColumns[index % cols].map((x: { [x: string]: any }) => {
      return x[fieldName] + ":";
    });
    // 2.计算每列内容最大的宽度
    let maxLength = getMaxWidth(arr, { fontSize: 14, extraWidth: 16 }); // margin-right: 4px; padding-right：12px
    widthList[index % cols] = maxLength;
    // testCount.value++;
    return widthList[index % cols];
  }
};
</script>
