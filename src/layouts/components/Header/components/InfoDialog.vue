<template>
  <div>
    <!--减去 折叠65px,展开230px 和 10px边距 -->
    <el-popover
      placement="bottom-start"
      :width="isCollapse ? 'calc(100% - 65px - 10px)' : 'calc(100% - 230px - 10px)'"
      trigger="click"
      :teleported="false"
      :popper-options="{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [5, 12]
            }
          }
        ]
      }"
    >
      <template #reference>
        <el-button style="margin-left: 10px" link type="primary" @click="openDialog('infoRef')">
          <span>{{ "admin" }}</span> <el-icon class="usernameIcon"><ArrowDown /></el-icon>
        </el-button>
      </template>
      <div class="userInfoDetails">
        <div class="card-title">
          <span>{{ $t("header.infoDialog.title") }}</span>
        </div>
        <el-card class="box-card">
          <div class="card-details">
            <div class="flx-center loginInfoBox">
              <img class="avatar" src="@/assets/images/avatar.png" alt="avatar" />
              <div style="display: flex; flex-direction: column">
                <el-form-item :label="$t('header.infoDialog.loginName')" style="margin-bottom: 0">
                  <!-- <span>{{ logInInfo.loginId }}</span> -->
                  <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('loginName')">
                    <template #content>admin</template>
                    <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'loginName')">admin</div>
                  </el-tooltip>
                </el-form-item>
                <el-form-item :label="$t('header.infoDialog.cnName')" style="margin-bottom: 0">
                  <!-- <span v-if="!!logInInfo">{{ logInInfo.userCname }}</span> -->
                  <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('cnName')">
                    <template #content>admin</template>
                    <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'cnName')">管理员</div>
                  </el-tooltip>
                </el-form-item>
              </div>
            </div>
            <el-form class="infoForm" label-position="right" ref="dengmiQueryForm">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item :label="$t('header.infoDialog.org')">
                    <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('org')">
                      <template #content>上海剑阁信息技术有限公司吴江分公司</template>
                      <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'org')">
                        上海剑阁信息技术有限公司吴江分公司
                      </div>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$t('header.infoDialog.dept')">
                    <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('dept')">
                      <template #content>IT</template>
                      <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'dept')">IT</div>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$t('header.infoDialog.role')">
                    <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('role')">
                      <template #content>系统管理员</template>
                      <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'role')">系统管理员</div>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="IP:">
                    <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('ip')">
                      <template #content>192.168.1.2</template>
                      <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'ip')">192.168.1.2</div>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item :label="$t('header.infoDialog.tel')">
                    <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('tel')">
                      <template #content>021-33190456</template>
                      <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'tel')">021-33190456</div>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$t('header.infoDialog.email')">
                    <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('email')">
                      <template #content>2087764888@qq.com</template>
                      <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'email')">2087764888@qq.com</div>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$t('header.infoDialog.lastLoginTime')">
                    <el-tooltip placement="top" :open-delay="500" :disabled="getShowTooltip('lastLoginTime')">
                      <template #content>2012/02/13</template>
                      <div class="itemText slec" @mouseenter.self="isTextOverflowed($event, 'lastLoginTime')">2012/02/13</div>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item style="flex-wrap: nowrap">
                    <el-button type="primary" @click="openDialog('passwordRef')" size="small">
                      <el-icon class="passwordIcon"><Edit /></el-icon>{{ $t("header.infoDialog.uptPwd") }}
                    </el-button>
                    &nbsp;
                    <el-button type="primary" size="small" @click="logout">
                      <el-icon><SwitchButton /></el-icon>{{ $t("header.logout.name") }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </div>
    </el-popover>
  </div>

  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useGlobalStore } from "@/stores/modules/global";
import { useUserStore } from "@/stores/modules/user";
import { useIsTextOverFlowed } from "@/hooks/useIsTextOverFlowed";
import { useI18n } from "vue-i18n";
import { logoutApi } from "@/api/modules/login";
import { ElMessage, ElMessageBox } from "element-plus";
import PasswordDialog from "./PasswordDialog.vue";
import { useRouter } from "vue-router";
import { LOGIN_URL } from "@/config";

const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.isCollapse);
const userStore = useUserStore();
const router = useRouter();

const { getShowTooltip, isTextOverflowed } = useIsTextOverFlowed();
const { t } = useI18n();

//登录信息
const logInInfo: any = userStore.userInfo;

interface DialogExpose {
  openDialog: () => void;
}
const passwordRef = ref<null | DialogExpose>(null);
// 打开修改密码和个人信息弹窗
const openDialog = (refName: string) => {
  if (refName == "passwordRef") passwordRef.value?.openDialog();
};

// 退出登录
const logout = () => {
  ElMessageBox.confirm(t("header.logout.cofMes"), t("header.logout.tipMes"), {
    confirmButtonText: t("button.confirm"),
    cancelButtonText: t("button.cancel"),
    type: "warning"
  }).then(async () => {
    // 1.调用退出登录接口
    await logoutApi();
    console.log(11);
    // 2.清除 Token
    userStore.setToken("");

    // 4.重定向到登陆页
    router.replace(LOGIN_URL);
    ElMessage.success(t("header.logout.mesSuc"));
  });
};
defineExpose({
  openDialog
});
</script>

<style scoped lang="scss">
// :deep(.el-popover.el-popper) {
//   width: 100% !important;
// }
.el-button {
  margin-left: 21px;
  span {
    font-weight: bold;
    color: var(--el-color-primary);
  }
  .usernameIcon {
    padding: 0 0 0 5px;
  }
}
.userInfoDetails {
  padding: 20px;
  .card-title {
    margin-bottom: 30px;
    font-size: 16px;
    font-weight: bold;
    color: var(--el-color-primary);
  }
  .box-card {
    // height: 150px;
    margin-left: 10px;
    border-radius: 20px;
    .card-details {
      display: flex;
      align-items: center;
      .loginInfoBox {
        margin-right: 40px;
      }
      .infoForm {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;
        height: 145px;
      }
      .avatar {
        width: 60px;
        height: 60px;
        padding-right: 20px;
        overflow: hidden;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      div.itemText {
        max-width: 80px;
        color: var(--el-color-primary);
        white-space: pre-wrap;
      }
      .el-form {
        .el-form-item {
          margin-bottom: 0;
        }
        .itemIp {
          visibility: hidden;
        }
        div.itemText {
          max-width: 120px;
          color: var(--el-color-primary);
          white-space: pre-wrap;
        }
        .el-button {
          margin-left: 0;
          .el-icon {
            padding: 0 5px 0 0;
          }
        }
      }
    }
  }
}
</style>
