import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "swordgate-user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "swordgate" },
    coreInfo: {
      coreOrg: "1",
      coreDepartment: "2"
    }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setCoreInfo(coreInfo: UserState["coreInfo"]) {
      this.coreInfo = coreInfo;
    }
  },
  persist: piniaPersistConfig("swordgate-user")
});
