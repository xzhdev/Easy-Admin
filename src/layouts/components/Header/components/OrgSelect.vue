<template>
  <div style="flex-shrink: 0; margin-right: -21px">
    <el-form :inline="true" :model="coreInfo">
      <el-form-item label="操作机构:">
        <el-select v-model="coreInfo.coreOrg" class="m-2" @change="handleChange" placeholder="Select" size="small">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作部门:">
        <el-select v-model="coreInfo.coreDepartment" class="m-2" placeholder="Select" size="small">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/modules/user";
import mittBus from "@/utils/mittBus";

const userStore = useUserStore();
const coreInfo = ref({
  coreOrg: userStore.coreInfo.coreOrg,
  coreDepartment: userStore.coreInfo.coreDepartment
});
const value = ref("1");
const options = [
  {
    value: "1",
    label: "华美银行上海分行"
  },
  {
    value: "2",
    label: "华美银行汕头分行"
  },
  {
    value: "3",
    label: "华美银行北京分行"
  },
  {
    value: "4",
    label: "华美银行深圳分行"
  }
];
const options2 = [
  {
    value: "1",
    label: "部门1"
  },
  {
    value: "2",
    label: "部门2"
  },
  {
    value: "3",
    label: "部门3"
  },
  {
    value: "4",
    label: "部门4"
  }
];

watch(
  () => coreInfo.value,
  () => {
    mittBus.emit("resetkeepAlive");
  },
  {
    deep: true
  }
);
const handleChange = () => {
  userStore.setCoreInfo(coreInfo.value);
};
</script>

<style scoped lang="scss">
.el-form {
  .el-form-item {
    margin-right: 21px;
    margin-bottom: 0;
    span {
      font-weight: bold;
      color: var(--el-color-primary);
    }
  }
}
</style>
