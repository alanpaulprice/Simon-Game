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
*/
//TODO: add pause before restart with -- display

document.addEventListener("DOMContentLoaded", function() {
  console.clear();

  let startResetBtn = document.getElementById("start-reset-btn");
  let strictBtn = document.getElementById("strict-btn");
  let strictBtnIcon = document.getElementById("strict-btn-icon");
  let stepsReadout = document.getElementById("steps-readout");
  let mainBtns = document.getElementsByClassName("main-btns");
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
  let demoSeqInt = 0;
  let playerStepInt = 0;
  let strictMode = false;
  let playerMayAct = false;

  let playerMoveTimeout;
  let demoSeqTimeout;
  let mistakeTimeout;
  let noWinTimeout;
  let btnHighlightTimeout;
  let gameWonTimeout;

  // ===== UPDATE READOUT =====
  function updateReadout() {
    stepsReadout.innerHTML = sequence.length;
  }

  // ===== HIGHLIGHT BUTTON =====
  function highlightButton(btnNum) {
      eval("mainBtn" + btnNum).classList.add("active-btn-border");
      playBtnAudio(btnNum);
      clearTimeout(btnHighlightTimeout);
      btnHighlightTimeout = setTimeout(() => {
        eval("mainBtn" + btnNum).classList.remove("active-btn-border");
      }, 500);
  }
  // ===== PLAY BUTTON AUDIO =====
  function playBtnAudio(btnNum) {
    eval("btnAudio" + btnNum).currentTime = 0;
    eval("btnAudio" + btnNum).play();
  }

  // ===== START RESET =====
  startResetBtn.onclick = () => {
    startResetBtn.innerHTML = ("RESET");
    clearTimeout(playerMoveTimeout);
    clearTimeout(demoSeqTimeout);
    clearTimeout(mistakeTimeout);
    clearTimeout(noWinTimeout);
    clearTimeout(btnHighlightTimeout);
    clearTimeout(gameWonTimeout);
    sequence = [];
    demoSeqInt = 0
    playerStepInt = 0;
    playerMayAct = false;
    for (let i = 0; i < mainBtns.length; i++) {
      mainBtns[i].classList.remove("active-btn-border");
    }
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
    if (sequence.length === 20) {
      stepsReadout.innerHTML = "WIN";
      sequence = [];
      clearTimeout(gameWonTimeout);
      gameWonTimeout = setTimeout(() => {
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
    console.log(sequence);
    updateReadout();
    demoSequence();
  }
  // ===== DEMO SEQUENCE =====
  function demoSequence() {
    playerMayAct = false;
    clearTimeout(demoSeqTimeout);
    demoSeqTimeout = setTimeout(() => {
      highlightButton(sequence[demoSeqInt]);
      demoSeqInt++;
      if (demoSeqInt < sequence.length) {
        demoSequence();
      } else {
        playerStepInt = 0;
        demoSeqInt = 0;
        playerMayAct = true;
        // TRIGGER PLAYER TIMER
        triggerPlayerTimer();
      }
    }, 1000)
  }

  // ===== MAIN BUTTONS =====
  mainBtn1.onclick = () => playerTurn(1);
  mainBtn2.onclick = () => playerTurn(2);
  mainBtn3.onclick = () => playerTurn(3);
  mainBtn4.onclick = () => playerTurn(4);
  // ===== PLAYER TURN =====
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
        // RESET PLAYER TIMER
        triggerPlayerTimer();
      } else {
        playerMayAct = false;
        // END PLAYER TIMER
        clearTimeout(playerMoveTimeout);
        if (!checkForWin()) {
          clearTimeout(noWinTimeout);
          noWinTimeout = setTimeout(() => {
            generateSequence();
          }, 2000)
        }
      }
    } // ===== PLAYER TURN - MISTAKE =====
    else {
      mistakeMade();
    }
  }
  // ===== MISTAKE MADE =====
  function mistakeMade() {
    playerMayAct = false;
    // END PLAYER TIMER
    clearTimeout(playerMoveTimeout);
    errorAudio.play();
    readoutMistake();
    playerStepInt = 0;
    demoSeqInt = 0;
    clearTimeout(mistakeTimeout)
    mistakeTimeout = setTimeout(() => {
      if (strictMode) {
        sequence = [];
        generateSequence();
      } else {
        demoSequence();
      }
    }, 1000)
  }
  // ===== PLAYER TURN DELAY =====
  function playerTurnDelay() {
    playerMayAct = false;
    setTimeout(() => {
      playerMayAct = true;
    }, 750)
  }
  // ===== READOUT MISTAKE =====
  function readoutMistake() {
    stepsReadout.innerHTML = "!!";
    setTimeout(() => {
      updateReadout();
    }, 2000)
  }

  // ===== TRIGGER PLAYER TIMER =====
  function triggerPlayerTimer() {
    clearTimeout(playerMoveTimeout);
    playerMoveTimeout = setTimeout(() => {
      console.log("timeout mistake");
      mistakeMade();
    }, 5000)
  }


}); /* dom content loaded */
