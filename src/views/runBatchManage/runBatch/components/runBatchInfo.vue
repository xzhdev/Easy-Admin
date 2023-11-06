<template>
  <el-dialog
    :title="runBatchProps.title"
    v-model="dialogVisible"
    :destroy-on-close="true"
    width="500px"
    draggable
    @close="closeDialog"
  >
    <component :is="'el-form'" v-bind="options.form" ref="proFormRef" :model="model" :rules="rules">
      <template v-for="item in options.columns" :key="item.prop">
        <component :is="'el-form-item'" v-bind="item.formItem">
          <component :is="`el-${item.attrs.typeName}`" v-bind="item.attrs" v-model="model[item.formItem.prop]" />
        </component>
      </template>
    </component>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="resetForm"> 重置 </el-button>
        <el-button type="primary" @click="saveFrom"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { RunBatch } from "@/api/interface";
import { useDebounceFn } from "@vueuse/core";

//关闭对话框
const emit = defineEmits(["update:runBatchVisible"]);

const closeDialog = () => {
  emit("update:runBatchVisible", false);
};

/**
 * 表单配置
 */
let model = ref<any>({});
const options = ref({
  // 表单整体配置项
  form: {
    labelPosition: "top",
    labelWidth: "80px",
    size: "default",
    disabled: false,
    labelSuffix: " :"
  },
  // 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
  columns: [
    {
      formItem: {
        label: "任务名称",
        prop: "taskName",
        required: true
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入任务名称",
        maxlength: 100
      }
    },
    {
      formItem: {
        label: "任务说明",
        prop: "taskDescription",
        class: "data"
      },
      attrs: {
        typeName: "input",
        clearable: true,
        autofocus: true,
        placeholder: "请输入任务说明",
        maxlength: 100
      }
    },
    {
      formItem: {
        label: "任务文件路径",
        prop: "taskFilePath",
        required: true
      },
      attrs: {
        typeName: "input",
        placeholder: "请选择任务文件路径",
        clearable: true
      }
    },
    {
      formItem: {
        label: "报表名称",
        prop: "reportName",
        required: true
      },
      attrs: {
        typeName: "select",
        clearable: true,
        placeholder: "请选择报表",
        style: "width: 100%"
      }
    }
  ]
});

/**
 * 规则
 */
const rules = reactive<FormRules>({
  taskName: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
  taskDescription: [{ required: true, message: "请输入任务说明", trigger: "blur" }],
  taskFilePath: [{ required: true, message: "请选择任务文件路径", trigger: "blur" }],
  reportName: [{ required: true, message: "请选择报表名称", trigger: "change" }]
});

//保存
const proFormRef = ref<FormInstance>();
const saveFrom = useDebounceFn(async () => {
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
}, 1000);

//重置
const resetForm = () => {
  if (!proFormRef.value) return;
  proFormRef.value.resetFields();
};

//接收父组件传过来的参数
interface RunBatchProps {
  title: string;
  row: Partial<RunBatch.ResTaskList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const runBatchProps = ref<RunBatchProps>({
  title: "",
  row: {}
});

const dialogVisible = ref(false);
const acceptParams = (params: RunBatchProps) => {
  runBatchProps.value = { ...runBatchProps.value, ...params };
  dialogVisible.value = true;
  console.log(dialogVisible.value);
};

defineExpose({
  acceptParams
});
</script>

<style scoped></style>
