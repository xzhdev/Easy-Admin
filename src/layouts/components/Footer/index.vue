<template>
  <div class="footer flx-center">
    <div class="footerdiv">
      <span> {{ $t("footer.copyright") }} </span>
      <br />
      <span> {{ $t("aside.title") }} {{ version }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const version = import.meta.env.VITE_VERTION;
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
