<template>
  <div class="table-box">
    <!-- <el-button plain style="width: 50px; margin-bottom: 10px" :icon="Back" size="small">返回</el-button> -->
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
        <!-- 待提交 -->
        <div v-if="type === '0'">
          <el-button @click="openLoanDialog('新增')">新增</el-button>
          <el-button>校验</el-button>
          <el-button>校验结果查看</el-button>
          <el-button>提交</el-button>
          <el-button>申请删除</el-button>
          <el-button>强制提交</el-button>
          <el-button>导入</el-button>
          <el-button>导出</el-button>
        </div>
        <!-- 待审核 -->
        <div v-if="type === '1'">
          <el-button>导出</el-button>
          <el-button>申请删除</el-button>
          <el-button>申请修改</el-button>
          <el-button>审核通过</el-button>
          <el-button>审核不通过</el-button>
          <el-button>同意申请</el-button>
          <el-button>拒绝申请</el-button>
        </div>
        <!-- 审核通过 -->
        <div v-if="type === '2'">
          <el-button>导出</el-button>
          <el-button>申请删除</el-button>
          <el-button>申请修改</el-button>
        </div>
      </template>
    </ProTable>
    <LoanDialog v-if="loanVisible" v-model:loanVisible="loanVisible" ref="loanDialog"></LoanDialog>
  </div>
</template>

<script setup lang="tsx" name="fundsDetail">
import { nextTick, onActivated, reactive, ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useTabsStore } from "@/stores/modules/tabs";
import { getFundsList } from "@/api/modules/funds";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Report } from "@/api/interface";
import LoanDialog from "./components/LoanDialog.vue";
import { addLoan, editLoan } from "@/api/modules/funds";
// import { Back } from "@element-plus/icons-vue";

const tabStore = useTabsStore();
const route = useRoute();

onBeforeRouteUpdate((to, from) => {
  console.log(to, from);

  if (to.query.id !== from.query.id) {
    console.log("lanjie");
  }
});
//接收路由参数
const type = ref<string>("0");

let types = {
  "0": "待提交",
  "1": "待审核",
  "2": "审核通过"
};

onActivated(() => {
  //设置tabs title
  let title;
  console.log(route.meta.title);
  if (route.query.state && typeof route.query.state === "string") {
    type.value = route.query.state;
    title = types[route.query.state as keyof typeof types];
    // route.meta.title = title;
    // tabStore.setTabsTitle(title);
  }
});

// 表格配置项
const columns = reactive<ColumnProps<Report.Funds.ResFunds>[]>([
  { type: "index", label: "序号", width: 80, fixed: "left" },
  {
    prop: "collectionDate",
    label: "采集日期",
    isShow: false,
    search: {
      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  },
  {
    prop: "operationName",
    label: "操作名",
    fixed: "left",
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "dataRollback",
    label: "数据打回",
    fixed: "left",
    width: 110
  },
  {
    prop: "validationStatus",
    label: "校验状态",
    fixed: "left",
    width: 110,
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "auditFailureReason",
    label: "审核不通过原因",
    fixed: "left",
    width: 180,
    render: scope => {
      return (
        <>
          <el-text class="mx-1 mouse-pointer" type="primary" onClick={() => goPendingAudit()}>
            {scope.row.pendingAudit}
          </el-text>
        </>
      );
    }
  },
  {
    prop: "dealerCode",
    label: "经销商编号",
    width: 110,
    search: {
      el: "input",
      props: { placeholder: "输入搜索关键词" }
    }
  },
  {
    prop: "dealerName",
    label: "经销商名称",
    width: 110,
    search: {
      el: "input",
      props: { placeholder: "输入搜索关键词" }
    }
  },
  {
    prop: "loanType",
    label: "贷款类型",
    width: 110
  },
  {
    prop: "vehicleIdentificationNumber",
    label: "车辆识别号",
    width: 110
  },
  {
    prop: "creditContractCode",
    label: "信贷合同号",
    width: 110,

    search: {
      el: "input",
      props: { placeholder: "输入搜索关键词" }
    }
  },
  {
    prop: "loanNoteCode",
    label: "信贷借据号",
    width: 110
  },
  {
    prop: "detailSubjectCode",
    label: "明细科目编号",
    width: 150
  },
  {
    prop: "detailSubjectName",
    label: "明细科目名称",
    width: 150
  },
  {
    prop: "currency",
    label: "币种",
    width: 110
  },
  {
    prop: "loanDate",
    label: "放款日期",
    width: 110
  },
  {
    prop: "dueDate",
    label: "到期日期",
    width: 110
  },
  {
    prop: "loanAmount",
    label: "贷款金额",
    width: 110
  },
  {
    prop: "loanInterestRate",
    label: "贷款利率",
    width: 110
  },
  {
    prop: "thirdPartyDiscountRate",
    label: "第三方贴息利率",
    width: 150
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 250,
    render: () => {
      return (
        <>
          <el-button type="primary" link>
            编辑
          </el-button>
          <el-button type="primary" link>
            详细信息
          </el-button>
          <el-button type="primary" link>
            差异比较
          </el-button>
        </>
      );
    }
  }
]);

//初始化请求数据
const initParam = reactive({});

// // 前往待提交页面
// const goPendingSubmit = () => {
//   console.log("待提交");
// };
// 前往待审核页面
const goPendingAudit = () => {
  console.log("待提交");
};
// // 前往审核通过页面
// const goPassAudit = () => {
//   console.log("待提交");
// };

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 打开 loanDialog(新增、查看、编辑)
const loanDialog = ref<InstanceType<typeof LoanDialog> | null>(null);
const openLoanDialog = async (title: string, row: Partial<Report.Funds.ResDetailFunds> = {}) => {
  const params = {
    title,
    isView: title === "新增",
    row: { ...row },
    api: title === "新增" ? addLoan : title === "编辑" ? editLoan : undefined,
    getTableList: proTable.value?.getTableList
  };
  loanVisible.value = true;
  await nextTick();
  loanDialog.value?.acceptParams(params);
};

//销毁loanDialog
const loanVisible = ref(false);
</script>

<style scoped></style>