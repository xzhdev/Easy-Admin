<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :request-api="getGenerateMessageList"
      :init-param="initParam"
      :columns="columns"
      :table-loading="true"
      :back-path="backPath"
    >
      <template #tableHeader>
        <el-button type="primary">生成报文</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="generMassageDetail">
import { ComponentPublicInstance, computed, reactive, ref } from "vue";
import { getGenerateMessageList } from "@/api/modules/messageGenerate";
import { ColumnProps } from "@/components/ProTable/interface";
import { Report } from "@/api/interface";
import { usePageStore } from "@/stores/modules/page";
import ProTable from "@/components/ProTable/index.vue";

//获取跳转来自哪个页面
const pageStore = usePageStore();
const backPath = computed(() => pageStore.getPageBackName("generMassageDetail"));
const backPathList = ["/messageGenerate/generateMessage"]; //需要返回的页面的path，考虑到可能会有其他页面跳转到该页面的情况，所以需要一个数组存储需要返回的path
interface IInstance extends ComponentPublicInstance {
  backPathList: string[];
  pageStore: any;
}
defineOptions({
  beforeRouteEnter(_to, _from, next) {
    next(vm => {
      const instance = vm as IInstance;
      if (instance.backPathList.includes(_from.path)) {
        instance.pageStore.setPageBackName("generMassageDetail", _from.fullPath);
      }
    });
  }
});

//初始化请求数据
const initParam = reactive({});
// 表格配置项
const columns = reactive<ColumnProps<Report.ResFunds>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "dataDate",
    label: "数据日期",
    isShow: false,
    search: {
      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  },
  {
    prop: "operationName",
    label: "操作名",
    isShow: false,
    search: {
      el: "select"
    }
  },
  {
    prop: "validationStatus",
    label: "校验状态",
    isShow: false,
    search: {
      el: "select"
    }
  },
  {
    prop: "operationType",
    label: "操作类型"
  }
]);

defineExpose({ backPathList, pageStore });
</script>

<style scoped></style>
