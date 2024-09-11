let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Function to check for a winner
function checkWinner() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // Delay the popup so the final move is shown
      setTimeout(() => {
        alert(`Player ${currentPlayer} wins!`);
        resetGame();
      }, 100);  // Small delay (100 ms)
      return true;
    }
  }

  if (!board.includes("")) {
    setTimeout(() => {
      alert("It's a draw!");
      resetGame();
    }, 100);  // Small delay (100 ms)
    return true;
  }

  return false;
}

// Function to handle cell clicks
function handleClick(e) {
  const index = e.target.getAttribute("data-index");

  if (board[index] === "") {
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (!checkWinner()) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";  // Toggle player
    }
  }
}

// Function to reset the game
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
}

// Add event listeners to each cell and reset button
cells.forEach(cell => cell.addEventListener("click", handleClick));
resetButton.addEventListener("click", resetGame);
