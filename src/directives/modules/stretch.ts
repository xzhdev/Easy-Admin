/**
 * v-stretch
 *
 */
import type { Directive, DirectiveBinding } from "vue";

const stretch: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.onmousedown = function (e) {
      el.style.top = "-100px";
      const parent = el.parentNode as HTMLElement;
      const disy = e.clientY - parent.offsetTop;
      const minTop = binding.value.top;
      const maxTop = window.innerHeight - binding.value.bottom;
      el.style.top = "-100px";
      el.style.height = "130px";
      document.onmousemove = function (e) {
        let top = e.clientY - disy;
        if (!top || top < 0) {
          return;
        }
        if (top <= minTop) {
          top = minTop;
        } else if (top >= maxTop) {
          top = maxTop;
        }
        parent.style.top = top + "px";
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
        el.style.top = "-1px";
        el.style.height = "3px";
      };
    };
  }
};

export default stretch;
