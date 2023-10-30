<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :border="false"
      :tool-button="false"
      :request-api="getMessageGenerateList"
      :init-param="initParam"
      :columns="columns"
      :table-loading="true"
    >
      <template #tableHeader>
        <el-button type="primary">一键生成</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="generateMessage">
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/modules/auth";
import { usePageStore } from "@/stores/modules/page";
import { onBeforeRouteLeave } from "vue-router";
import { getMessageGenerateList } from "@/api/modules/messageGenerate";
import ProTable from "@/components/ProTable/index.vue";
import { useRouter } from "vue-router";
import { ColumnProps } from "@/components/ProTable/interface";
import { MessageGenerate } from "@/api/interface";

// 表格配置项
const columns = reactive<ColumnProps<MessageGenerate.ResMessage>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "moduleName",
    label: "所属模块名称",
    width: "auto"
  },
  {
    prop: "formName",
    label: "表单名称",
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    prop: "dataDate",
    label: "数据日期",
    isShow: false,
    search: {
      el: "date-picker",
      props: { type: "date", valueFormat: "YYYY-MM-DD" }
    }
  },
  {
    prop: "notGenerateNumber",
    label: "未生成条数",
    render: scope => {
      return (
        <>
          <el-text class="mx-1 mouse-pointer" type="primary" onClick={() => goDetail("123", "0", "待提交")}>
            {scope.row.notGenerateNumber}
          </el-text>
        </>
      );
    }
  }
]);

//初始化请求数据
const initParam = reactive({});

//动态更改详情tag标题
const authStore = useAuthStore();
const pageStore = usePageStore();

onBeforeRouteLeave(to => {
  //处理跳转待提交/待审核/审核通过页面
  if (to.name === "fundsDetail") {
    to.meta.title = pageStore.getPageTabTitleName(to.name);
    authStore.updateMetaTitle(to.path, to.meta.title as string);
  }
});

const router = useRouter();
//生成报文详情页
const goDetail = (id: string, state: string, title: string) => {
  const query = { id, state };
  router.push({ name: "generMassageDetail", path: `/messageGenerate/generMassage/detail`, query });
};
</script>

<style lang="scss"></style>
