<template>
  <el-dialog v-model="dialogVisible" :title="$t('header.pwdDialog.title')" width="500px" draggable>
    <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="auto" size="large">
      <el-form-item :label="$t('header.pwdDialog.oldPwd')" prop="oldPassword">
        <el-input
          type="password"
          v-model="passwordForm.oldPassword"
          :placeholder="$t('header.pwdDialog.oldPwdHolder')"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('header.pwdDialog.newPwd')" prop="newPassword">
        <el-input
          type="password"
          v-model="passwordForm.newPassword"
          :placeholder="$t('header.pwdDialog.newPwdHolder')"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('header.pwdDialog.confirmPwd')" prop="confirmPassword">
        <el-input
          type="password"
          v-model="passwordForm.confirmPassword"
          :placeholder="$t('header.pwdDialog.cofPwdHolder')"
          show-password
        >
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="save(passwordFormRef)">{{ $t("header.pwdDialog.button") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { Login } from "@/api/interface";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { updatePwd } from "@/api/modules/login";
import { LOGIN_URL } from "@/config";
import { useRouter } from "vue-router";
import { encryptRsa } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const passwordFormRef = ref<FormInstance>();
const oldPassRequired = computed(() => t("header.pwdDialog.oldPwdHolder"));
const newPassRequired = computed(() => t("header.pwdDialog.newPwdHolder"));
const confirmNewPassRequired = computed(() => t("header.pwdDialog.cofPwdHolder"));
const passwordRules = reactive({
  oldPassword: [{ required: true, message: oldPassRequired, trigger: "blur" }],
  newPassword: [{ required: true, message: newPassRequired, trigger: "blur" }],
  confirmPassword: [{ required: true, message: confirmNewPassRequired, trigger: "blur" }]
});
const passwordForm = reactive<Login.ResChangePass>({ oldPassword: "", newPassword: "", confirmPassword: "" });

const dialogVisible = ref(false);

const token = ref("");

// openDialog
const openDialog = (tokenStr: string) => {
  // 由于弹窗修改密码时清空了token，此处暂存token值
  token.value = tokenStr;
  dialogVisible.value = true;
  resetPasswordFormRef();
};

const save = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    // 写入token，用于访问修改密码接口
    userStore.setToken(token.value);
    // TODO 修改密码
    await updatePwd({
      ...passwordForm,
      oldPassword: encryptRsa(passwordForm.oldPassword),
      newPassword: encryptRsa(passwordForm.newPassword),
      confirmPassword: encryptRsa(passwordForm.confirmPassword)
    });
    // console.log("密码" + passwordForm);
    ElMessage.success({ message: t("header.pwdDialog.mesSuc") });
    dialogVisible.value = false;
    userStore.setToken("");
    router.replace(LOGIN_URL);
  });
};
const resetPasswordFormRef = () => {
  passwordFormRef.value?.resetFields();
};

defineExpose({ openDialog });
</script>

<style scoped lang="scss">
.el-form-item__label-wrap {
  margin-left: 0 !important;
}
</style>
