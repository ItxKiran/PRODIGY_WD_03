document.addEventListener('DOMContentLoaded', () => {
    const playerVsPlayerButton = document.getElementById('player-vs-player');
    const playerVsAIButton = document.getElementById('player-vs-ai');
    const gameCells = document.querySelectorAll('.cell');
    const messageBox = document.getElementById('message-box');
    const restartButton = document.getElementById('restart-button');

    let currentPlayer = 'X';
    let gameActive = false; // Initially, the game is not active
    let isPlayerVsAI = false; // Flag to track if it's Player vs AI mode

    // Winning combinations
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Function to start a new game
    const startNewGame = () => {
        gameActive = true;
        currentPlayer = 'X'; // Player X always starts the game
        messageBox.textContent = currentPlayerTurn();
        gameCells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', handleCellClick, { once: true });
        });

        if (isPlayerVsAI && currentPlayer === 'O') {
            // If it's Player vs AI mode and it's AI's turn, let AI make a move
            setTimeout(makeAIMove, 500);
        }
    };

    // Function to handle cell clicks
    const handleCellClick = (e) => {
        const cell = e.target;

        // If the cell is already filled or the game is not active, return
        if (cell.textContent !== '' || !gameActive) return;

        // Fill the cell with the current player's symbol
        cell.textContent = currentPlayer;

        // Check for a winner or a draw
        if (checkWinner()) {
            messageBox.textContent = `${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            messageBox.textContent = "It's a draw!";
            gameActive = false;
            return;
        }

        // Switch to the next player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        messageBox.textContent = currentPlayerTurn();

        if (isPlayerVsAI && currentPlayer === 'O') {
            // If it's Player vs AI mode and it's AI's turn, let AI make a move
            setTimeout(makeAIMove, 500);
        }
    };

// Function to make AI move using Minimax algorithm
const makeAIMove = () => {
    const bestMove = minimax(gameCells, currentPlayer, 0, -Infinity, Infinity, true);
    const cell = gameCells[bestMove.index];
    cell.textContent = 'O';

    // Check for a winner or a draw after AI's move
    if (checkWinner()) {
        messageBox.textContent = "AI wins!";
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        messageBox.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    // Switch to the next player
    currentPlayer = 'X';
    messageBox.textContent = currentPlayerTurn();
};

// Minimax algorithm with alpha-beta pruning for AI decision-making
const minimax = (board, player, depth, alpha, beta, maximizingPlayer) => {
    if (checkWinner()) {
        return player === 'O' ? 10 - depth : depth - 10;
    } else if (checkDraw()) {
        return 0;
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        let bestMove = -1;
        for (let i = 0; i < board.length; i++) {
            if (board[i].textContent === '') {
                board[i].textContent = 'O';
                const eval = minimax(board, player, depth + 1, alpha, beta, false);
                board[i].textContent = '';
                if (eval > maxEval) {
                    maxEval = eval;
                    bestMove = i;
                }
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
        }
        return depth === 0 ? { index: bestMove } : maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].textContent === '') {
                board[i].textContent = 'X';
                const eval = minimax(board, player, depth + 1, alpha, beta, true);
                board[i].textContent = '';
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
};


    // Function to check if there is a winner
    const checkWinner = () => {
        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return (
                gameCells[a].textContent === currentPlayer &&
                gameCells[b].textContent === currentPlayer &&
                gameCells[c].textContent === currentPlayer
            );
        });
    };

    // Function to check if the game is a draw
    const checkDraw = () => {
        return [...gameCells].every(cell => cell.textContent !== '');
    };

    // Function to get the current player's turn message
    const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

    // Event listener for Player vs Player button
    playerVsPlayerButton.addEventListener('click', () => {
        isPlayerVsAI = false; // Set to false as it's Player vs Player mode
        startNewGame();
    });

    // Event listener for Player vs AI button
    playerVsAIButton.addEventListener('click', () => {
        isPlayerVsAI = true; // Set to true as it's Player vs AI mode
        startNewGame();
    });

    const restartGame = () => {
        gameActive = false;
        currentPlayer = 'X';
        messageBox.textContent = 'Click "Player vs Player" or "Player vs AI" to start a new game.';
        gameCells.forEach(cell => {
            cell.textContent = '';
            cell.removeEventListener('click', handleCellClick);
        });
    };

    // Event listener for restart button
    restartButton.addEventListener('click', restartGame);
});
