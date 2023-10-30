<template>
  <div class="main-box">
    <TreeFilter
      ref="treeFilter"
      id="businessId"
      title="业务类型"
      label="businessName"
      children="subBusiness"
      :data="treeBusinessData"
      @change="changeTreeFilter"
    >
      <template #title>
        <div>{{ "业务类型" }}</div>
      </template>
    </TreeFilter>
    <div class="table-box">
      <ProTable
        ref="proTable"
        :columns="columns"
        :tool-button="false"
        :request-api="getVerifyRuleList"
        :request-auto="false"
        :table-loading="true"
        :init-param="initParam"
      >
        <template #titleHeader>
          <div class="tableTitle">{{ "校验规则配置" }}</div>
        </template>
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="ts" name="verifyRuleSet">
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { getBusinessList } from "@/api/modules/commen";
import { getVerifyRuleList } from "@/api/modules/verifyRule";
import { onMounted, reactive, ref } from "vue";
import { Commen } from "@/api/interface";
import { VerifyRule } from "@/api/interface";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Menu, Position } from "@element-plus/icons-vue";

onMounted(() => {
  getTreeFilter();
});

interface InitParam {
  businessId: string | number;
}
//初始化请求数据

const initParam = reactive<InitParam>({ businessId: "" });
//树形筛选数据
const treeFilter = ref();
const treeBusinessData = ref<Commen.Business.ResBusiness[]>([]);
const getTreeFilter = async () => {
  const { data } = await getBusinessList();
  treeBusinessData.value = data.list;
  initParam.businessId = treeBusinessData.value[0].businessId;
  treeFilter.value.$nextTick(() => {
    const elTree = treeFilter.value.treeRef;
    elTree.setCurrentKey(treeBusinessData.value[0].businessId);
  });
};
// 树形筛选切换
const proTable = ref<ProTableInstance>();
const changeTreeFilter = (val: string) => {
  console.log(val);
  proTable.value!.pageable.pageNum = 1;
  initParam.businessId = val;
};
// 表格配置项
const columns = reactive<ColumnProps<VerifyRule.ResVerifyRule>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "ruleField",
    label: "规则字段"
  },
  {
    prop: "ruleField_1",
    label: "规则字段1"
  },
  {
    prop: "ruleField_2",
    label: "规则字段2"
  },
  {
    prop: "ruleField_3",
    label: "规则字段3"
  },
  {
    prop: "ruleField_4",
    label: "规则字段4"
  },
  {
    prop: "ruleField_5",
    label: "规则字段5"
  },
  {
    prop: "effective",
    label: "是否生效"
  }
]);
</script>

<style lang="scss" scoped>
.tableTitle {
  margin: 0 0 15px;
  font-size: 18px;
  font-weight: bold;
  color: var(--el-color-info-dark-2);
  letter-spacing: 0.5px;
}
</style>
