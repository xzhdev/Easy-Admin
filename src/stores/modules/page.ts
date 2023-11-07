import { defineStore } from "pinia";
import { PageState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const usePageStore = defineStore({
  id: "swordgate-page",
  state: (): PageState => ({
    pagesInfo: {}
  }),
  actions: {
    // Set TabTitles
    setPageTabTitleName(targetPageName: string, titleName: string) {
      this.pagesInfo[targetPageName] = this.pagesInfo[targetPageName] || {};
      this.pagesInfo[targetPageName].tabTitle = titleName;
    },

    //Get TabTitles
    getPageTabTitleName(targetPageName: string) {
      return this.pagesInfo[targetPageName]?.tabTitle;
    },

    // Set PageBacks
    setPageBackName(targetPageName: string, backPath: string) {
      this.pagesInfo[targetPageName] = this.pagesInfo[targetPageName] || {};
      this.pagesInfo[targetPageName].backPath = backPath;
    },

    //Get PageBacks
    getPageBackName(currentPageName: string) {
      return this.pagesInfo[currentPageName]?.backPath;
    }
  },
  persist: piniaPersistConfig("swordgate-page")
});
