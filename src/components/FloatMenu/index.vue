<template>
  <div ref="floatingBall" class="float-ball-wrapper" :style="style">
    <!-- 悬浮球样式头 -->
    <div
      ref="floatHead"
      tabindex="0"
      :class="['float-head', { 'menu-active': menuActive }]"
      @mousedown.stop.prevent="handleDragStart"
      @click.stop.prevent="toggleMenu"
    >
      <span class="float-head-icon">
        <slot name="icon" />
        <slot />
        <MenuIcon v-if="slotsEmpty" />
      </span>
    </div>
    <!-- 菜单容器 -->
    <div ref="menuContainer" draggable="false" :class="[{ 'menu-active': menuActive }, 'menu-container']" :style="menuCSS || {}">
      <!-- <span class="close-btn" @mousedown.stop.prevent="handleMenuClose()">
        <XIcon />
      </span> -->
      <MenuComponent
        v-if="menuActive"
        :data="menuData"
        :flip="flipMenu"
        :on-selection="handleMenuItemSelection"
        :theme="theme"
        :on-close="handleMenuClose"
        :menu-style="menuStyle"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </MenuComponent>
    </div>
  </div>
</template>

<script setup lang="ts" name="floatMenu">
import { PropType, onMounted, onUnmounted } from "vue";
import { MenuItem, Theme, ThemeDefault } from "./types";
import { useSlots, computed, ref } from "vue";
import MenuIcon from "./icons/MenuIcon.vue";
import utils from "./utils";
import MenuComponent from "./Menu.vue";

const props = defineProps({
  menuData: {
    type: Array as PropType<MenuItem[]>,
    default: () => []
  },
  onSelected: {
    type: Function as PropType<(val: string) => void>,
    default: null
  },
  theme: {
    type: Object as PropType<Theme>,
    required: false,
    default: ThemeDefault
  },
  menuStyle: {
    type: String,
    default: "slide-out",
    required: false
  },
  dimension: {
    type: Number,
    default: 45
  },
  menuDimension: {
    type: Object as PropType<{ height: number; width: number }>,
    default: () => {
      return { height: 250, width: 250 };
    }
  },
  // 翻转屏幕右边缘的菜单内容
  flipOnEdges: {
    type: Boolean,
    default: false
  }
});
const style = computed(() => {
  return {
    width: `${props.dimension}px`,
    height: `${props.dimension}px`
  };
});

const slots = useSlots();
const slotsEmpty = computed(() => !Object.keys(slots).length);
const floatingBall = ref();
const isDragging = ref(false);
const isRevealing = ref(false);
let offsetX = 0;
let offsetY = 0;

let lastMoveIndex = 0; //  拖拽计数
let curMoveIndex = 0; //  历史计数

let animationFrameId: number | null = null;

//点击悬浮球外关闭菜单
const floatHead = ref();
const handleMenuClose = (event: MouseEvent) => {
  if (!floatHead.value) return;
  let tDom = event.target;
  if (floatHead.value !== tDom && !floatHead.value.contains(tDom)) {
    closeMenuAndFloating();
  }
};

onMounted(() => {
  onWindowResize();
  document.addEventListener("click", handleMenuClose);
  window.addEventListener("resize", onWindowResize);
}),
  onUnmounted(() => {
    document.removeEventListener("click", handleMenuClose);
    window.removeEventListener("resize", onWindowResize);
    animationFrameId = null;
  });

const onWindowResize = () => {
  const intialStyle = utils.setupInitStyle("bottom left", props.dimension);
  menuActive.value = false;
  animationFrameId = requestAnimationFrame(() => {
    floatingBall.value.style.left = intialStyle.left;
    floatingBall.value.style.top = intialStyle.top;
  });
};

const closeMenuAndFloating = () => {
  menuActive.value = false;
  snapToEdges();
};
const handleDragStart = (event: MouseEvent) => {
  isDragging.value = true;
  const ballRect = floatingBall.value.getBoundingClientRect();
  offsetX = event.clientX - ballRect.left;
  offsetY = event.clientY - ballRect.top;

  // 添加mousemove事件监听器到document
  document.onmousemove = handleDragMove;
  document.onmouseup = handleDragEnd;
};

const handleDragEnd = () => {
  console.log("抬起");
  setTimeout(() => {
    curMoveIndex = lastMoveIndex;
  }, 0);
  console.log("结束拖拽<onmouseup>");
  document.onmousemove = null;
  document.onmouseup = null;
  isDragging.value = false;
  snapToEdges();
};

const handleDragMove = (event: MouseEvent) => {
  setTimeout(() => {
    if (isDragging.value) {
      menuActive.value = false;
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;
      animationFrameId = requestAnimationFrame(() => {
        floatingBall.value.style.left = `${x > 15 ? x : 15}px`;
        floatingBall.value.style.top = `${
          y > 0 && y < window.innerHeight - props.dimension ? y : y < 0 ? 0 : y - props.dimension
        }px`;
      });
      console.log("拖拽中");
      lastMoveIndex++;
    }
  }, 100);
};

const snapToEdges = () => {
  const ball = floatingBall.value;
  const screenWidth = window.innerWidth;
  const ballWidth = ball.offsetWidth;

  let targetX: number;

  if (ball.offsetLeft + ballWidth / 2 < screenWidth / 2) {
    // 吸附到屏幕左侧
    targetX = 15;
  } else {
    // 吸附到屏幕右侧
    targetX = screenWidth - ballWidth - 15;
  }

  let currentX = ball.offsetLeft;
  const step = 15; // 移动的步长

  const animate = () => {
    if (currentX < targetX - step) {
      currentX += step;
      ball.style.left = currentX + "px";
      animationFrameId = requestAnimationFrame(animate);
    } else if (currentX > targetX + step) {
      currentX -= step;
      ball.style.left = currentX + "px";
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // 动画完成后将位置精确设置为目标位置
      ball.style.left = targetX + "px";
      animationFrameId = null;
    }
  };
  animate();
};

/** 菜单 */
const menuActive = ref(false); // 是否显示菜单
const menuCSS = ref<{ "min-height": string; width: string } | null>(null); // 菜单样式
const menuOrientation = ref("top"); // 菜单方向
const flipMenu = ref(false); //翻转菜单内容

//打开菜单
const toggleMenu = () => {
  console.log("点击", lastMoveIndex, curMoveIndex);
  if (lastMoveIndex !== curMoveIndex) return (curMoveIndex = lastMoveIndex);
  console.log("打开/关闭菜单");
  menuActive.value = !menuActive.value;
  setupMenuOrientation();
  adjustFloatMenuPosition();
};

const menuContainer = ref();
// 管理選單的方向（頂部或底部）
// 當頂部或底部沒有足夠的可用空間時，功能表會自動翻轉
const setupMenuOrientation = () => {
  const menuContDOM = menuContainer.value;
  const menuHeadDOM = floatingBall.value;
  const { dimension } = props;
  if (!menuContDOM || !menuHeadDOM) {
    return;
  }
  const newStyle = utils.setupMenuOrientation(menuHeadDOM, menuContDOM, dimension, props.menuDimension);
  menuOrientation.value = newStyle.newOrientation;
  menuCSS.value = newStyle;
};
//

// 管理菜单头的位置。确保菜单保持在屏幕边界内
const adjustFloatMenuPosition = () => {
  if (!floatingBall.value) return;
  const positionRef = {
    left: floatingBall.value.style.left,
    top: floatingBall.value.style.top
  };
  if (menuContainer.value) {
    const newPosition = utils.setupMenuPosition(floatHead.value, positionRef, props.flipOnEdges, menuContainer.value);
    flipMenu.value = newPosition.flip;
    isRevealing.value = newPosition.reveal;

    if (newPosition.position) {
      const { left, top } = newPosition.position;
      requestAnimationFrame(() => {
        floatingBall.value.style.left = `${left}px`;
        floatingBall.value.style.top = `${top}px`;
      });
    }
  }
};
//选中事件
const handleMenuItemSelection = (name: string) => {
  //菜单状态置为关闭
  menuActive.value = false;
  snapToEdges();
  if (props.onSelected) {
    props.onSelected(name);
  }
};
</script>

<style lang="scss" scoped src="./scss/index.scss"></style>
