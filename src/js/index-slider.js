new fullpage('#fullPage', {
  autoScrolling: true,
  navigation: true,
  lazyLoading: true,
  navigationPosition: 'left',
});

let footer = document.querySelector('.footer');
let mainBtn = document.querySelector('.main-btn');

document.querySelector('#fullPage').addEventListener('wheel', function() {
  if (footer.classList.contains('active')) {
    mainBtn.classList.add('js-hide');
  } else {
    if (mainBtn.classList.contains('js-hide')) {
      mainBtn.classList.remove('js-hide');
    }
  }
});
