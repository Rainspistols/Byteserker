'use strict';

// Переключение на крестик
const menu = {
  switchBrs(evt) {
    return evt.currentTarget.classList.toggle('change');
  },
  openMenu() {
    const menu = document.querySelector('.menu');
    const body = document.querySelector('body');
    menu.classList.toggle('menu__active-js');
    body.classList.toggle('js-overflow-hidden');
  },

  init() {
    const btn = document.querySelector('.main-btn');
    btn.addEventListener('click', (evt) => {
      this.switchBrs(evt);
      this.openMenu();
    });
  },
};

document.addEventListener('DOMContentLoaded', function() {
  menu.init();
});
