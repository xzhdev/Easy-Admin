<template>
  <div class="appContainer">
    <el-popover placement="right" width="auto" trigger="click" :teleported="false">
      <template #reference>
        <el-button type="info" circle>
          <el-icon><Switch /></el-icon>
        </el-button>
      </template>
      <ItemPopover :list="list"></ItemPopover>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import ItemPopover from "./components/ItemPopover.vue";
const list = [
  {
    logo: "https://axure-file.lanhuapp.com/md5__94390864dafd493abb369b5877f32b5e.png",
    name: "人民银行监管报送系统",
    children: [
      {
        logo: "https://axure-file.lanhuapp.com/md5__63496a83993f38175ca34c1f235769b6.png",
        name: "金融基础数据统计制度"
      },
      {
        logo: "https://axure-file.lanhuapp.com/md5__46ee09092ee225ba093cab3e91454214.png",
        name: "人行利率报备检测分析系统"
      },
      {
        logo: "https://axure-file.lanhuapp.com/md5__383da90fba42c52585cd2f52103d2aa3.png",
        name: "二代企业征信报送系统"
      },
      {
        logo: "https://axure-file.lanhuapp.com/md5__caafe3fcac34ad951c00c1f1607f6cee.png",
        name: "二代个人征信报送系统"
      }
    ]
  },
  {
    logo: "https://axure-file.lanhuapp.com/md5__466c95bbcd75798bdd916d2e351e9b72.png",
    name: "银保监会监管报送系统"
  }
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
