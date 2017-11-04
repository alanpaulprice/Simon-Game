/* jshint esversion: 6 */

/*
- presented with sequence of random button presses
- unique sounds correspond to buttons
- each new sequence is a continuation of previous
- sounds play when showing sequence and when user pushes
- notified if wrong button is pushed, sequence restarts, compu shows it again too
- display shows how many steps are in current sequence
- button to restart whole game
- optional strict mode, mistake = restart whole game
- can win game by reaching 20 steps, notified of victory, reset game

- 4 main btns, count dsply, start btn, restart btn, strict btn,

fa-times-circle, fa-check-circle
*/

//TODO: make basic layout, use math random to choose a random btn

document.addEventListener('DOMContentLoaded', function() {
  console.clear();

  let startBtn = document.getElementById("start-btn");
  let resetBtn = document.getElementById("reset-btn");
  let strictBtn = document.getElementById("strict-btn");
  let stepsReadout = document.getElementById("steps-readout");
  let mainBtn1 = document.getElementById("main-btn-1");
  let mainBtn2 = document.getElementById("main-btn-2");
  let mainBtn3 = document.getElementById("main-btn-3");
  let mainBtn4 = document.getElementById("main-btn-4");
  let sequence = [];
  let strictModeEngaged = false;

  mainBtn1.onclick = () => {
    console.log("btn1");
  }

}); /* dom content loaded */
