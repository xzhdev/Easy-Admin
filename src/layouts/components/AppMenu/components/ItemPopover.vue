<template>
  <template v-for="(item, index) in list">
    <el-popover
      placement="right"
      trigger="click"
      :teleported="false"
      :offset="10"
      :width="240"
      v-if="item.children && item.children.length > 0"
      :key="item.name"
    >
      <template #reference>
        <div class="content" :style="{ 'margin-bottom': index !== list.length - 1 ? '5px' : 'none' }">
          <el-image class="logo" style="width: 25px; height: 25px" :src="item.logo" />
          <div class="name">{{ item.name }}</div>
        </div>
      </template>
      <ItemPopover :list="item.children"></ItemPopover>
    </el-popover>
    <template v-else>
      <div class="content" :style="{ 'margin-bottom': index !== list.length - 1 ? '5px' : 'none' }" :key="item.name">
        <el-image class="logo" style="width: 25px; height: 25px" :src="item.logo" />
        <div class="name">{{ item.name }}</div>
      </div>
    </template>
  </template>
</template>

<script setup lang="ts" name="ItemPopover">
interface ListProps {
  logo: string;
  name: string;
  children?: ListProps[];
}

defineProps<{ list: ListProps[] }>();
</script>

<style scoped lang="scss">
.content {
  display: flex;
  align-items: center;
  height: 30px;
  cursor: pointer;
  .logo {
    flex-shrink: 0;
    border-radius: 100% !important;
  }
  .name {
    flex-shrink: 0;
    margin-left: 10px;
  }
}
</style>
