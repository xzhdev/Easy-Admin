<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :request-api="getHistoryDataDetailList"
      :init-param="initParam"
      :columns="columns"
      :table-loading="true"
    >
      <template #tableHeader>
        <el-button type="primary">导出</el-button>
        <el-button>数据打回</el-button>
        <el-button>删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="historyDataDetail">
import { reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getHistoryDataDetailList } from "@/api/modules/historyData";
import ProTable from "@/components/ProTable/index.vue";
import { HistoryData } from "@/api/interface/index";
import { useRouter } from "vue-router";

const router = useRouter();

//初始化请求参数
const initParam = reactive({});

// 表格配置项
const columns = reactive<ColumnProps<HistoryData.ResHistoryDataDetail>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "a",
    label: "采集日期",
    isShow: false,
    search: {
      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  },
  {
    prop: "b",
    label: "操作名",
    isShow: false,
    search: {
      el: "select"
    }
  },
  {
    prop: "c",
    label: "校验状态",
    isShow: false,
    search: {
      el: "select"
    }
  },
  {
    prop: "businesFields",
    label: "业务字段"
  },
  {
    prop: "operator",
    label: "操作人",
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "operatDate",
    label: "操作日期"
  }
]);

const goHistoryDetail = () => {
  const query = {};
  router.push({ name: "historyDataDetail", path: `historyDataManage/historyData/detail`, query });
};
</script>

<style scoped></style>
