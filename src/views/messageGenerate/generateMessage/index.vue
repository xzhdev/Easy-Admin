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
import { usePageStore } from "@/stores/modules/page";
import { getMessageGenerateList } from "@/api/modules/messageGenerate";
import { useRouter } from "vue-router";
import { ColumnProps } from "@/components/ProTable/interface";
import { MessageGenerate } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";

// 表格配置项
const columns = reactive<ColumnProps<MessageGenerate.ResMessage>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "moduleName",
    label: "所属模块名称"
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
          <el-button link type="primary" onClick={() => goDetail("123", "0", "待提交")}>
            {scope.row.notGenerateNumber}
          </el-button>
        </>
      );
    }
  }
]);

//初始化请求数据
const initParam = reactive({});

const router = useRouter();
const pageStore = usePageStore();

//生成报文详情页
const goDetail = (id: string, state: string, title: string) => {
  const query = { id, state };
  pageStore.setPageBackName("generMassageDetail", "/messageGenerate/generateMessage");
  router.push({ name: "generMassageDetail", path: `/messageGenerate/generMassage/detail`, query });
};
</script>

<style lang="scss" scoped></style>
