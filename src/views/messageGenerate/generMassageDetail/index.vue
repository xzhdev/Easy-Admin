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
    >
      <template #tableHeader>
        <el-button type="primary">生成报文</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="generMassageDetail">
import { reactive } from "vue";
import { getGenerateMessageList } from "@/api/modules/messageGenerate";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Report } from "@/api/interface";

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

//初始化请求数据
const initParam = reactive({});
</script>

<style scoped></style>
