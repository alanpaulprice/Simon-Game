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
  let demoSeqInt = 0
  let playerStepInt = 0;
  let strictMode = false;
  let playerMayAct = false;

  // ===== UPDATE READOUT =====
  function updateReadout() {
    stepsReadout.innerHTML = sequence.length;
  }

  // ===== HIGHLIGHT BUTTON =====
  function highlightButton(btnNum) {
    eval("mainBtn" + btnNum).classList.add("active-btn-border");
    playBtnAudio(btnNum);
    setTimeout(() => {
      eval("mainBtn" + btnNum).classList.remove("active-btn-border");
    }, 750)
  }

  function playBtnAudio(btnNum) {
    eval("btnAudio" + btnNum).play();
  }

  // ===== CONTROL BUTTONS =====

  // ===== START RESET =====
  startResetBtn.onclick = () => {
    startResetBtn.innerHTML = ("RESET");
    sequence = [];
    generateSequence();
  }
  // ===== STRICT =====
  strictBtn.onclick = () => {
    strictMode = !strictMode;
    strictBtnIcon.classList.toggle("fa-check-circle");
    strictBtnIcon.classList.toggle("fa-times-circle");
  }

  // ===== MAIN GAME ALGOS =====

  // ===== GENERATE SEQUENCE =====
  function generateSequence() {
    sequence.push(Math.ceil(Math.random() * 4));
    updateReadout();
    demoSequence();
  }
  // ===== DEMO SEQUENCE =====
  function demoSequence() {
    setTimeout(() => {
      highlightButton(sequence[demoSeqInt]);
      demoSeqInt++;
      if (demoSeqInt < sequence.length) {
        demoSequence();
      } else {
        playerStepNum = 0;
        demoSeqInt = 0;
        playerMayAct = true;
      }
    }, 1000)
  }
  // ===== PLAYER TURN =====

  // ===== MAIN BUTTONS =====
  mainBtn1.onclick = () => playerTurn(1);
  mainBtn2.onclick = () => playerTurn(2);
  mainBtn3.onclick = () => playerTurn(3);
  mainBtn4.onclick = () => playerTurn(4);

  function playerTurn(btn) {
    if (!playerMayAct) { return; }

    if (btn === sequence[playerStepInt]) {
      console.log("correct");
      highlightButton(btn);
      // playerStepInt++,
    }
    else {
      console.log("false");
      highlightButton(btn);
    }
  }


}); /* dom content loaded */
