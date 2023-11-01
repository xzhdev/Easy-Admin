<template>
  <el-dialog title="校验结果查看" class="dialog-center" v-model="dialogVisible" :destroy-on-close="true" width="950px">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :is-show-search="false"
      :height="450"
      :request-api="getCheckResult"
      :init-param="initParam"
      :columns="columns"
    >
      <template #tableHeader>
        <el-button type="primary">导出</el-button>
      </template>
    </ProTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = !dialogVisible"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { Report } from "@/api/interface";
import { getCheckResult } from "@/api/modules/report";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";

//初始化请求数据
const initParam = reactive({ id: null });

//控制会话框打开/关闭
const dialogVisible = ref(false);

//接收父组件传过来的参数
interface VerResultProps {
  row: Partial<Report.ResDetailFunds>;
}

const verResultProps = ref<VerResultProps>({
  row: {}
});

const acceptParams = (params: VerResultProps) => {
  verResultProps.value = params;
  initParam.id = params.row.id;
  dialogVisible.value = true;
};

/**
 * 表格配置项
 */
const columns = reactive<ColumnProps<Report.ResCheckResult>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "tableName",
    label: "表名"
  },
  {
    prop: "fieldCode",
    label: "字段编号"
  },
  {
    prop: "foreignCurrencyCode",
    label: "外债编号"
  },
  {
    prop: "errorCode",
    label: "出错编号"
  },
  {
    prop: "errorMessage",
    label: "错误信息"
  },
  {
    prop: "dataDate",
    label: "数据日期"
  }
]);

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scope></style>
