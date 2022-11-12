const gameBoard = (function () {
  const WINSEQ = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const moves = Array(9).fill("");

  function getMove(index) {
    if (index >= moves.length) return;
    return moves[index];
  }

  function setMove(mark, index) {
    if (index >= moves.length) return;
    moves[index] = mark;
    console.log(moves);
  }

  function getWinSeq() {
    return WINSEQ;
  }

  function getState() {
    return moves;
  }

  function checkForWin() {
    let seqIndex;
    seqIndex = WINSEQ.findIndex((seq) =>
      seq.every((index) => moves[index] === gameController.getCurrentMark())
    );
    if (seqIndex >= 0) {
      displayController.showWinner(WINSEQ[seqIndex]);
      return true;
    }
    return false;
  }

  function clearBoard() {
    moves.fill("");
  }

  return { getMove, setMove, checkForWin, getWinSeq, getState, clearBoard };
})();

const displayController = (function () {
  //cache DOM
  const modal = document.getElementById("modal");
  const modalResult = document.getElementById("modal-result");
  const winner = modalResult.querySelector("#winner-announcement");
  const replayBtn = modalResult.querySelector("#btn-replay");
  const playerXNameInput = modal.querySelector("#input-player-X");
  const playerONameInput = modal.querySelector("#input-player-O");
  const playerXName = document.getElementById("name-player-X");
  const playerOName = document.getElementById("name-player-O");
  const playerXAvatar = document.getElementById("avatar-player-X");
  const playerOAvatar = document.getElementById("avatar-player-O");
  const gameboard = document.getElementById("gameboard");
  const boxes = Array.from(gameboard.getElementsByClassName("box"));

  //tells the current turn
  let turn = 1;

  //display modal
  modal.showModal();
  //bind events
  gameboard.addEventListener("click", registerMove);
  modal.addEventListener("close", registerPlayers);
  replayBtn.addEventListener("click", initialize);

  function registerPlayers() {
    gameController.setPlayerOneName(playerXNameInput.value);
    playerXName.innerText = gameController.getPlayeOneName();

    gameController.setPlayerTwoName(playerONameInput.value);
    playerOName.innerText = gameController.getPlayerTwoName();
  }

  function isEmpty(element) {
    if (element.innerText === "X" || element.innerText === "O") return false;
    return true;
  }

  function render() {
    boxes.forEach((box, index) => {
      box.innerText = gameBoard.getMove(index);
    });
  }

  function showWinner(sequence) {
    sequence.forEach((seqIndex, i) =>
      setTimeout(() => boxes[seqIndex].classList.add("winseq"), i * 500)
    );
    winner.textContent = `${gameController.getCurrentPlayer().getName()} Wins!`;
    setTimeout(() => modalResult.showModal(), 2000);
  }

  function showDraw() {
    winner.textContent = "Match Tied";
    modalResult.showModal();
  }

  function registerMove(e) {
    if (e.target === gameboard) return;
    if (!isEmpty(e.target)) return;
    playerOAvatar.classList.toggle("selected");
    playerXAvatar.classList.toggle("selected");
    turn++;
    gameBoard.setMove(gameController.getCurrentMark(), boxes.indexOf(e.target));
    render();
    if (gameBoard.checkForWin()) return;
    if (turn > 9) return showDraw();
    gameController.nextTurn();
  }

  function initialize() {
    turn = 1;
    modalResult.close();
    modal.showModal();
    gameController.setPlayerOneName("");
    gameController.setPlayerTwoName("");
    gameBoard.clearBoard();
    boxes.forEach((box) =>
      box.classList.contains("winseq") ? box.classList.remove("winseq") : null
    );
    playerXAvatar.classList.add("selected");
    playerOAvatar.classList.remove("selected");
    render();
  }

  return { render, showWinner };
})();

const Player = (name, mark) => {
  function getName() {
    return name;
  }

  function getMark() {
    return mark;
  }

  function setName(string) {
    name = string;
  }
  return { getName, getMark, setName };
};

const computer = (function () {
  function actions(state) {
    const a = [];
    state.forEach((element, index) => {
      if (element === "") a.push(index);
    });
    return a;
  }

  function result(state, action, player) {
    const newState = [...state];
    newState[action] = player ? "X" : "O";
    return newState;
  }

  function isWin(state, player) {
    return gameBoard
      .getWinSeq()
      .some((seq) => seq.every((i) => state[i] === (player ? "X" : "O")));
  }

  function isDraw(state) {
    return state.every((element) => element != "");
  }

  function minimax(state, player) {
    function maxValue(state) {
      if (isWin(state, player)) return { v: 1, move: null };
      if (isDraw(state)) return { v: 0, move: null };

      let v = -Infinity;
      let move = null;
      actions(state).forEach((a) => {
        let obj = minValue(result(state, a, player));
        if (obj.v > v) {
          v = obj.v;
          move = a;
        }
      });
      return { v, move };
    }

    function minValue(state) {
      if (isWin(state, !player)) return { v: -1, move: null };
      if (isDraw(state)) return { v: 0, move: null };

      let v = +Infinity;
      let move = null;
      actions(state).forEach((a) => {
        let obj = maxValue(result(state, a, !player));
        if (obj.v < v) {
          v = obj.v;
          move = a;
        }
      });

      return { v, move };
    }

    let f = maxValue(state);

    console.log(f);
    return f.move;
  }

  return { minimax };
})();

const gameController = (function () {
  const playerOne = Player("X", "X");
  const playerTwo = Player("O", "O");
  let currentPlayer = playerOne;

  function setPlayerOneName(name) {
    playerOne.setName(name);
  }

  function setPlayerTwoName(name) {
    playerTwo.setName(name);
  }

  function getPlayeOneName() {
    return playerOne.getName();
  }

  function getPlayerTwoName() {
    return playerTwo.getName();
  }

  function nextTurn() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getCurrentMark() {
    return currentPlayer.getMark();
  }

  return {
    nextTurn,
    getCurrentPlayer,
    getCurrentMark,
    setPlayerOneName,
    setPlayerTwoName,
    getPlayeOneName,
    getPlayerTwoName,
  };
})();
