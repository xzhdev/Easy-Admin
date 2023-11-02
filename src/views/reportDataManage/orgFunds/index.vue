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
        <el-button type="primary">一键校验</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="orgFunds">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/modules/auth";
import { usePageStore } from "@/stores/modules/page";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { getFundsList } from "@/api/modules/report";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Report } from "@/api/interface";

const router = useRouter();

// 表格配置项
const columns = reactive<ColumnProps<Report.ResFunds>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "moduleName",
    label: "所属模块名称",
    minWidth: 220
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
    prop: "pendingSubmit",
    label: "待提交",
    render: scope => {
      return (
        <>
          <el-button link type="primary" onClick={() => goFundsDetail("123", "0", "待提交")}>
            {scope.row.pendingAudit}
          </el-button>
        </>
      );
    }
  },
  {
    prop: "pendingAudit",
    label: "待审核",
    render: scope => {
      return (
        <>
          <el-button link type="primary" onClick={() => goFundsDetail("234", "1", "待审核")}>
            {scope.row.pendingAudit}
          </el-button>
        </>
      );
    }
  },
  {
    prop: "passAudit",
    label: "审核通过",
    render: scope => {
      return (
        <>
          <el-button link class="mx-1 mouse-pointer" type="primary" onClick={() => goFundsDetail("456", "2", "审核通过")}>
            {scope.row.passAudit}
          </el-button>
        </>
      );
    }
  },
  {
    prop: "dataDate",
    label: "数据日期",
    isShow: false,
    search: {
      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  }
]);

//初始化请求数据
const initParam = reactive({});

//动态更改详情tag标题
const authStore = useAuthStore();
const pageStore = usePageStore();

onBeforeRouteLeave(to => {
  //处理跳转待提交/待审核/审核通过页面
  if (to.name === "fundsDetail") {
    to.meta.title = pageStore.getPageTabTitleName(to.name);
    // console.log(to.meta.title);
    // authStore.updateMetaTitle(to.path, to.meta.title as string);
  }
});

//前往待提交/待审核/审核通过页面
const goFundsDetail = (id: string, state: string, title: string) => {
  const query = { id, state };
  pageStore.setPageTabTitleName("fundsDetail", title);
  router.push({ name: "fundsDetail", path: `/reportDataManage/funds/detail`, query });
};
</script>

<style lang="scss" scoped></style>
