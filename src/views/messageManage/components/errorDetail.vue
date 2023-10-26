<template>
  <el-dialog v-model="dialogVisible" :title="errorDetailProps.title" width="1000px">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :request-api="getFeedbackMesParseErrorList"
      :init-param="initParam"
      :columns="columns"
      :table-loading="true"
      height="400px"
    >
    </ProTable>
  </el-dialog>
</template>

<script setup lang="tsx">
import ProTable from "@/components/ProTable/index.vue";
import { MessageManage } from "@/api/interface";
import { getFeedbackMesParseErrorList } from "@/api/modules/messageManage";
import { ref, reactive } from "vue";

interface ErrorDetailProps {
  getTableList?: () => void; //刷新父组件数据接口
  title?: string; // 标题
  dialogVisible?: boolean; // 是否显示
  row: Partial<MessageManage.ResMessageParse>;
}

// 接收父组件参数
const errorDetailProps = ref<Partial<ErrorDetailProps>>({
  title: "错误详情",
  row: {}
});

const dialogVisible = ref(false);

const acceptParams = (params: ErrorDetailProps) => {
  errorDetailProps.value = { ...errorDetailProps.value, ...params };
  dialogVisible.value = true;
};

//初始化请求数据
const initParam = reactive({});
// 表格配置项
const columns = reactive<ColumnProps<MessageManage.ResMessageParseDetail>[]>([
  { type: "index", label: "序号", width: 80, fixed: "left" },
  {
    prop: "messageId",
    label: "业务主键",
    minWidth: 120
  },
  {
    prop: "errorFileName",
    label: "错误文件名称",
    minWidth: 150
  },
  {
    prop: "moduleName",
    label: "模块名称",
    minWidth: 200
  },
  {
    prop: "errorFieldEnglishName",
    label: "出错字段英文标识",
    minWidth: 250
  },
  {
    prop: "errorFieldChineseName",
    label: "出错字段中文标识",
    minWidth: 250
  },
  {
    prop: "errorReason",
    label: "出错原因",
    minWidth: 200
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 150,
    render: scope => {
      return (
        <>
          <el-button link type="primary">
            处理打回
          </el-button>
        </>
      );
    }
  }
]);

defineExpose({
  acceptParams
});
</script>

<style scoped></style>
