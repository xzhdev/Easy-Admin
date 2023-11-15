<template>
  <div class="runbatch-box">
    <div class="card search">
      <div class="header-button-lf">
        <el-button type="primary" @click="openRunBatchDialog($t('button.add'))">{{ $t("button.add") }}</el-button>
      </div>
      <div class="header-button-ri">
        <el-form :inline="true">
          <el-form-item label="报表名称：">
            <el-select v-model="_searchParam.reportName" class="m-2" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务名称：">
            <el-input v-model="_searchParam.taskName" placeholder="请输入" />
          </el-form-item>
          <el-button type="primary" @click="search"> 搜索 </el-button>
          <el-button @click="reset"> 重置 </el-button>
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
            :request-api="getTaskRunBatch"
            :columns="columns_task"
            :table-loading="true"
          >
          </ProTable>
        </div>
        <!-- 拖拽拉伸 @mousedown="dragControllerDiv($event, taskCard)" -->
        <div class="stretch">
          <More />
          <span class="caret-wrapper">
            <i class="sort-caret ascending" name="ascending" @mousedown="stretch($event, taskCard)"></i>
            <i class="sort-caret descending" name="descending" @mousedown="stretch($event, taskCard)"></i>
          </span>
        </div>
      </el-card>
      <el-card class="box-card" ref="logCard" name="logCard" style="height: 500px">
        <template #header>
          <div class="card-header"><span class="card-title"></span> <span class="card-text">日志</span></div>
        </template>
        <div class="table-box">
          <ProTable
            ref="proTableLog"
            :border="false"
            :tool-button="false"
            :request-api="getLogRunBatch"
            :columns="columns_log"
            :table-loading="true"
          >
          </ProTable>
        </div>
        <div class="stretch">
          <More />
          <span class="caret-wrapper">
            <i class="sort-caret ascending" name="ascending" @mousedown="stretch($event, logCard)"></i>
            <i class="sort-caret descending" name="descending" @mousedown="stretch($event, logCard)"></i>
          </span>
        </div>
      </el-card>
    </div>
    <RunBatchInfo v-if="runBatchVisible" v-model:runBatchVisible="runBatchVisible" ref="runBatchInfo"></RunBatchInfo>
  </div>
</template>

<script setup lang="tsx" name="runBatch">
import ProTable from "@/components/ProTable/index.vue";
import RunBatchInfo from "./components/runBatchInfo.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { RunBatch } from "@/api/interface";
import { addTaskRunBatch, editTaskRunBatch, getTaskRunBatch, getLogRunBatch } from "@/api/modules/runBatch";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { ElCard, ElMessage } from "element-plus";
import { More } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface SearchForm {
  reportName: string;
  taskName: string;
}

const _searchParam = ref<SearchForm>({
  reportName: "",
  taskName: ""
});

//控制新增/编辑弹窗是否显示
const runBatchVisible = ref(false);

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
          <el-button link type="primary" onClick={() => openRunBatchDialog(t("button.edit"), scope.row)}>
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
    row: { ...row },
    api: title === t("button.add") ? addTaskRunBatch : title === t("button.edit") ? editTaskRunBatch : undefined,
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

//拖动控制拉伸
const dragControllerDiv = async (event: MouseEvent, card: InstanceType<typeof ElCard>) => {
  if (!card) return;
  //获取card 名称
  const cardDom = card.$el;
  const cardName = cardDom.getAttribute("name");
  // const cardRect = cardDom.getBoundingClientRect();
  //获取目标元素
  const height = Number(cardDom.style.height.replace("px", "")); //去除height 的px
  offsetY.value = event.clientY;
  // 设置样式
  // 获取或创建一个样式表
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement("style")).sheet;
  // 定义要添加的样式规则
  const rule = "* { cursor: row-resize;pointer-events: none !important; user-select: none !important;}";
  // 添加样式规则到样式表
  const ruleIndex = styleSheet.insertRule(rule, styleSheet.cssRules.length);
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
    //移除样式
    styleSheet.deleteRule(ruleIndex);
  };
};

//点击控制拉伸
const stretch = (e: MouseEvent, card: InstanceType<typeof ElCard>) => {
  //获取节点名称
  const targetName = (e.target as HTMLElement).getAttribute("name") as string;
  //给父节点设置class
  const caretWrapper = (e.target as HTMLElement).parentElement as HTMLElement;
  // 设置超出范围样式
  // 获取或创建一个样式表
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement("style")).sheet;
  // 定义要添加的样式规则
  const rule = `* { cursor:${
    targetName === "ascending" ? "n-resize" : "s-resize"
  };pointer-events: none !important; user-select: none !important;}`;
  // 添加样式规则到样式表
  const ruleIndex = styleSheet.insertRule(rule, styleSheet.cssRules.length);

  caretWrapper.classList.add(targetName);
  let step = targetName === "ascending" ? -1 : 1; //步长 1 px
  const mainDom = document.querySelector(".el-main") as HTMLElement;
  //持续增加高度
  const adjustHeight = async () => {
    const cardDom = card.$el;
    //去除height 的 px单位
    const height = Number(cardDom.style.height.replace("px", ""));
    if (height + step <= 500) return ElMessage.warning("已达到最小高度！");
    cancelAnimationFrame(animationFrameId as number);
    setTimeout(() => {
      //加延时，防止卡顿
      cardDom.style.height = `${step + height}px`;
    }, 10);
    await nextTick();
    let stepNegate = targetName === "ascending" ? 1 : -1;
    setTimeout(() => {
      //加延时，防止卡顿
      //el-main页面也跟随滚动
      mainDom && (mainDom.scrollTop = mainDom.scrollTop + stepNegate);
    }, 10);
    animationFrameId = requestAnimationFrame(adjustHeight);
  };
  animationFrameId = requestAnimationFrame(adjustHeight);

  document.onmouseup = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    styleSheet.deleteRule(ruleIndex);
    caretWrapper.classList.remove(targetName);
    document.onmouseup = null;
    cancelAnimationFrame(animationFrameId as number);
    //进行垃圾回收
    if (typeof window !== "undefined") {
      window.gc && window.gc();
    }
  };
};

// 查询
const search = () => {
  proTableTask.value!.searchParam = _searchParam.value;
  proTableTask.value?.search();
};
// 重置
const reset = () => {
  _searchParam.value = {
    reportName: "",
    taskName: ""
  };
  proTableTask.value?.reset();
  proTableLog.value?.reset();
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
  .el-card {
    overflow: unset;
  }

  // .box-card {
  //   transition: height 0.1s;
  // }
  /* stylelint-disable-next-line scss/double-slash-comment-whitespace-inside */
  //选择非最后一个box-card
  .box-card:not(:last-child) {
    margin-bottom: 10px;
  }
  :deep(.el-card) {
    display: flex;
    flex-direction: column;
    .el-card__body {
      position: relative;
      display: flex;
      flex: 1;
      flex-direction: column;

      // 上下内边距20px card__header 40.5px
      height: calc(100% - 40px - 40.5px);
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
  position: absolute;
  bottom: 0;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 5px;
  font-size: 14px;
  line-height: 0;
  color: white;
  background-color: #d6d6d6;
  background-position: center;
  background-size: cover;
  border-radius: 5px;

  // &:hover {
  //   cursor: row-resize;
  // }
  svg {
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentcolor;
  }
}
.stretch:hover .caret-wrapper {
  visibility: visible;
}
.caret-wrapper {
  position: absolute;
  top: -11px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 30px;
  height: 29px;
  overflow: initial;
  vertical-align: middle;
  cursor: pointer;
  visibility: hidden;
  .sort-caret {
    position: absolute;
    left: 7px;
    width: 0;
    height: 0;
    border: solid 8px transparent;
  }
  .sort-caret.ascending {
    top: -5px;
    border-bottom-color: var(--el-text-color-placeholder);
    &:hover {
      border-bottom-color: var(--el-color-primary);
    }
  }
  .sort-caret.descending {
    bottom: -3px;
    border-top-color: var(--el-text-color-placeholder);
    &:hover {
      border-top-color: var(--el-color-primary);
    }
  }
}
.ascending .sort-caret.ascending {
  border-bottom-color: var(--el-color-primary);
}
.descending .sort-caret.descending {
  border-top-color: var(--el-color-primary);
}
</style>
