<!-- 外债变动 -->
<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :request-api="getFundsList"
      :init-param="initParam"
      :columns="columns"
      :table-loading="true"
    >
      <template #tableHeader>
        <el-button type="primary">导出</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="debtChanges">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/modules/auth";
import { usePageStore } from "@/stores/modules/page";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { getFundsList } from "@/api/modules/report";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Report } from "@/api/interface";

const router = useRouter();
//初始化请求数据
const initParam = reactive({});
// 表格配置项
const columns = reactive<ColumnProps<Report.ResFunds>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "businessType",
    label: "业务类型"
  },
  {
    prop: "dataFeedbackStatus",
    label: "数据反馈状态"
  },
  {
    prop: "operationType",
    label: "操纵类型"
  },
  {
    prop: "deleteReason",
    label: "删除原因"
  },
  {
    prop: "bondNumber",
    label: "外债编号",
    search: {
      el: "input"
    }
  },
  {
    prop: "bankServiceNumber",
    label: "银行业务编号"
  },
  {
    prop: "changeId",
    label: "变动编号",
    search: {
      el: "input"
    }
  },
  {
    prop: "debtorCode",
    label: "债务人代码",
    isShow: false,
    search: {
      el: "input"
    }
  },
  {
    prop: "debtorCode",
    label: "债权人代码",
    isShow: false,
    search: {
      el: "input"
    }
  },
  {
    prop: "changeType",
    label: "变动类型"
  },
  {
    prop: "changeDate",
    label: "变动日期"
  },
  {
    prop: "changeCurrency",
    label: "变动币种",
    search: {
      el: "select"
    }
  },
  {
    prop: "changeAmount",
    label: "变动金额"
  },
  {
    prop: "nominalValue",
    label: "公允价值"
  },
  {
    prop: "remark",
    label: "备注"
  },
  {
    prop: "dataDate",
    label: "数据日期"
  },
  {
    prop: "operator",
    label: "操作人"
  },
  {
    prop: "operationTime",
    label: "操作时间"
  }
]);
</script>

<style scoped></style>
