<template>
  <div></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Report } from "@/api/interface";

interface VerProcProps {
  selectedList: any[];
}

const verProcProps = ref<VerProcProps>({
  selectedList: []
});
const acceptParams = (params: VerProcProps) => {
  // verProcProps.value = { ...verProcProps.value, ...params };
};
defineExpose({ acceptParams });
</script>

<style scoped></style>
