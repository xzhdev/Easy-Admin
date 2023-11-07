<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :request-api="getHistoryDataList"
      :init-param="initParam"
      :columns="columns"
      :table-loading="true"
    >
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="historyData">
import { reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getHistoryDataList } from "@/api/modules/historyData";
import { HistoryData } from "@/api/interface";
import { useRouter } from "vue-router";
import { usePageStore } from "@/stores/modules/page";
import ProTable from "@/components/ProTable/index.vue";

const router = useRouter();
const pageStore = usePageStore();

//初始化请求参数
const initParam = reactive({});

// 表格配置项
const columns = reactive<ColumnProps<HistoryData.ResHistoryData>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "moduleName",
    label: "所属模块名称"
  },
  {
    prop: "formName",
    label: "表单名称",
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "historyDataNum",
    label: "历史数据条数",
    render: scope => {
      return (
        <>
          <el-button link type="primary" onClick={() => goHistoryDetail()}>
            {scope.row.historyDataNum}
          </el-button>
        </>
      );
    }
  }
]);

const goHistoryDetail = () => {
  const query = {};
  pageStore.setPageBackName("historyDataDetail", "/historyDataManage/historyData");
  router.push({ name: "historyDataDetail", path: `historyDataManage/historyData/detail`, query });
};
</script>

<style scoped></style>
