document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    // DOM elements
    const statusDisplay = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    const restartBtn = document.getElementById('restart-btn');
    const themeToggle = document.getElementById('theme-toggle');

    // Winning combinations
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Game messages
    const winMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

    // Theme toggle functionality
    themeToggle.addEventListener('change', () => {
        document.body.dataset.theme = themeToggle.checked ? 'dark' : 'light';
    });

    // Initialize game
    function initializeGame() {
        cells.forEach(cell => {
            cell.addEventListener('click', cellClicked);
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        
        restartBtn.addEventListener('click', restartGame);
        
        statusDisplay.textContent = currentPlayerTurn();
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
    }

    // Handle cell click
    function cellClicked(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        // Check if cell is already filled or game is not active
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        // Update game state and UI
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    // Handle cell played
    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }

    // Handle result validation
    function handleResultValidation() {
        let roundWon = false;
        let winningCombo = [];

        // Check for win
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const condition = gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
            
            if (condition) {
                roundWon = true;
                winningCombo = [a, b, c];
                break;
            }
        }

        // Handle win
        if (roundWon) {
            statusDisplay.textContent = winMessage();
            gameActive = false;
            
            // Highlight winning cells
            winningCombo.forEach(index => {
                document.querySelector(`[data-cell-index="${index}"]`).classList.add('winner');
            });
            
            return;
        }

        // Handle draw
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.textContent = drawMessage();
            gameActive = false;
            
            // Auto restart after a short delay on tie
            setTimeout(() => {
                restartGame();
                statusDisplay.textContent = "Game tied! Starting new game...";
                setTimeout(() => {
                    statusDisplay.textContent = currentPlayerTurn();
                }, 1500);
            }, 1000);
            
            return;
        }

        // Continue game, switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = currentPlayerTurn();
    }

    // Restart game
    function restartGame() {
        initializeGame();
    }

    // Initialize game when page loads
    initializeGame();
});
