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
      :back-button="true"
    >
      <template #tableHeader>
        <!-- 待提交 -->
        <div v-if="type === '0'">
          <el-button @click="openLoanDialog($t('button.add'))">{{ $t("button.add") }}</el-button>
          <el-button @click="handleVerProcess">校验</el-button>
          <el-button @click="openVerResultDialog">校验结果查看</el-button>
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
    <VerResultDialog ref="verResultDialog"></VerResultDialog>
  </div>
</template>

<script setup lang="tsx" name="fundsDetail">
import { nextTick, onActivated, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useTabsStore } from "@/stores/modules/tabs";
import { getFundsList } from "@/api/modules/report";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Report } from "@/api/interface";
import { addLoan, editLoan } from "@/api/modules/report";
import { useI18n } from "vue-i18n";
import { useVerifyProcess } from "@/hooks/useVerifyProcess";
import { useTableSelectResTips } from "@/hooks/useTableSelectResTips";
import ProTable from "@/components/ProTable/index.vue";
import LoanDialog from "./components/LoanDialog.vue";
import VerResultDialog from "./components/VerResultDialog.vue";

const { t } = useI18n();
const tabStore = useTabsStore();
const route = useRoute();

//接收路由参数
const type = ref<string>("0");

let types = {
  "0": "待提交",
  "1": "待审核",
  "2": "审核通过"
};
const title = ref("");
onActivated(() => {
  initInfo();
});

const initInfo = () => {
  //设置tabs title
  if (route.query.state && typeof route.query.state === "string") {
    type.value = route.query.state;
    title.value = types[route.query.state as keyof typeof types];
    route.meta.title = title;
    tabStore.setTabsTitle(title.value);
  }
};

// 表格配置项
const columns = reactive<ColumnProps<Report.ResFunds>[]>([
  { type: "selection", width: 80 },
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
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "dataRollback",
    label: "数据打回",
    isShow: type.value === "0"
  },
  {
    prop: "validationStatus",
    label: "校验状态",
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "auditFailureReason",
    label: "审核不通过原因",
    render: scope => {
      return (
        <>
          <el-button link type="primary" onClick={() => goPendingAudit()}>
            {scope.row.pendingAudit}
          </el-button>
        </>
      );
    }
  },
  {
    prop: "dealerCode",
    label: "经销商编号",
    search: {
      el: "input",
      props: { placeholder: "输入搜索关键词" }
    }
  },
  {
    prop: "dealerName",
    label: "经销商名称",
    search: {
      el: "input",
      props: { placeholder: "输入搜索关键词" }
    }
  },
  {
    prop: "loanType",
    label: "贷款类型"
  },
  {
    prop: "vehicleIdentificationNumber",
    label: "车辆识别号"
  },
  {
    prop: "creditContractCode",
    label: "信贷合同号",
    search: {
      el: "input",
      props: { placeholder: "输入搜索关键词" }
    }
  },
  {
    prop: "loanNoteCode",
    label: "信贷借据号"
  },
  {
    prop: "detailSubjectCode",
    label: "明细科目编号"
  },
  {
    prop: "detailSubjectName",
    label: "明细科目名称"
  },
  {
    prop: "currency",
    label: "币种"
  },
  {
    prop: "loanDate",
    label: "放款日期"
  },
  {
    prop: "dueDate",
    label: "到期日期"
  },
  {
    prop: "loanAmount",
    label: "贷款金额"
  },
  {
    prop: "loanInterestRate",
    label: "贷款利率"
  },
  {
    prop: "thirdPartyDiscountRate",
    label: "第三方贴息利率"
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 250,
    render: scope => {
      return (
        <>
          <el-button type="primary" link onClick={() => openLoanDialog(t("button.edit"), scope.row)}>
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

// 前往待审核页面
const goPendingAudit = () => {
  console.log("待提交");
};

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 打开 loanDialog(新增、查看、编辑)
const loanDialog = ref<InstanceType<typeof LoanDialog> | null>(null);
const openLoanDialog = async (title: string, row: Partial<Report.ResDetailFunds> = {}) => {
  const params = {
    title,
    row: { ...row },
    api: title === t("button.add") ? addLoan : title === t("button.edit") ? editLoan : undefined,
    getTableList: proTable.value?.getTableList
  };
  loanVisible.value = true;
  await nextTick();
  loanDialog.value?.acceptParams(params);
};

// 销毁loanDialog
const loanVisible = ref(false);

//打开 openVerResult（校验结果查看）
const verResultDialog = ref<InstanceType<typeof VerResultDialog> | null>(null);
const openVerResultDialog = async (row: Partial<Report.ResDetailFunds>) => {
  const params = {
    row: { ...row }
  };
  await nextTick();
  verResultDialog.value?.acceptParams(params);
};

// 校验
const handleVerProcess = async () => {
  useTableSelectResTips(proTable.value?.selectedList, null, () => {
    //传递勾选数据,未勾选则为全选
    useVerifyProcess(proTable.value?.selectedList);
  });
};
</script>

<style scoped></style>
