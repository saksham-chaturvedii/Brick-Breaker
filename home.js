var auds = document.getElementById("audio");
var button = document.querySelector(".pause");
var icon = document.querySelector(".fa-volume-up");
let levelElems = document.querySelectorAll(".level");

window.onload = () => {
  auds.play();
  auds.volume = 0.7;
};

let gameLevel = "";

levelElems.forEach((level) => {
  level.addEventListener("click", () => {
    gameLevel = level.childNodes[1].innerText;
    localStorage.setItem("level", gameLevel);
  });
});

button.addEventListener("click", () => {
  if (icon.classList.contains("fa-volume-up")) {
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-mute");
  } else {
    icon.classList.remove("fa-volume-mute");
    icon.classList.add("fa-volume-up");
  }
  return auds.paused ? auds.play() : auds.pause();
});
