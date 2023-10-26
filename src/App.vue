<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
  <float-menu :position="'top left'" :dimension="50" :menu-data="items" :on-selected="handleSelection">
    <template #icon>
      <box-icon />
    </template>
    <template #edit>
      <img src="../src/components/FloatMenu/assets/edit.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #new>
      <img src="../src/components/FloatMenu/assets/plus-circle.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #theme>
      <img src="../src/components/FloatMenu/assets/paint-brush.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #settings>
      <img src="../src/components/FloatMenu/assets/cog.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #save>
      <img src="../src/components/FloatMenu/assets/save.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #close>
      <img src="../src/components/FloatMenu/assets/window-close.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #exit>
      <img src="../src/components/FloatMenu/assets/sign-out-alt.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #recent>
      <img src="../src/components/FloatMenu/assets/clock.svg" alt="edit" :style="computedStyle" />
    </template>
  </float-menu>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed, ref, useSlots } from "vue";
import { useI18n } from "vue-i18n";
import { getBrowserLang } from "@/utils";
import { useTheme } from "@/hooks/useTheme";
import { ElConfigProvider } from "element-plus";
import FloatMenu from "@/components/FloatMenu/index.vue";
import BoxIcon from "@/components/FloatMenu/icons/BoxIcon.vue";
import { LanguageType } from "./stores/interface";
import { useGlobalStore } from "@/stores/modules/global";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const globalStore = useGlobalStore();

const computedStyle = computed(() => ({
  width: "100%",
  height: "100%"
}));

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

const items = [
  { name: "New", iconSlot: "new" },
  {
    name: "人民银行监管报送系统",
    iconSlot: "edit",
    subMenu: {
      name: "edit-items",
      items: [
        { name: "金融基础数据统计制度", iconSlot: "edit" },
        { name: "人行利率报备检测分析系统", iconSlot: "edit" },
        { name: "二代企业征信报送系统", iconSlot: "edit" },
        { name: "二代个人征信报送系统", iconSlot: "edit" }
      ]
    }
  },
  {
    name: "银保监会监管报送系统",
    iconSlot: "recent",
    subMenu: {
      name: "recent-items",
      items: [{ name: "Document 1" }, { name: "Document 2" }]
    }
  },
  {
    name: "Close",
    iconSlot: "close"
  },
  {
    name: "Exit",
    iconSlot: "exit"
  }
];

const handleSelection = (selectedItem: string) => {
  console.log(selectedItem);
};
</script>
