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

fa-times-circle, fa-check-circle
*/

//TODO: make the play sequence function work

document.addEventListener('DOMContentLoaded', function() {
  console.clear();

  let startResetBtn = document.getElementById("start-reset-btn");
  let strictBtn = document.getElementById("strict-btn");
  let strictBtnIcon = document.getElementById("strict-btn-icon");
  let stepsReadout = document.getElementById("steps-readout");
  let mainBtn1 = document.getElementById("main-btn-1");
  let mainBtn2 = document.getElementById("main-btn-2");
  let mainBtn3 = document.getElementById("main-btn-3");
  let mainBtn4 = document.getElementById("main-btn-4");

  let btnAudio1 = new Audio("Audio/simonSound1.mp3");
  let btnAudio2 = new Audio("Audio/simonSound2.mp3");
  let btnAudio3 = new Audio("Audio/simonSound3.mp3");
  let btnAudio4 = new Audio("Audio/simonSound4.mp3");

  let sequence = [];
  let playerStepNum = 0;
  let strictMode = false;
  let playerMayAct = false;

  // ===== CONTROL BUTTONS =====

  startResetBtn.onclick = () => {
    startResetBtn.innerHTML = ("RESET");
    sequence = [];
    updateReadout();
  }

  strictBtn.onclick = () => {
    strictMode = !strictMode;
    strictBtnIcon.classList.toggle("fa-check-circle");
    strictBtnIcon.classList.toggle("fa-times-circle");
  }

  // ===== MAIN BUTTONS =====

  mainBtn1.onclick = () => {
    console.log("btn1");
    btnAudio1.play();
  }
  mainBtn2.onclick = () => {
    console.log("btn2");
    btnAudio2.play();
  }
  mainBtn3.onclick = () => {
    console.log("btn3");
    btnAudio3.play();
  }
  mainBtn4.onclick = () => {
    console.log("btn4");
    btnAudio4.play();
  }

  // ===== MAIN GAME ALGOS =====

  function generateSequence () {
    sequence.push(Math.ceil(Math.random() * 4));
    playSequence();
  }

  function playSequence () {
    for (let i = 0; i < sequence.length; i++) {
      // stuff
    }
  }

  // ===== UPDATE READOUT =====
  function updateReadout () {
    stepsReadout.innerHTML = sequence.length;
  }
}); /* dom content loaded */
