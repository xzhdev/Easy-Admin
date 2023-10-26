import { defineStore } from "pinia";
import { PageState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const usePageStore = defineStore({
  id: "swordgate-page",
  state: (): PageState => ({
    tabTitles: {}
  }),
  actions: {
    // Set TabTitles
    setPageTabTitleName(path: string, titleName: string) {
      this.tabTitles[path] = titleName;
    },

    //Get TabTitles
    getPageTabTitleName(path: string) {
      return this.tabTitles[path];
    }
  },
  persist: piniaPersistConfig("page")
});
