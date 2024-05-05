const navigationHeight = document.querySelector('.navigation').offsetHeight;

//console.log(document.documentElement);

document.documentElement.style.setProperty('--scroll-padding', navigationHeight + "px");