const cells = document.querySelectorAll(".cell");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

// Function to update the board visually
function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

// Function to handle a click on the board
function handleClick(e) {
    const index = e.target.getAttribute("data-index");

    if (board[index] === "" && currentPlayer === "X") {
        board[index] = currentPlayer;
        updateBoard();
        if (!checkWinner()) {
            currentPlayer = "O";
            setTimeout(computerMove, 500);  // Let the computer take its turn after a short delay
        }
    }
}

// Minimax algorithm to find the best move for the computer
function minimax(newBoard, player) {
    const emptyCells = newBoard.filter(cell => cell === "").length;

    const winner = checkWinnerAI(newBoard);
    if (winner === "X") return { score: -10 };
    if (winner === "O") return { score: 10 };
    if (emptyCells === 0) return { score: 0 };

    let moves = [];

    newBoard.forEach((cell, index) => {
        if (cell === "") {
            let move = {};
            move.index = index;
            newBoard[index] = player;

            if (player === "O") {
                let result = minimax(newBoard, "X");
                move.score = result.score;
            } else {
                let result = minimax(newBoard, "O");
                move.score = result.score;
            }

            newBoard[index] = "";  // Reset the board
            moves.push(move);
        }
    });

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}

// Computer move using the Minimax algorithm
function computerMove() {
    let bestMove = minimax(board, "O");
    board[bestMove.index] = "O";
    updateBoard();
    if (!checkWinner()) {
        currentPlayer = "X";
    }
}

// Function to check for a winner (used by the AI)
function checkWinnerAI(newBoard) {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
            return newBoard[a];
        }
    }
    return null;
}

// Function to check for a winner in the game
function checkWinner() {
    const winner = checkWinnerAI(board);
    if (winner) {
        setTimeout(() => {
            alert(`Player ${winner} wins!`);
            resetGame();
        }, 100);
        return true;
    }

    if (!board.includes("")) {
        setTimeout(() => {
            alert("It's a draw!");
            resetGame();
        }, 100);
        return true;
    }

    return false;
}

// Function to reset the game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    updateBoard();
}

// Add event listeners to each cell
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});
