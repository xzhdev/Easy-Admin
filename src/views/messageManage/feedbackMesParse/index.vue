<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :request-api="getFeedbackMesParseList"
      :init-param="initParam"
      :columns="columns"
      :table-loading="true"
    >
      <template #tableHeader>
        <el-button type="primary">获取反馈文件</el-button>
      </template>
    </ProTable>
    <ErrorDetail ref="errorDetail"></ErrorDetail>
  </div>
</template>

<script setup lang="tsx" name="feedbackMesParse">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { MessageManage } from "@/api/interface";
import { getFeedbackMesParseList } from "@/api/modules/messageManage";
import ErrorDetail from "../components/errorDetail.vue";

//初始化请求数据
const initParam = reactive({});
// 表格配置项
const columns = reactive<ColumnProps<MessageManage.ResMessageParse>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "parseDate",
    label: "解析日期",
    minWidth: 120,
    search: {
      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  },
  {
    prop: "feedbackDate",
    label: "反馈日期",
    minWidth: 120
  },
  {
    prop: "moduleName",
    label: "模块名称",
    minWidth: 200
  },
  {
    prop: "messageName",
    label: "报文名称",
    minWidth: 200
  },
  {
    prop: "dataStatus",
    label: "数据状态",
    minWidth: 120
  },
  {
    prop: "errorFileName",
    label: "错误文件名称",
    minWidth: 200
  },
  {
    prop: "totalNum",
    label: "总记录数",
    minWidth: 120
  },
  {
    prop: "successNum",
    label: "成功的记录数",
    minWidth: 120
  },
  {
    prop: "failNum",
    label: "失败的记录数",
    minWidth: 120
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 200,
    render: scope => {
      return (
        <>
          <el-button link type="primary" onClick={() => openErrorDetail(scope.row)}>
            查看失败详情
          </el-button>
        </>
      );
    }
  }
]);

const errorDetail = ref<InstanceType<typeof ErrorDetail> | null>(null);
const proTable = ref<ProTableInstance>();

//查看错误详情
const openErrorDetail = (row: MessageManage.ResMessageParse) => {
  const params = {
    row: { ...row },
    getTableList: proTable.value?.getTableList
  };
  errorDetail.value?.acceptParams(params);
};
</script>

<style scoped></style>
