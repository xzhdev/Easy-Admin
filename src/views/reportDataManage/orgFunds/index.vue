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
        <el-button type="primary" @click="handleVerProcess">一键校验</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="orgFunds">
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/modules/auth";
import { usePageStore } from "@/stores/modules/page";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import { getFundsList } from "@/api/modules/report";
import { ColumnProps } from "@/components/ProTable/interface";
import { Report } from "@/api/interface";
import VerifyProcess from "@/components/VerifyProcess";
import ProTable from "@/components/ProTable/index.vue";

const router = useRouter();
const route = useRoute();

// 表格配置项
const columns = reactive<ColumnProps<Report.ResFunds>[]>([
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

onBeforeRouteLeave((to, form) => {
  console.log("onBeforeRouteLeave", to, form);
  //处理跳转待提交/待审核/审核通过页面
  if (to.name === "fundsDetail") {
    to.meta.title = pageStore.getPageTabTitleName(to.name);
    authStore.updateMetaTitle(to.path, to.meta.title as string); //更新当前路由的meta title,让面包屑跟随tab title的更改
  }
});

//前往待提交/待审核/审核通过页面
const goFundsDetail = (id: string, state: string, title: string) => {
  const query = { id, state };
  pageStore.setPageTabTitleName("fundsDetail", title);
  pageStore.setPageBackName("fundsDetail", "/reportDataManage/orgFunds");
  router.push({ name: "fundsDetail", path: `/reportDataManage/funds/detail`, query });
};

// 校验
const handleVerProcess = async () => {
  //模拟请求测试
  function countCallsAndSum(callCount: number, targetSum: number) {
    let currentSum = 0;
    let calls = 0;

    function calculateIncrement() {
      const remainingCalls = callCount - calls;
      const remainingSum = targetSum - currentSum;

      // 计算每次调用应该累加的值
      return remainingCalls > 0 ? Math.ceil(remainingSum / remainingCalls) : 0;
    }

    function callFunction() {
      if (calls < callCount && currentSum < targetSum) {
        const increment = calculateIncrement();
        currentSum += increment;
        calls += 1;
        return currentSum;
      } else {
        return null; // 超过指定调用次数或累计最大值，返回null表示停止累加
      }
    }

    return callFunction;
  }
  const countFunction = countCallsAndSum(18, 100);
  const requestProcess = () => {
    const result = countFunction();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (result && result <= 30) {
          console.log("成功请求-进度", result);
          resolve(result);
        } else if (result && result > 30 && result < 50) {
          reject(result);
          console.log("失败请求-进度", result);
        } else {
          console.log("成功请求-进度", result);
          resolve(result);
        }
      }, 500);
    });
  };
  //调用校验
  VerifyProcess(requestProcess);
};
</script>

<style lang="scss" scoped></style>
