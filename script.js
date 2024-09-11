const cells = document.querySelectorAll(".cell");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let playAgainstAI = false;  // Variable to track if we're playing against AI

// Function to update the board visually
function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

// Function to handle a click on the board
function handleClick(e) {
    const index = e.target.getAttribute("data-index");

    // If the cell is empty and it's player X's turn or player O's turn in PvP mode
    if (board[index] === "" && (currentPlayer === "X" || !playAgainstAI)) {
        board[index] = currentPlayer;
        updateBoard();

        if (!checkWinner()) {
            // If we are playing against AI, the computer will make its move
            if (playAgainstAI && currentPlayer === "X") {
                currentPlayer = "O";  // Switch to computer
                setTimeout(computerMove, 500);  // Computer takes its turn after a short delay
            } else {
                // Switch turn to the other player in Player vs Player mode
                currentPlayer = currentPlayer === "X" ? "O" : "X";
            }
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

// Function to check for a winner
function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            setTimeout(() => {
                alert(`Player ${board[a]} wins!`);
                resetGame();
            }, 100);
            return true;
        }
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

// Toggle between Player vs Player and Player vs AI
document.getElementById("toggle-ai").addEventListener("click", () => {
    playAgainstAI = !playAgainstAI;  // Toggle AI mode
    document.getElementById("toggle-ai").textContent = playAgainstAI ? "Play Against Computer: ON" : "Play Against Computer: OFF";
    resetGame();  // Reset the game when toggling modes
});

// Reset button functionality
document.getElementById("reset").addEventListener("click", resetGame);
