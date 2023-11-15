import { ElMessageBox, ElMessage, ElProgress } from "element-plus";
import { h, nextTick, ref } from "vue";

/**
 * @description 校验流程 数据校验数量确认 -> 展示校验进度 -> 展示校验结果
 * @param {Array} selectedList 校验的数据数组
 * */
export const useVerifyProcess = async (selectedList: any[] = []) => {
  ElMessageBox.confirm(
    selectedList.length > 0 ? `确认校验${selectedList.length}条数据吗？` : "确认校验全部数据吗？",
    "数据校验",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      showClose: false,
      type: "warning"
    }
  )
    .then(() => {
      try {
        const percentage = ref(0);
        let intervalTime: null | NodeJS.Timeout = null;
        ElMessageBox({
          title: "校验进度",
          showConfirmButton: false,
          showClose: false,
          closeOnClickModal: false,
          message: () =>
            h(ElProgress, {
              striped: true, //条纹
              stripedFlow: true, //流动
              strokeWidth: 20, //宽度
              textInside: true, //行内
              percentage: percentage.value
            })
        });
        intervalTime = setInterval(() => {
          percentage.value++;
          // if (percentage.value === 20) {
          //   Promise.reject("校验意外退出");
          //   ElMessageBox.close();
          //   clearInterval(intervalTime as NodeJS.Timeout);
          //   return ElMessage({
          //     type: "error",
          //     message: "校验意外退出"
          //   });
          // }
          if (percentage.value === 100) {
            clearInterval(intervalTime as NodeJS.Timeout);
            ElMessageBox.close();
            ElMessageBox.confirm("校验成功10条；校验失败1条", "数据校验完成", {
              confirmButtonText: "确认",
              showCancelButton: false,
              closeOnClickModal: false,
              showClose: false,
              type: "success"
            });
          }
        }, 100);
      } catch (error) {
        console.log(error);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消校验操作"
      });
    });
};
