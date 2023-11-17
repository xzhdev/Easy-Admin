import { ElMessageBox, ElMessage, ElProgress } from "element-plus";
import { h, ref } from "vue";
import { usePolling } from "@/hooks/usePolling";

/**
 * @description 校验流程 数据校验数量确认 -> 展示校验进度 -> 展示校验结果
 * @param {Array} selectedList 校验的数据数组
 * */
export const useVerifyProcess = async (api: () => Promise<any>, selectedList: any[] = []) => {
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
        let processNum = 0; //后端返回进度
        let failure = false; //是否请求失败
        let errorCount = 0;
        const { cancel } = usePolling(api, {
          retryCount: 5,
          onSuccess: data => {
            console.log("onSuccess Data", data);
            if (!data) return;
            processNum = data;
            errorCount = 0;
            data === 100 && cancel();
          },
          onFailure: error => {
            if (errorCount >= 5) {
              failure = true;
              Promise.reject("校验连接失败，请检查!");
              ElMessageBox.close();
              ElMessage({
                type: "error",
                duration: 0,
                showClose: true,
                message: `校验连接失败，请检查!`
              });
              return;
            }
            ElMessage({
              type: "error",
              message: `校验连接中断，剩余${5 - errorCount}次重连，等待重连中...`
            });
            errorCount++;
            return;
          }
        });
        intervalTime = setInterval(() => {
          if (percentage.value === processNum) {
            if (failure) {
              failure = false;
              clearInterval(intervalTime as NodeJS.Timeout);
            }
            return;
          }
          percentage.value++;
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
