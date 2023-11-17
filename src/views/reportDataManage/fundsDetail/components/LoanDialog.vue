<template>
  <el-dialog
    :title="loanProps.title"
    ref="dialogRef"
    v-model="dialogVisible"
    :destroy-on-close="true"
    class="dialog-center"
    width="950px"
    @close="closeDialog"
  >
    <!-- :class="{ 'table-active': !collapsed }" -->
    <section class="form-section">
      <component :is="'el-form'" v-bind="options.form" ref="proFormRef" :model="model" :rules="rules">
        <template v-for="item in options.columns" :key="item.prop">
          <component :is="'el-form-item'" v-bind="item.formItem">
            <component :is="`el-${item.attrs.typeName}`" v-bind="item.attrs" v-model="model[item.formItem.prop]" />
          </component>
        </template>
      </component>
    </section>
    <section class="collapsed-section">
      <el-button type="primary" @click="collapsedChange" size="small">
        <el-icon class="el-icon--right">
          <DArrowRight :class="collapsed ? 'd-arrow-top' : 'd-arrow-bottom'"></DArrowRight>
        </el-icon>
        {{ collapsed ? "展开明细" : "收起明细" }}
      </el-button>
    </section>
    <el-collapse-transition>
      <div v-show="!collapsed" class="tableDetail">
        <ProTable
          ref="proTable"
          :border="false"
          :tool-button="false"
          :is-show-search="false"
          :height="500"
          :request-api="getFundsList"
          :init-param="initParam"
          :columns="columns"
        >
          <template #tableHeader>
            <el-button type="primary">新增</el-button>
            <el-button>导出</el-button>
          </template>
        </ProTable>
      </div>
    </el-collapse-transition>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-debounce="saveFrom" type="primary"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx">
import { nextTick, reactive, ref } from "vue";
import { Report } from "@/api/interface";
import { getFundsList } from "@/api/modules/report";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { DArrowRight } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";

//控制会话框打开/关闭
const dialogVisible = ref(false);

//接收父组件传过来的参数
interface LoanProps {
  title: string;
  row: Partial<Report.ResDetailFunds>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const loanProps = ref<LoanProps>({
  title: "",
  row: {}
});

const acceptParams = (params: LoanProps) => {
  loanProps.value = { ...loanProps.value, ...params };
  dialogVisible.value = true;
};

let model = ref<any>({});

/**
 * 表单配置
 */
const options = ref({
  // 表单整体配置项
  form: {
    inline: true,
    labelPosition: "top",
    labelWidth: "80px",
    size: "default",
    disabled: false,
    labelSuffix: " :",
    class: "loanForm"
  },
  // 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
  columns: [
    {
      formItem: {
        label: "操作类型",
        prop: "czlx",
        required: true
      },
      attrs: {
        typeName: "select",
        clearable: true,
        placeholder: "请选择操作类型",
        style: "width: 100%"
      }
    },
    {
      formItem: {
        label: "删除原因",
        prop: "scyy",
        class: "data"
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请输入删除原因"
      }
    },
    {
      formItem: {
        label: "外债编号",
        prop: "wzbh",
        required: true
      },
      attrs: {
        typeName: "input",
        placeholder: "请输入外债编号",
        clearable: true
      }
    },
    {
      formItem: {
        label: "债务人代码",
        prop: "zwrdm",
        required: true
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入债务人代码"
      }
    },
    {
      formItem: {
        label: "债务类型",
        prop: "zwlx",
        required: true,
        class: "data"
      },
      attrs: {
        typeName: "select",
        clearable: true,
        autofocus: true,
        placeholder: "请选择债务类型",
        style: "width: 100%"
      }
    },
    {
      formItem: {
        label: "签约币种",
        prop: "qybz",
        required: true
      },
      attrs: {
        typeName: "select",
        placeholder: "请选择签约币种",
        clearable: true,
        style: "width: 100%"
      }
    },
    {
      formItem: {
        label: "是否浮动利率",
        prop: "isfdll",
        required: true
      },
      attrs: {
        typeName: "select",
        clearable: true,
        autofocus: true,
        placeholder: "请选择是否浮动利率",
        style: "width: 100%"
      }
    },
    {
      formItem: {
        label: "年化利率值",
        prop: "nhllz",
        required: true
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请输入年化利率值"
      }
    },
    {
      formItem: {
        label: "债权人代码",
        prop: "zqrdm",
        required: true
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请输入债权人代码"
      }
    },
    {
      formItem: {
        label: "债券人中文名称",
        prop: "zurzwmc"
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请输入债券人中文名称"
      }
    },
    {
      formItem: {
        label: "债券人英文名称",
        prop: "zqrywmc"
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请输入债券人英文名称"
      }
    },
    {
      formItem: {
        label: "债权人类型代码",
        prop: "zqrlxdm",
        required: true
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请输入债权人类型代码"
      }
    },
    {
      formItem: {
        label: "债权人国别（地区）代码",
        prop: "zqrgb"
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请选择"
      }
    },
    {
      formItem: {
        label: "是否不纳入跨境融资风险加权余额计算",
        prop: "isbnr",
        required: true
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请选择"
      }
    },
    {
      formItem: {
        label: "数据日期",
        prop: "sjrq"
      },
      attrs: {
        typeName: "date-picker",
        clearable: true,
        placeholder: "请选择日期",
        type: "date",
        style: "width: 100%"
      }
    },
    {
      formItem: {
        label: "备注",
        prop: "remark",
        required: true,
        class: "data",
        style: "width:100%"
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请输入备注",
        type: "textarea",
        rows: "5",
        maxlength: 200,
        showWordLimit: true
      }
    }
  ]
});
/**
 * 校验规则
 */
// FormRules<RuleForm>
const rules = reactive({
  czlx: [{ required: true, message: "请选择操作类型", trigger: "change" }],
  wzbh: [{ required: true, message: "请输入外债编号", trigger: "blur" }],
  zwrdm: [{ required: true, message: "请输入债务人代码", trigger: "blur" }],
  zwlx: [{ required: true, message: "请选择债务类型", trigger: "change" }],
  qybz: [{ required: true, message: "请选择签约币种", trigger: "change" }],
  isfdll: [{ required: true, message: "请选择是否浮动利率", trigger: "change" }],
  nhllz: [{ required: true, message: "请输入年化利率值", trigger: "blur" }],
  zqrdm: [{ required: true, message: "请输入债权人代码", trigger: "blur" }],
  zqrlxdm: [{ required: true, message: "请输入债权人类型代码", trigger: "blur" }],
  isbnr: [{ required: true, message: "请选择是否不纳入跨境融资风险加权余额计算", trigger: "change" }],
  remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
});

/**
 * 表格配置项
 */
const columns = reactive<ColumnProps<Report.ResFunds>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "moduleName",
    label: "所属模块名称",
    minWidth: 220
  },
  {
    prop: "formName",
    label: "表单名称"
  },
  {
    prop: "pendingSubmit",
    label: "待提交",
    render: scope => {
      return (
        <>
          <el-text class="mx-1 mouse-pointer" type="primary">
            {scope.row.pendingAudit}
          </el-text>
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
          <el-text class="mx-1 mouse-pointer" type="primary">
            {scope.row.pendingAudit}
          </el-text>
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
          <el-text class="mx-1 mouse-pointer" type="primary">
            {scope.row.pendingAudit}
          </el-text>
        </>
      );
    }
  },
  {
    prop: "dataDate",
    label: "数据日期",
    isShow: false
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 200,
    render: () => {
      return (
        <>
          <el-button type="primary" link>
            详细信息
          </el-button>
          <el-button type="primary" link>
            编辑
          </el-button>
          <el-button type="primary" link>
            删除
          </el-button>
        </>
      );
    }
  }
]);

// 保存表单
const proFormRef = ref<FormInstance>();
const saveFrom = async () => {
  console.log("触发");
  if (!proFormRef.value) return;
  await proFormRef.value.validate(valid => {
    if (valid) {
      console.log("submit!");
    } else {
      const isError = document.getElementsByClassName("is-error");
      isError[0].scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
    }
  });
};

const collapsedChange = async () => {
  collapsed.value = !collapsed.value;
  //滚动到表格明细区
  if (collapsed.value) return;
  await nextTick();
  const tableDetail = document.querySelector(".tableDetail");
  setTimeout(() => {
    tableDetail?.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  }, 500);
};

//初始化请求数据
const initParam = reactive({});

// 是否折叠
const collapsed = ref(true);

const emit = defineEmits(["update:loanVisible"]);
//关闭对话框
const closeDialog = () => {
  emit("update:loanVisible", false);
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scope>
.loanForm.el-form--inline.el-form--label-top {
  margin-right: -32px;
  & .el-form-item {
    width: calc(100% / 3 - 32px);
  }
}
.form-section {
  width: 100%;
  max-height: 800px;
  overflow: hidden auto;

  // overflow: hidden overlay;
  transition: all 1s ease-in-out;
  &.table-active {
    max-height: 300px;
  }
}
.collapsed-section {
  margin: 10px 0;
  text-align: center;
}
.d-arrow-top {
  transition: all 0.1s;
  transform: rotate(-90deg);
}
.d-arrow-bottom {
  transition: all 0.1s;
  transform: rotate(90deg);
}
.el-overlay-dialog::-webkit-scrollbar {
  // width: 0;
}
</style>
