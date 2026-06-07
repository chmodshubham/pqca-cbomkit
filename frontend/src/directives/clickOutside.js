export const clickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => {
      if (!el.contains(e.target)) binding.value(e);
    };
    document.addEventListener("mousedown", el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener("mousedown", el._clickOutside);
  },
};
