<!-- 报文下载 -->
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
        <el-button type="primary" @click="downloadMessage">下载报文</el-button>
        <el-button>数据打回</el-button>
        <el-button>上传报文</el-button>
      </template>
    </ProTable>
    <SelectDateDownload title="下载报文" :options="dateDownloadOptions" ref="selectDateDownload"></SelectDateDownload>
  </div>
</template>

<script setup lang="ts" name="messageDownload">
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { MessageManage } from "@/api/interface";
import { getMessageDownloadList, getMessageDownload } from "@/api/modules/messageManage";
import ProTable from "@/components/ProTable/index.vue";
import SelectDateDownload from "@/components/SelectDateDownload/index.vue";

//初始化请求数据
const initParam = reactive({});
// 表格配置项
const columns = reactive<ColumnProps<MessageManage.ResMessageDownload>[]>([
  { type: "index", label: "序号", width: 80, fixed: "left" },
  {
    prop: "uploadStatus",
    label: "上传状态",
    search: {
      order: 3,
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "moduleName",
    label: "所属模块名"
  },
  {
    prop: "formName",
    label: "业务表名"
  },
  {
    prop: "messageName",
    label: "报文名称"
  },
  {
    prop: "chineseName",
    label: "创建报文中文名"
  },
  {
    prop: "createTime",
    label: "创建日期",
    search: {
      order: 1,
      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  },
  {
    prop: "period",
    label: "报文期数",
    search: {
      order: 2,

      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  }
]);
// 选择日期下载配置项
const dateDownloadOptions = reactive({
  formItem: {
    label: "数据日期",
    prop: "date"
  },
  dateAttrs: {
    type: "date",
    valueFormat: "YYYY-MM-DD",
    format: "YYYY-MM-DD",
    placeholder: "请选择数据日期"
  }
});
//下载报文
const selectDateDownload = ref<InstanceType<typeof SelectDateDownload>>();
const downloadMessage = () => {
  const params = {
    api: getMessageDownload
  };
  selectDateDownload.value?.acceptParams(params);
};
</script>

<style scoped></style>
