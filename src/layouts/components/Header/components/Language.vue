<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <i :class="'iconfont icon-zhongyingwen'" class="toolBar-icon"></i>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { getBrowserLang, localSet } from "@/utils";
import { useI18n } from "vue-i18n";
import { computed, onMounted } from "vue";
import { useGlobalStore } from "@/stores/modules/global";
import { LanguageType } from "@/stores/interface";

onMounted(() => {
  initLanguage(language.value || getBrowserLang());
});
const router = useRoute();
const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const languageList = [
  { label: "简体中文", value: "zh" },
  { label: "English", value: "en" }
];

const changeLanguage = (lang: string) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang as LanguageType);
  initLanguage(lang);
};

const initLanguage = (language: string) => {
  //调试中英文设置(cn|en)
  i18n.locale.value = language;
  globalStore.setGlobalState("language", language as LanguageType);
  localSet("GlobalState.language", language);
  const title = router.meta.title;
  document.title = title + "-" + i18n.t("aside.title");
};
</script>
