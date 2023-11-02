<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <!--  顶部  -->
      <div class="login-header">
        <img class="login-logo" src="@/assets/images/logo_swordgate.png" alt="logo" />
        <span class="logo-text">{{ $t("login.companyName") }}</span>
      </div>
      <div class="login-language"><Language /></div>
      <div class="login-form">
        <h2 class="login-text">
          {{ $t("login.systemName") }}
          <br />
          {{ $t("login.companyName") }}
        </h2>
        <LoginForm />
        <!--  底部  -->
        <div class="login-footer">
          <span>{{ $t("footer.copyright") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from "./components/LoginForm.vue";
import Language from "@/layouts/components/Header/components/Language.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
