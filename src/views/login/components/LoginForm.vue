<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" :placeholder="$t('login.userName')">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        :placeholder="$t('login.password')"
        show-password
        autocomplete="new-password"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <div v-if="isCode" class="login-code">
      <el-form-item prop="code">
        <el-input class="code-input" v-model="loginForm.code" :placeholder="$t('login.code')">
          <template #prefix>
            <el-icon class="el-input__icon"><Warning /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <IdentifyComp @get-code="getCode"></IdentifyComp>
    </div>
  </el-form>
  <div class="login-btn">
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      {{ $t("login.login") }}
    </el-button>
  </div>
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import i18n from "@/languages";
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState, encryptRsa } from "@/utils";
import { synLanguageConfig } from "@/utils/language";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi, queryCode } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { UserFilled } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import IdentifyComp from "@/components/Identify/identify.vue";
import PasswordDialog from "@/layouts/components/Header/components/PasswordDialog.vue";
import type { ElForm } from "element-plus";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const { t } = useI18n();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const userNameRequired = computed(() => t("login.userNameRequired"));
const passwordRequired = computed(() => t("login.passwordRequired"));
const codeRequired = computed(() => t("login.codeRequired"));
const loginRules = reactive({
  username: [{ required: true, message: userNameRequired, trigger: "blur" }],
  password: [{ required: true, message: passwordRequired, trigger: "blur" }],
  code: [{ required: true, message: codeRequired, trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({ username: "", password: "", code: "", language: "" });

// 获取验证码
const code = ref("");
const getCode = (value: string) => {
  code.value = value;
};

// 是否展示验证码
let isCode = ref(false);
const isCodeConf = async () => {
  const { data } = await queryCode();
  if (data.needVerificationCode === "true") {
    isCode.value = true;
  }
};
// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const language = i18n.global.locale.value;
      const { data } = await loginApi({
        ...loginForm,
        password: encryptRsa(loginForm.password),
        language: synLanguageConfig(language)
      });
      userStore.setToken(data.token);

      // 2.添加动态路由
      await initDynamicRouter();

      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);

      // 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: "欢迎登录 SACJ",
        type: "success",
        duration: 3000
      });
    } finally {
      loading.value = false;
    }
  });
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
  // isCodeConf();
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
