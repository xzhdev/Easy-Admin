<template>
  <Maximize v-show="maximize" />
  <Tabs v-show="tabs" />
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="keepAliveName">
          <component :is="Component" v-if="isRouterShow" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
  <el-footer v-show="footer">
    <Footer />
  </el-footer>
  <float-menu v-show="token" :position="'top left'" :dimension="50" :menu-data="items" :on-selected="handleSelection">
    <template #icon>
      <box-icon />
    </template>
    <template #edit>
      <img src="@/assets/icons/edit.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #new>
      <img src="@/assets/icons/plus-circle.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #theme>
      <img src="@/assets/icons/paint-brush.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #settings>
      <img src="@/assets/icons/cog.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #save>
      <img src="@/assets/icons/save.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #close>
      <img src="@/assets/icons/window-close.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #exit>
      <img src="@/assets/icons/sign-out-alt.svg" alt="edit" :style="computedStyle" />
    </template>
    <template #recent>
      <img src="@/assets/icons/clock.svg" alt="edit" :style="computedStyle" />
    </template>
  </float-menu>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, provide, watch, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@vueuse/core";
import { useGlobalStore } from "@/stores/modules/global";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { useUserStore } from "@/stores/modules/user";
import FloatMenu from "@/components/FloatMenu/index.vue";
import BoxIcon from "@/components/FloatMenu/icons/BoxIcon.vue";
import Maximize from "./components/Maximize.vue";
import Tabs from "@/layouts/components/Tabs/index.vue";
import Footer from "@/layouts/components/Footer/index.vue";
import mittBus from "@/utils/mittBus";
import { useRoute } from "vue-router";

const globalStore = useGlobalStore();
const userStore = useUserStore();
const token = computed(() => userStore.token);
const { maximize, isCollapse, layout, tabs, footer } = storeToRefs(globalStore);

const useroute = useRoute();
const keepAliveStore = useKeepAliveStore();
const { keepAliveName } = storeToRefs(keepAliveStore);

const computedStyle = computed(() => ({
  width: "100%",
  height: "100%"
}));

// 注入刷新页面方法
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide("refresh", refreshCurrentPage);

const resetkeepAlive = () => {
  setTimeout(() => {
    useroute.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(useroute.name as string);
    refreshCurrentPage(false);
    nextTick(() => {
      useroute.meta.isKeepAlive && keepAliveStore.addKeepAliveName(useroute.name as string);
      refreshCurrentPage(true);
    });
  }, 0);
  keepAliveStore.setKeepAliveName([]);
};
mittBus.on("resetkeepAlive", resetkeepAlive);

// 监听当前页面是否最大化，动态添加 class
watch(
  () => maximize.value,
  () => {
    const app = document.getElementById("app") as HTMLElement;
    if (maximize.value) app.classList.add("main-maximize");
    else app.classList.remove("main-maximize");
  },
  { immediate: true }
);

// 监听布局变化，在 body 上添加相对应的 layout class
watch(
  () => layout.value,
  () => {
    const body = document.body as HTMLElement;
    body.setAttribute("class", layout.value);
  },
  { immediate: true }
);

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0);
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth;
  if (!isCollapse.value && screenWidth.value < 1200) globalStore.setGlobalState("isCollapse", true);
  if (isCollapse.value && screenWidth.value > 1200) globalStore.setGlobalState("isCollapse", false);
}, 100);
window.addEventListener("resize", listeningWindow, false);
onBeforeUnmount(() => {
  window.removeEventListener("resize", listeningWindow);
});

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

<style scoped lang="scss">
@import "./index.scss";
</style>
