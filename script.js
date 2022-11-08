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

  function checkForWin() {
    return WINSEQ.some((seq) =>
      seq.every((index) => moves[index] === gameController.getCurrentMark())
    );
  }

  return { getMove, setMove, checkForWin };
})();

const displayController = (function () {
  //cache DOM
  const modal = document.getElementById("modal");
  const playerXNameInput = modal.querySelector("#input-player-X");
  const playerONameInput = modal.querySelector("#input-player-O");
  const playerXName = document.getElementById("name-player-X");
  const playerOName = document.getElementById("name-player-O");
  const gameboard = document.getElementById("gameboard");
  const boxes = Array.from(gameboard.getElementsByClassName("box"));

  //display modal
  modal.showModal();
  //bind events
  gameboard.addEventListener("click", registerMove);
  modal.addEventListener("close", displayNames);

  function displayNames() {
    playerXName.innerText = playerXNameInput.value;
    playerOName.innerText = playerONameInput.value;
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

  function registerMove(e) {
    if (e.target === gameboard) return;
    if (!isEmpty(e.target)) return;
    gameBoard.setMove(gameController.getCurrentMark(), boxes.indexOf(e.target));
    render();
    if (gameBoard.checkForWin())
      return console.log(
        gameController.getCurrentPlayer().getName() + " Won! "
      );
    gameController.nextTurn();
  }

  return { render };
})();

const Player = (name, mark) => {
  function getName() {
    return name;
  }

  function getMark() {
    return mark;
  }

  return { getName, getMark };
};

const gameController = (function () {
  const playerOne = Player("p1", "X");
  const playerTwo = Player("p2", "O");
  let currentPlayer = playerOne;

  function nextTurn() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getCurrentMark() {
    return currentPlayer.getMark();
  }

  return { nextTurn, getCurrentPlayer, getCurrentMark };
})();
