<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :request-api="getMessageDownloadList"
      :init-param="initParam"
      :columns="columns"
      :table-loading="true"
    >
      <template #tableHeader>
        <el-button type="primary">下载报文</el-button>
        <el-button>数据打回</el-button>
        <el-button>上传报文</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="messageDownload">
import { reactive } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { MessageManage } from "@/api/interface";
import { getMessageDownloadList } from "@/api/modules/messageManage";

//初始化请求数据
const initParam = reactive({});
// 表格配置项
const columns = reactive<ColumnProps<MessageManage.ResMessageDownload>[]>([
  { type: "index", label: "序号", width: 80, fixed: "left" },
  {
    prop: "uploadStatus",
    label: "上传状态",
    minWidth: 150,
    search: {
      order: 3,
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "moduleName",
    label: "所属模块名",
    minWidth: 150
  },
  {
    prop: "formName",
    label: "业务表名",
    minWidth: 150
  },
  {
    prop: "messageName",
    label: "报文名称",
    minWidth: 200
  },
  {
    prop: "chineseName",
    label: "创建报文中文名",
    minWidth: 200
  },
  {
    prop: "createTime",
    label: "创建日期",
    minWidth: 200,
    search: {
      order: 1,
      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  },
  {
    prop: "period",
    label: "报文期数",
    minWidth: 110,
    search: {
      order: 2,

      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  }
]);
</script>

<style scoped></style>
