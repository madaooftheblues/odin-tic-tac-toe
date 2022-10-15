const Gameboard = (function () {
  //cache DOM
  const gameboard = document.getElementById("gameboard");
  const boxes = gameboard.getElementsByClassName("box");

  const moves = ["O", "X", "O", "X"];

  function setMoves(move) {
    moves.push(move);
  }

  function render() {
    for (let i = 0; i < moves.length; i++) {
      boxes[i].innerText = moves[i];
    }
  }
  return { setMoves, render };
})();

const Player = (name) => {
  function getName() {
    return name;
  }

  return { getName };
};

Gameboard.render();
