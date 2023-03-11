const player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  }

  return { getSign };
}

const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const setField = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
  };

  const getField = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  return { setField, getField, reset };
})();

const displayController = (() => {
  const squares = document.querySelectorAll('.squares');
  const messageElement = document.getElementById('message');
  const restartBtn = document.getElementById('restart');

  // Squares display
  squares.forEach((square) => 
    square.addEventListener('click', (e) => {
      if (gameController.getGameOver() || e.target.textContent !== '') return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
    })
  );

  const updateGameboard = () => {
    for (let i = 0; i < squares.length; i++) {
      squares[i].textContent = gameBoard.getField(i);
    }
  };

  // Restart button functionality
  restartBtn.addEventListener('click', () => {
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    setMessageElement("Player X's turn");
    restartBtn.style.display = 'none';
  });

  const setResultMessage = (winner) => {
    if (winner === 'Draw') {
      setMessageElement("It's a draw!");
      restartBtn.style.display = 'block';
    } else {
      setMessageElement(`Player ${winner} has won!`);
      restartBtn.style.display = 'block';
    }
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };

})();

const gameController = (() => {
  const playerX = player('X');
  const playerO = player('O');
  let round = 1;
  let gameOver = false;

  const playRound = (squareIndex) => {
    gameBoard.setField(squareIndex, getCurrentPlayerSign());
    if (checkWinner(squareIndex)) {
      displayController.setResultMessage(getCurrentPlayerSign());
      gameOver = true;
      return;
    }
    if (round === 9) {
      displayController.setResultMessage('Draw');
      gameOver = true;
      return;
    }
    round++;
    displayController.setMessageElement(`Player ${getCurrentPlayerSign()}'s turn`);
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

  const checkWinner = (squareIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(squareIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getField(index) === getCurrentPlayerSign()
        )
      );
  };

  const getGameOver = () => {
    return gameOver;
  };

  const reset = () => {
    round = 1;
    gameOver = false;
  }
  
  return { playRound, getGameOver, reset };
})();
