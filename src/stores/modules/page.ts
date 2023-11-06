import { defineStore } from "pinia";
import { PageState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const usePageStore = defineStore({
  id: "swordgate-page",
  state: (): PageState => ({
    tabTitles: {}, //设置跳转详情页面对应的tab title
    pageBacks: {} //页面对应返回的path，防止刷新后，返回按钮失效
  }),
  actions: {
    // Set TabTitles
    setPageTabTitleName(path: string, titleName: string) {
      this.tabTitles[path] = titleName;
    },

    //Get TabTitles
    getPageTabTitleName(path: string) {
      return this.tabTitles[path];
    },

    // Set PageBacks
    setPageBackName(currentPageName: string, backPath: string) {
      this.pageBacks[currentPageName] = backPath;
    },

    //Get PageBacks
    getPageBackName(currentPageName: string) {
      return this.pageBacks[currentPageName];
    }
  },
  persist: piniaPersistConfig("swordgate-page")
});
