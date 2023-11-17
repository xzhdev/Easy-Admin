import { ref } from "vue";

interface UsePollingOptions {
  interval?: number;
  retryCount?: number;
  retryInterval?: number;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
}
/**
 * usePolling是一个函数，它通过反复调用请求函数来实现轮询，直到达到最大尝试次数为止。它返回轮询的数据和一个取消函数来停止轮询。
 * @param {() => Promise<any>} requestFn - 用于获取数据的函数。
 * @param {UsePollingOptions} options - 可选的对象，可以包含以下属性：
 *   - interval: 每次请求之间的时间间隔（以毫秒为单位）。默认为1000。
 *   - retryCount: 错误重连次数。当重连次数达到此值时，轮询将停止。默认为-1（无限次数）。
 *   - retryInterval: 重试时间间隔，单位为毫秒;如果不设置，默认采用简易的指数退避算法，取 1000 * 2 ** retryCount，也就是第一次重试等待 2s，第二次重试等待 4s，以此类推，如果大于 30s，则取 30s
 *   - onSuccess: 在成功请求时将调用的回调函数，将传入轮询的数据。
 *   - onFailure: 在请求失败时将调用的回调函数，将传入错误信息。
 * @return {{ data: Ref<any>, cancel: () => void }} - 包含轮询的数据和一个取消函数来停止轮询的对象。
 */
export function usePolling(requestFn: () => Promise<any>, options: UsePollingOptions = {}) {
  const data = ref(null);
  const attempts = ref(0);
  let pollingTimer: NodeJS.Timeout | null = null;

  const { interval = 1000, retryCount = -1, retryInterval, onSuccess, onFailure } = options;

  const calculateRetryDelay = () => {
    if (retryInterval !== undefined) {
      return retryInterval;
    } else {
      const defaultRetryDelay = Math.min(1000 * 2 ** attempts.value, 30000); // 默认最大 30s
      return defaultRetryDelay;
    }
  };

  const poll = async () => {
    try {
      data.value = await requestFn();
      console.log("data.value ", data.value);
      onSuccess && onSuccess(data.value);
      attempts.value = 0;
    } catch (error) {
      attempts.value += 1;
      onFailure && onFailure(error);
    } finally {
      if ((retryCount === -1 || attempts.value <= retryCount) && pollingTimer) {
        console.log(`第${attempts.value}次重试，共${retryCount}次重试机会！`);
        startPolling();
      } else {
        attempts.value = 0;
        data.value = null;
      }
    }
  };

  const startPolling = () => {
    const delay = attempts.value === 0 ? interval : calculateRetryDelay(); // 如果是第一次重试，则使用 interval
    console.log("delay时间", delay);
    pollingTimer = setTimeout(poll, delay);
  };

  const cancel = () => {
    console.log("cancel");
    if (pollingTimer) {
      clearTimeout(pollingTimer);
      pollingTimer = null;
    }
  };

  startPolling(); // 直接开始轮询

  return { data, cancel };
}
