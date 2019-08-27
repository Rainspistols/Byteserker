"use strict";

const menu = {
  switchBrs(bar) {
    return bar.classList.toggle("change");
  },

  init() {
    const btn = document.querySelector(".main-btn");
    btn.addEventListener("click", evt => {
      this.switchBrs(evt.currentTarget);
    });
  }
};

document.addEventListener("DOMContentLoaded", function() {
  menu.init();
});
