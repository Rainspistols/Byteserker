const TypeWriter = function(text, selector, timer) {
  this.text = text;
  this.selector = selector;
  this.timer = parseInt(timer, 10);
  this.index = 0;
  this.type();
};

TypeWriter.prototype.type = function() {
  if (this.index < this.text.length) {
    this.selector.innerHTML += this.text.charAt(this.index);
    this.index++;
    setTimeout(() => this.type(), this.timer);
  }
};

function init() {
  const selector = document.querySelector('.swiper__slide1__text1');
  new TypeWriter('Hi', selector, 50);
}

document.addEventListener('DOMContentLoaded', init);
