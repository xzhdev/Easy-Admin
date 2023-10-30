<template>
  <div class="runbatch-box">
    <div class="card search">
      <div class="header-button-lf"><el-button type="primary" @click="openRunBatchDialog('新增')">新增</el-button></div>
      <div class="header-button-ri">
        <el-form :inline="true">
          <el-form-item label="报表名称：">
            <el-select v-model="value" class="m-2" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务名称：">
            <el-input v-model="value" placeholder="请输入" />
          </el-form-item>
          <el-button type="primary"> 搜索 </el-button>
          <el-button> 重置 </el-button>
        </el-form>
      </div>
    </div>
    <div class="card-box">
      <el-card class="box-card" ref="taskCard" name="taskCard" style="height: 500px">
        <template #header>
          <div class="card-header"><span class="card-title"></span> <span class="card-text">任务列表</span></div>
        </template>
        <div class="table-box">
          <ProTable
            ref="proTableTask"
            :border="false"
            :tool-button="false"
            :data="[]"
            :columns="columns_task"
            :table-loading="true"
          >
          </ProTable>
        </div>
        <div class="stretch" @mousedown="dragControllerDiv($event, taskCard)"></div>
      </el-card>
      <el-card class="box-card" ref="logCard" name="logCard" style="height: 500px">
        <div class="stretch" @mousedown="dragControllerDiv($event, logCard)" style="top: -61px"></div>
        <template #header>
          <div class="card-header"><span class="card-title"></span> <span class="card-text">日志</span></div>
        </template>
        <div class="table-box">
          <ProTable
            ref="proTableLog"
            :border="false"
            :tool-button="false"
            :data="[]"
            :columns="columns_log"
            :table-loading="true"
          >
          </ProTable>
        </div>
      </el-card>
    </div>
    <RunBatchInfo v-if="runBatchVisible" v-model:runBatchVisible="runBatchVisible" ref="runBatchInfo"></RunBatchInfo>
  </div>
</template>

<script setup lang="tsx" name="runBatch">
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { RunBatch } from "@/api/interface";
import RunBatchInfo from "./components/runBatchInfo.vue";
import { addTaskRunBatch, editTaskRunBatch } from "@/api/modules/runBatch";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { ElCard } from "element-plus";

const top = ref(100);
const bottom = ref(150);
const stretchValue = computed(() => {
  return {
    top: top.value,
    bottom: bottom.value
  };
});

//控制新增/编辑弹窗是否显示
const runBatchVisible = ref(false);

const value = ref("");

const options = [
  {
    value: "Option1",
    label: "Option1"
  },
  {
    value: "Option2",
    label: "Option2"
  },
  {
    value: "Option3",
    label: "Option3"
  },
  {
    value: "Option4",
    label: "Option4"
  },
  {
    value: "Option5",
    label: "Option5"
  }
];
// 任务表格配置项
const columns_task = reactive<ColumnProps<RunBatch.ResTaskList>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "reportName",
    label: "报表名称"
  },
  {
    prop: "taskName",
    label: "任务名称"
  },
  { type: "expand", prop: "taskDescription", label: "任务说明", width: 85 },
  {
    prop: "taskFilePath",
    label: "任务文件路径",
    minWidth: 200
  },
  {
    prop: "remark",
    label: "备注"
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 150,
    render: scope => {
      return (
        <>
          <el-button link type="primary">
            跑批
          </el-button>
          <el-button link type="primary">
            编辑
          </el-button>
          <el-button link type="primary">
            删除
          </el-button>
        </>
      );
    }
  }
]);
// 日志表格配置项
const columns_log = reactive<ColumnProps<RunBatch.ResLogList>[]>([
  { type: "index", label: "序号", width: 80 },
  {
    prop: "taskName",
    label: "任务名称"
  },
  {
    prop: "startTime",
    label: "开始时间"
  },
  {
    prop: "taskStatus",
    label: "任务状态"
  },
  {
    prop: "endTime",
    label: "结束时间",
    minWidth: 200
  }
]);

// 任务列表实例
const proTableTask = ref<InstanceType<typeof ProTable> | null>(null);
// 日志列表实例
const proTableLog = ref<InstanceType<typeof ProTable> | null>(null);

// 打开 runBatchDialog(新增、查看、编辑)
const runBatchInfo = ref<InstanceType<typeof RunBatchInfo> | null>(null);
const openRunBatchDialog = async (title: string, row: Partial<RunBatch.ResTaskList> = {}) => {
  const params = {
    title,
    isView: title === "新增",
    row: { ...row },
    api: title === "新增" ? addTaskRunBatch : title === "编辑" ? editTaskRunBatch : undefined,
    getTableList: proTableTask.value?.getTableList
  };
  runBatchVisible.value = true;
  await nextTick();
  runBatchInfo.value?.acceptParams(params);
};

const taskCard = ref();
const logCard = ref();
//记录鼠标初始Y坐标
const offsetY = ref(0);
let animationFrameId: number | null = null;

const dragControllerDiv = async (event: MouseEvent, card: InstanceType<typeof ElCard>) => {
  if (!card) return;
  //获取card 名称
  const cardDom = card.$el;
  const cardName = cardDom.getAttribute("name");
  // const cardRect = cardDom.getBoundingClientRect();
  //获取目标元素
  const height = Number(cardDom.style.height.replace("px", ""));
  //去除height 的px
  offsetY.value = event.clientY;
  // 添加mousemove事件监听器到document
  document.onmousemove = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    //计算鼠标Y坐标移动距离
    let moveY = event.clientY - offsetY.value;
    //moveY 取反
    cardName === "logCard" && (moveY = -moveY);
    //最小高度 500
    if (moveY + height <= 500) return;
    cancelAnimationFrame(animationFrameId as number);
    animationFrameId = requestAnimationFrame(() => {
      cardDom.style.height = `${moveY + height}px`;
    });
  };
  document.onmouseup = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    cancelAnimationFrame(animationFrameId as number);
    document.onmousemove = null;
    document.onmouseup = null;
    animationFrameId = null;
  };
};
</script>

<style lang="scss" scoped>
.runbatch-box {
  .search {
    margin-bottom: 10px;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-button {
      margin-bottom: 0;
    }
  }
}
.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  .card-title {
    display: inline-block;
    width: 4px;
    height: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: #333333;
    text-align: left;
    text-transform: none;
    letter-spacing: normal;
    background: inherit;
    background-color: rgb(38 111 232 / 100%);
    border: none;
    border-width: 0;
    border-radius: 4px;
    box-shadow: none;
  }
  .card-text {
    padding-left: 10px;
  }
}
.card-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .box-card {
    transition: height 0.1s;
  }
  /* stylelint-disable-next-line scss/double-slash-comment-whitespace-inside */
  //选择非最后一个box-card
  .box-card:not(:last-child) {
    margin-bottom: 10px;
  }
  :deep(.el-card) {
    display: flex;
    flex-direction: column;
    .el-card__body {
      flex: 1;
    }
  }
  :deep(.el-card__header) {
    padding-bottom: unset;
    border-bottom: unset;
  }
}

// 表格 header 样式
.header-button-lf {
  float: left;
}
.header-button-ri {
  float: right;
}
.el-button {
  margin-bottom: 15px;
}
.stretch {
  position: relative;
  top: 15px;
  left: 50%;
  width: 50px;
  height: 5px;
  font-size: 32px;
  color: white;
  cursor: row-resize;
  background-color: #d6d6d6;
  background-position: center;
  background-size: cover;
  border-radius: 5px;
  &:hover {
    color: #444444;
  }
}
</style>
