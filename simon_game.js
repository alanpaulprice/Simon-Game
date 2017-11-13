/* jshint esversion: 6 */

/*
- error audio: http://freesound.org/data/previews/171/171497_2437358-lq.mp3
*/

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
  // all timeouts saved as vars, so they can be cleared on game reset
  let playerMoveTimeout;
  let demoSeqTimeout;
  let mistakeTimeout;
  let noWinTimeout;
  let btnHighlightTimeout;
  let gameWonTimeout;
  let gameResetTimeout;
  let turnDelayTimeout;
  let delayBeforeTurn;
  let readoutMistakeTimeout;

  // ===== UPDATE READOUT =====
  function updateReadout() {
    stepsReadout.innerHTML = sequence.length;
  }

  // ===== HIGHLIGHT BUTTON =====
  // adds a border to a button for half a second and plays the btn's audio
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
  // clears timeouts (all, to be safe), resets game vars to inital values,
  // clears any incomplete btn higlight borders, 1 second pause then start new game
  startResetBtn.onclick = () => {
    clearTimeout(playerMoveTimeout);
    clearTimeout(demoSeqTimeout);
    clearTimeout(mistakeTimeout);
    clearTimeout(noWinTimeout);
    clearTimeout(btnHighlightTimeout);
    clearTimeout(gameWonTimeout);
    clearTimeout(gameResetTimeout);
    clearTimeout(turnDelayTimeout);
    clearTimeout(delayBeforeTurn);
    clearTimeout(readoutMistakeTimeout);

    startResetBtn.innerHTML = ("RESET");
    stepsReadout.innerHTML = ("--");

    sequence = [];
    demoSeqInt = 0
    playerStepInt = 0;
    playerMayAct = false;

    for (let i = 0; i < mainBtns.length; i++) {
      mainBtns[i].classList.remove("active-btn-border");
    }

    clearTimeout(gameResetTimeout);
    gameResetTimeout = setTimeout(() => {
      generateSequence();
    }, 1000);
  }

  // ===== STRICT =====
  // toggles strict mode
  strictBtn.onclick = () => {
    strictMode = !strictMode;
    strictBtnIcon.classList.toggle("fa-check-circle");
    strictBtnIcon.classList.toggle("fa-times-circle");
  }

  // ===== CHECK FOR WIN =====
  // if the player has completed the game, wait 2 secs then display WIN and reset
  // otherwise, just return false
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
  // adds a new move to the end of the sequence, triggers demo
  function generateSequence() {
    sequence.push(Math.ceil(Math.random() * 4));
    updateReadout();
    demoSequence();
  }

  // ===== DEMO SEQUENCE =====
  // highlights each button in sequence. when end reached, after pause, reset
  // previously used vars and allow player turn and start the timer
  function demoSequence() {
    playerMayAct = false;
    clearTimeout(demoSeqTimeout);
    demoSeqTimeout = setTimeout(() => {
      highlightButton(sequence[demoSeqInt]);
      demoSeqInt++;
      if (demoSeqInt < sequence.length) {
        demoSequence();
      } else {
        clearTimeout(delayBeforeTurn);
        delayBeforeTurn = setTimeout(() => {
          playerStepInt = 0;
          demoSeqInt = 0;
          playerMayAct = true;
          // TRIGGER PLAYER TIMER
          triggerPlayerTimer();
        }, 500)
      }
    }, 1000)
  }

  // ===== PLAYER TURN =====
  // if not player turn, do nothing
  function playerTurn(btn) {
    if (!playerMayAct) {
      return;
    }
    // ===== CORRECT =====
    // highlight the button, delay before next turn allowed, reset turn timer, int++
    // if last move of seq, end timers for turn delay and turn, check if win
    // if no win, new seq, if win, run checkforwin func
    if (btn === sequence[playerStepInt]) {
      highlightButton(btn);
      playerTurnDelay();
      if (playerStepInt < sequence.length - 1) {
        playerStepInt++;
        // RESET PLAYER TIMER
        triggerPlayerTimer();
      } else {
        playerMayAct = false;
        clearTimeout(turnDelayTimeout);
        // END PLAYER TIMER
        clearTimeout(playerMoveTimeout);
        if (!checkForWin()) {
          clearTimeout(noWinTimeout);
          noWinTimeout = setTimeout(() => {
            generateSequence();
          }, 2000)
        }
      }
    } // ===== MISTAKE =====
    else {
      mistakeMade();
    }
  }

  // ===== MISTAKE MADE =====
  // prevent player move, end turn timer, play audio, update readout, reset ints
  // if strict, wipe seq, if not, run demo again
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
  // temporarily change playermayact to false
  function playerTurnDelay() {
    playerMayAct = false;
    clearTimeout(turnDelayTimeout);
    turnDelayTimeout = setTimeout(() => {
      playerMayAct = true;
    }, 750)
  }

  // ===== READOUT MISTAKE =====
  // temporarily change readout to !!
  function readoutMistake() {
    stepsReadout.innerHTML = "!!";
    clearTimeout(readoutMistakeTimeout);
    readoutMistakeTimeout = setTimeout(() => {
      updateReadout();
    }, 2000)
  }

  // ===== TRIGGER PLAYER TIMER =====
  // if player doesn't make move for 5sec while able to act, count as mistake
  function triggerPlayerTimer() {
    clearTimeout(playerMoveTimeout);
    playerMoveTimeout = setTimeout(() => {
      mistakeMade();
    }, 5000)
  }

  mainBtn1.onclick = () => playerTurn(1);
  mainBtn2.onclick = () => playerTurn(2);
  mainBtn3.onclick = () => playerTurn(3);
  mainBtn4.onclick = () => playerTurn(4);

}); /* dom content loaded */
