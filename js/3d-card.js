import throttle from "../node_modules/lodash-es/throttle.js";

/** */
const cards = document.getElementsByClassName("card");

/** 3D TILT TO A ELEMENT */
function tilt(el, x, y) {
  const box = el.getBoundingClientRect();
  const limit = 15;

  const calcX = -(y - box.y - box.height / 2) / limit;
  const calcY = (x - box.x - box.width / 2) / limit;

  el.style.transform = `rotateX(${calcX}deg) rotateY(${calcY}deg)`;
}

for (const card of cards)
{
  card.addEventListener(
    "mousemove",
    throttle(function(event) {
      const { x, y } = event;
  
      window.requestAnimationFrame(() => tilt(this, x, y));
    }, 50)
  );

  card.addEventListener("mouseleave", function() {
    setTimeout(() => this.style.transform = `rotateX(0) rotateY(0)`, 150);
  });
}