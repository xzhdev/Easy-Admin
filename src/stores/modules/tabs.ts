import router from "@/routers";
import { defineStore } from "pinia";
import { getUrlWithParams } from "@/utils";
import { useKeepAliveStore } from "./keepAlive";
import { TabsState, TabsMenuProps } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

const keepAliveStore = useKeepAliveStore();
//完整路径去除传参 a/b?a=1 =>  a/b
const getPath = (fullPath: string) => {
  return fullPath.split("?")[0];
};

export const useTabsStore = defineStore({
  id: "swordgate-tabs",
  state: (): TabsState => ({
    tabsMenuList: []
  }),
  actions: {
    // Add Tabs
    async addTabs(tabItem: TabsMenuProps) {
      console.log("tabItem", tabItem);
      if (this.tabsMenuList.every(item => getPath(item.path) !== getPath(tabItem.path))) {
        this.tabsMenuList.push(tabItem);
      } else {
        const index = this.tabsMenuList.findIndex(item => getPath(item.path) === getPath(tabItem.path));
        if (index > -1) this.tabsMenuList.splice(index, 1, tabItem);
      }
      // add keepalive
      if (!keepAliveStore.keepAliveName.includes(tabItem.name) && tabItem.isKeepAlive) {
        keepAliveStore.addKeepAliveName(tabItem.name);
      }
    },
    // Remove Tabs
    async removeTabs(tabPath: string, isCurrent: boolean = true) {
      if (isCurrent) {
        this.tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          const nextTab = this.tabsMenuList[index + 1] || this.tabsMenuList[index - 1];
          if (!nextTab) return;
          router.push(nextTab.path);
        });
      }
      // remove keepalive
      const tabItem = this.tabsMenuList.find(item => item.path === tabPath);
      tabItem?.isKeepAlive && keepAliveStore.removeKeepAliveName(tabItem.name);
      // set tabs
      this.tabsMenuList = this.tabsMenuList.filter(item => item.path !== tabPath);
    },
    // Close Tabs On Side
    async closeTabsOnSide(path: string, type: "left" | "right") {
      const currentIndex = this.tabsMenuList.findIndex(item => item.path === path);
      if (currentIndex !== -1) {
        const range = type === "left" ? [0, currentIndex] : [currentIndex + 1, this.tabsMenuList.length];
        this.tabsMenuList = this.tabsMenuList.filter((item, index) => {
          return index < range[0] || index >= range[1] || !item.close;
        });
      }
      // set keepalive
      const KeepAliveList = this.tabsMenuList.filter(item => item.isKeepAlive);
      keepAliveStore.setKeepAliveName(KeepAliveList.map(item => item.name));
    },
    // Close MultipleTab
    async closeMultipleTab(tabsMenuValue?: string) {
      this.tabsMenuList = this.tabsMenuList.filter(item => {
        return item.path === tabsMenuValue || !item.close;
      });
      // set keepalive
      const KeepAliveList = this.tabsMenuList.filter(item => item.isKeepAlive);
      keepAliveStore.setKeepAliveName(KeepAliveList.map(item => item.name));
    },
    // Set Tabs
    async setTabs(tabsMenuList: TabsMenuProps[]) {
      this.tabsMenuList = tabsMenuList;
    },
    // Set Tabs Title
    async setTabsTitle(title: string) {
      this.tabsMenuList.forEach(item => {
        if (item.path == getUrlWithParams()) item.title = title;
      });
    }
  },
  persist: piniaPersistConfig("swordgate-tabs")
});
