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

- error audio: http://freesound.org/data/previews/171/171497_2437358-lq.mp3

fa-times-circle, fa-check-circle
*/

//TODO: add time limit on player move
//TODO: add end game - checkforwin on last successful move
//TODO: add strict functionality

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
  let errorAudio = new Audio("Audio/simonError.mp3");

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
    if (!btnNum) { // prevents error when resetting mid demo seq
      return
    }
    eval("mainBtn" + btnNum).classList.add("active-btn-border");
    playBtnAudio(btnNum);
    setTimeout(() => {
      eval("mainBtn" + btnNum).classList.remove("active-btn-border");
    }, 750)
  }
  // ===== PLAY BUTTON AUDIO =====
  function playBtnAudio(btnNum) {
    eval("btnAudio" + btnNum).currentTime = 0;
    eval("btnAudio" + btnNum).play();
  }

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

  // ===== CHECK FOR WIN =====
  function checkForWin() {
    if (sequence.length === 2) {
      stepsReadout.innerHTML = "WIN";
      sequence = [];
      setTimeout(() => {
        generateSequence();
      }, 2000)
      return true;
    } else {
      return false;
    }
  }

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
        playerStepInt = 0;
        demoSeqInt = 0;
        playerMayAct = true;
        console.log(sequence);
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
    if (!playerMayAct) {
      return;
    }
    // ===== PLAYER TURN - CORRECT =====
    if (btn === sequence[playerStepInt]) {
      highlightButton(btn);
      playerTurnDelay();
      if (playerStepInt < sequence.length - 1) {
        playerStepInt++;
      } else {
        playerMayAct = false;
        if (!checkForWin()) {
          setTimeout(() => {
            generateSequence();
          }, 2000)
        }
      }
    } // ===== PLAYER TURN - MISTAKE =====
    else {
      playerMayAct = false;
      readoutMistake();
      errorAudio.play();
      playerStepInt = 0;
      demoSeqInt = 0;
      setTimeout(() => {
        demoSequence();
      }, 1000)
    }
  }

  function playerTurnDelay() {
    playerMayAct = false;
    setTimeout(() => {
      playerMayAct = true;
    }, 750)
  }

  function readoutMistake() {
    stepsReadout.innerHTML = "!!";
    setTimeout(() => {
      updateReadout();
    }, 2000)
  }


}); /* dom content loaded */
