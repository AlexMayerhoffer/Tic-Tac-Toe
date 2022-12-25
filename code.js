const PlayerHuman = (name) => {
  const makeMove = (index) => index;
  return {
    name,
    makeMove,
  };
};

const PlayerComputer = (name = "Computer") => {
  const makeMove = (game_board) => {
    let board = [
      [game_board[0], game_board[1], game_board[2]],
      [game_board[3], game_board[4], game_board[5]],
      [game_board[6], game_board[7], game_board[8]],
    ];
    let bestMove = findBestMove(board);
    console.log(`Best move is: ${bestMove.row}, ${bestMove.col}`);
    return bestMove.row * 3 + bestMove.col;
  };

  const isMovesLeft = board => {
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          return true;
        }
      }
    }
    return false;
  }

  const evaluate = board => {
    for (let row = 0; row < 3; row++) {
      if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        if (board[row][0] === "O") {
          return +10;
        }
        else if (board[row][0] === "X") {
          return -10;
        }
      }
    }

    for (let col = 0; col < 3; col++) {
      if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        if (board[0][col] === "O") {
          return +10;
        }
        else if (board[0][col] === "X") {
          return -10;
        }
      }
    }

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] === "O") {
        return +10;
      }
      else if( board[0][0] === "X") {
        return -10;
      }
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[0][2] === "O") {
        return +10;
      }
      else if( board[0][2] === "X") {
        return -10;
      }
    }

    return 0;

  }

  const minMax = (board, depth, isMax) => {
    let score = evaluate(board);
    if (score === 10 || score === -10) {
      return score;
    }

    if (isMovesLeft(board) === false) {
      return 0;
    }

    if (isMax) {
      let best = -1000;

      for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
          if(board[i][j] === "") {
            board[i][j] = "O";
            best = Math.max(best, minMax(board, depth+1, !isMax));
            board [i][j] = "";
          } 
        }
      }
      return best;
    }
    else {
      let best = 1000;
      for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
          if (board[i][j] === "") {
            board[i][j] === "X";
            best = Math.min(best, minMax(board, depth+1, !isMax));
            board[i][j] = "";
          }
        }
    }
    return best;
  }
}

  const findBestMove = (board) => {
    
    let bestVal = -1000;
    let bestMove = {
      row: -1,
      col: -1,
    };

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(board[i][j] === "") {
          board[i][j] = "O";
          moveVal = minMax(board, 0, false);
          board[i][j] = "";

          if(moveVal > bestVal) {
            bestMove.row = i;
            bestMove.col = j;
            bestVal = moveVal;
          }
        }
      }
    }
    return bestMove;
  };

  return {
    name,
    makeMove
  }
};

let ai = PlayerComputer("CoMp");

const gameBoard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];
  const getBoard = () => board;
  const setBoard = (index, value) => {
    board[index] = value;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };
  return { getBoard, setBoard, resetBoard };
})();

const displayController = (function (document) {
  const updateBoard = (game_board) => {
    console.log(game_board);
    for (let i = 0; i < 9; i++) {
      console.log(`cell ${i} got value ${game_board[i]}`);
      document.getElementById(`cell_${i + 1}`).innerHTML = game_board[i];
    }
  };

  const updateScore = (score) => {
    document.getElementById(
      "player_score"
    ).innerHTML = `Player: ${score.player_score}`;
    document.getElementById(
      "computer_score"
    ).innerHTML = `Computer: ${score.computer_score}`;
  };

  const updateCurrentTurn = (current_turn) => {
    document.getElementById("current_turn").innerHTML =
      current_turn === "player" ? "Player's<br>Turn" : "Computer's<br>Turn";
  };

  const initDisplay = () => {
    updateBoard(["", "", "", "", "", "", "", "", ""]);
    updateScore({ player_score: 0, computer_score: 0 });
    updateCurrentTurn("player");
  };

  return {
    updateBoard,
    updateScore,
    updateCurrentTurn,
    initDisplay,
  };
})(document);

const gameController = (function (game_board, display_controller) {
  let current_turn;
  let score;

  const initGame = () => {
    displayController.initDisplay();
    this.current_turn = "player";
    game_board.resetBoard();
    score = {
      player: 0,
      computer: 0,
    };
  };

  const checkWin = () => {
    let curr_board = game_board.getBoard();
    console.log(curr_board);
    for (let index = 0; index < 3; index++) {
      if (
        curr_board[index] === curr_board[index + 3] &&
        curr_board[index] === curr_board[index + 6] &&
        curr_board[index] !== ""
      ) {
        return true;
      }
      if (
        curr_board[index * 3] === curr_board[index * 3 + 1] &&
        curr_board[index * 3] === curr_board[index * 3 + 2] &&
        curr_board[index * 3] !== ""
      ) {
        return true;
      }
    }

    if (
      curr_board[0] === curr_board[4] &&
      curr_board[0] === curr_board[8] &&
      curr_board[0] !== ""
    ) {
      return true;
    }
    if (
      curr_board[2] === curr_board[4] &&
      curr_board[2] === curr_board[6] &&
      curr_board[2] !== ""
    ) {
      return true;
    }
    return false;
  };

  const makeMove = (index, val) => {
    game_board.setBoard(index, val);
  };

  const isMoveValid = (index) => {
    return gameBoard.getBoard()[index] === "";
  };

  const gameWon = (player) => {
    alert(`${player} won!`);
  };

  const getAiMove = () => {
    let move = Math.floor(Math.random() * 9);
    while (!isMoveValid(move) && move != 9) {
      move = Math.floor(Math.random() * 9);
    }
    return move;
  };

  const nextTurn = async (index) => {
    if (!isMoveValid(index)) {
      return;
    }
    makeMove(index, "X");
    display_controller.updateBoard(game_board.getBoard());
    if (checkWin()) {
      // initGame();
      gameWon("Player");
      return;
    }
    display_controller.updateCurrentTurn("computer");

    await new Promise((r) => setTimeout(r, 1000));

    makeMove(ai.makeMove(game_board.getBoard()), "O");
    display_controller.updateBoard(game_board.getBoard());
    if (checkWin()) {
      // initGame();
      gameWon("Computer");
      return;
    }
    display_controller.updateCurrentTurn("player");
  };

  return {
    initGame,
    nextTurn,
  };
})(gameBoard, displayController);

gameController.initGame();
