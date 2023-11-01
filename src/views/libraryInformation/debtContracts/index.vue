<!-- 外债签约 -->
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
        <el-button>显示更多</el-button>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="tsx" name="debtBalances">
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
    prop: "refno",
    label: "REFNO",
    search: {
      el: "input",
      order: 4
    }
  },
  {
    prop: "debtIDs",
    label: "外债编号",
    search: {
      el: "input",
      order: 1
    }
  },
  {
    prop: "debtName",
    label: "债务人编码",
    isShow: false,
    search: {
      el: "input",
      order: 2
    }
  },
  {
    prop: "businessType",
    label: "业务类型",
    search: {
      el: "select",
      order: 6
    }
  },
  {
    prop: "dayOfTheBreath",
    label: "起息日",
    search: {
      el: "date-picker",
      props: { type: "daterange", valueFormat: "YYYY-MM-DD" },
      order: 5
    }
  },
  {
    prop: "signedCurrency",
    label: "签约币种",
    search: {
      el: "select",
      order: 7
    }
  },
  {
    prop: "signingAmount",
    label: "签约金额",
    search: {
      // 自定义 search 显示内容
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <el-input
              vModel_trim={searchParam.minAge}
              oninput='value=value.replace(/[^\d.]/g, "").replace(/^0+(?=\d)/, "").replace(/\.{1,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3").replace(/^\./g, "")'
              onblur={(e: Event) => interchange(e, searchParam)("minAge")}
              placeholder="最小金额（元）"
            />
            <span class="mr10 ml10">-</span>
            <el-input
              vModel_trim={searchParam.maxAge}
              oninput='value=value.replace(/[^\d.]/g, "").replace(/^0+(?=\d)/, "").replace(/\.{1,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3").replace(/^\./g, "")'
              onblur={(e: Event) => interchange(e, searchParam)("maxAge")}
              placeholder="最大金额（元）"
            />
          </div>
        );
      }
    }
  },
  {
    prop: "expiryDate",
    label: "到期日"
  },
  {
    prop: "creditorCode",
    label: "债权人代码",
    search: {
      el: "input",
      order: 3
    }
  },
  {
    prop: "creditChineseName",
    label: "债权人中文名称"
  },
  {
    prop: "bondEnglishName",
    label: "债券人英文名"
  }
]);

//判断是否需要交换
const interchange = (e: Event, searchParam: any) => (filed: string) => {
  if ((e.target as HTMLInputElement).value === "") return;
  searchParam[filed] = (+(e.target as HTMLInputElement).value).toFixed(2) + "";
  let minNum = searchParam.minAge;
  let maxNum = searchParam.maxAge;
  //比较大小 minAge  maxAge
  if (!shouldSwap(minNum, maxNum)) return;
  [searchParam.minAge, searchParam.maxAge] = [maxNum, minNum];
};
const shouldSwap = (minAge: string | number, maxAge: string | number) => {
  return minAge && maxAge && +minAge > +maxAge;
};
</script>
<style scoped></style>
