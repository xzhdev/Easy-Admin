<template>
  <el-dialog :title="title" class="dialog-center" v-model="dialogVisible" :destroy-on-close="true" width="400px">
    <el-form class="flx-center" :model="model" ref="form" :rules="rules">
      <el-form-item :label="options.formItem.label" :prop="options.formItem.prop">
        <component :is="'el-date-picker'" v-bind="options.dateAttrs" v-model="model[options.formItem.prop]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="sumbit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
interface DateForm {
  title: string;
  options: {
    formItem: {
      label: string;
      prop: string;
      [key: string]: any;
    };
    dateAttrs?: {
      [key: string]: any;
    };
  };
}
const props = defineProps<DateForm>();

//表单参数
const model = ref<any>({});

//规则
const rules = reactive<FormRules>({
  [props.options.formItem.prop]: [{ required: true, message: `请选择${props.options.formItem.label}`, trigger: "change" }]
});

//控制会话框打开/关闭
const dialogVisible = ref(false);

//接收父组件传过来的参数
interface DateFormProps {
  api: (params: any) => Promise<any>;
}

const dateFormProps = ref<DateFormProps>();

const acceptParams = (params: DateFormProps) => {
  dateFormProps.value = params;
  dialogVisible.value = true;
};

const form = ref<FormInstance>();

const sumbit = () => {
  if (!form.value) return;
  form.value.validate(valid => {
    if (valid) {
      console.log("submit!");
    } else {
    }
  });
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scope></style>
