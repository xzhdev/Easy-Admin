<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed, ref, useSlots } from "vue";
import { useI18n } from "vue-i18n";
import { getBrowserLang } from "@/utils";
import { useTheme } from "@/hooks/useTheme";
import { ElConfigProvider } from "element-plus";
import { LanguageType } from "./stores/interface";
import { useGlobalStore } from "@/stores/modules/global";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import Language from "./layouts/components/Header/components/Language.vue";

const globalStore = useGlobalStore();

// init theme
const { initTheme } = useTheme();
initTheme();

// init language
const i18n = useI18n();
onMounted(() => {
  const language = globalStore.language ?? getBrowserLang();
  i18n.locale.value = language;
  globalStore.setGlobalState("language", language as LanguageType);
});

// element language
const locale = computed(() => {
  if (globalStore.language == "zh") return zhCn;
  if (globalStore.language == "en") return en;
  return getBrowserLang() == "zh" ? zhCn : en;
});

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });

// block debugger
process.env.NODE_ENV === "production" &&
  (function block() {
    let currentTime = new Date().getTime();
    const tips = {
      zh: "禁止调试，请重新访问！",
      en: "Please do not debug, please revisit!"
    };
    // setInterval版
    // const timeout = setInterval(() => {
    //   new Function("debugger")();
    //   const newTime = new Date().getTime();
    //   if (newTime - currentTime > 500) {
    //     clearInterval(timeout);
    //     window.location.href = "about:blank";
    //   } else {
    //     currentTime = newTime;
    //   }
    // }, 400);
    //递归 setTimeout
    function timeoutFun() {
      const timeout = setTimeout(() => {
        new Function("debugger")();
        const newTime = new Date().getTime();
        if (newTime - currentTime > 500) {
          clearInterval(timeout);
          alert(tips[globalStore.language!]);
          window.close();
        } else {
          currentTime = newTime;
        }
        timeoutFun();
      }, 400);
    }
    timeoutFun();
  })();
</script>
