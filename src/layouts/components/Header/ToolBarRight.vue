<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <OrgOption />
      <Language id="language" />
      <ThemeSetting id="themeSetting" />
      <el-button size="small" type="primary" plain :icon="HomeFilled">返回平台首页</el-button>
      <InfoDialog ref="infoRef"></InfoDialog>
    </div>
  </div>
</template>

<script setup lang="ts" name="ToolBarRight">
import InfoDialog from "./components/InfoDialog.vue";
import { HomeFilled } from "@element-plus/icons-vue";
import OrgOption from "./components/OrgOption.vue";
import Language from "./components/Language.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
