const gameBoard = (function () {
  const moves = Array(9).fill("");

  function getMove(index) {
    if (index >= moves.length) return;
    return moves[index];
  }

  function setMove(mark, index) {
    if (index >= moves.length) return;
    moves[index] = mark;
  }

  return { getMove, setMove };
})();

const displayController = (function () {
  //cache DOM
  const gameboard = document.getElementById("gameboard");
  const boxes = Array.from(gameboard.getElementsByClassName("box"));

  //bind events
  gameboard.addEventListener("click", registerMove);

  function isEmpty(element) {
    if (element.innerText === "X" || element.innerText === "O") return false;
    return true;
  }

  function render() {
    for (let i = 0; i < 9; i++) {
      boxes[i].innerText = gameBoard.getMove(i);
    }
  }

  function registerMove(e) {
    if (e.target === gameboard) return;
    if (!isEmpty(e.target)) return;
    gameBoard.setMove(
      gameController.getCurrentPlayer().getMark(),
      boxes.indexOf(e.target)
    );
    gameController.nextTurn();
    render();
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
  let turn = 1;

  const playerOne = Player("p1", "X");
  const playerTwo = Player("p2", "O");
  let currentPlayer = playerOne;

  function nextTurn() {
    if (turn >= 9) return;
    turn++;
    currentPlayer = turn % 2 === 0 ? playerTwo : playerOne;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  return { nextTurn, getCurrentPlayer };
})();
