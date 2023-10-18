/** TIC-TAC-TOE
 * GUI: show board through html and css
 * Input: user place X or O in the board
 * Output: show updated board and let computer place X or O on board
 * 
 * 
 * let X be 1
 * let O be -1
 * 
 * player would win if a row, column, or diagonal row is equal 
 * to 3 (for X) or -3 (for O)
 * 
 * Logic:
 * Gameboard: no knowledge of player, only check placement and calculate if X or O wins
 * Game: acutal game logic, handle score, turn change, and assigning X or O to players
 */

//game main class
const game = (function (mainDoc) {
    //Enum classes
    const MOVE_TYPE = {
        X: 1,
        O: -1
    }

    const BOARD_STATE = {
        X_WIN: "X_WIN",
        O_WIN: "O_WIN",
        DRAW: "DRAW",
        ONGOING: "ONGOING"
    }

    //Data classes

    /**
     * 
     * @param {Int} x 
     * @param {Int} y 
     * @returns 
     */
    function createLocation(x, y) {
        return {
            x, y
        }
    }

    /**
     * 
     * @param {String} name 
     * @param {MOVE_TYPE} moveType
     * @param {boolean} isComputer 
     * @returns 
     */
    function createPlayer(name, moveType, isComputer = false) {
        let playerScore = 0;
        let playerName = name;
        let playerMoveType;
        let playerIsComputer = isComputer;

        const incrementScore = () => {
            playerScore += 1;
        }

        const resetScore = () => {
            playerScore = 0;
        }

        const setMoveType = () => {
            if (moveType !== MOVE_TYPE.X && moveType !== MOVE_TYPE.O) {
                throw new Error("Illegal move type!");
            } else {
                playerMoveType = moveType;
            }
        }

        const setName = (newName) => {
            playerName = newName;
        }

        const getScore = () => playerScore;
        const getName = () => playerName;
        const getMoveType = () => playerMoveType;
        const checkIfIsComputer = () => playerIsComputer;

        setMoveType();

        return {
            getName,
            getMoveType,
            getScore,
            incrementScore,
            resetScore,
            setName,
            checkIfIsComputer
        }
    }

    //Turn management
    const turnManager = (function (doc) {
        const TURN = {
            PLAYER_TURN: 0,
            COMPUTER_TURN: 1
        }
        const playerScoreDisplay = doc.querySelector("#player-score");
        const computerScoreDisplay = doc.querySelector("#computer-score");
        const playerNameDisplay = doc.querySelector("#player-display-name");
        const comNameDisplay = doc.querySelector("#computer-display-name");
        const currentTurnDisplay = doc.querySelector(".current-turn-display");

        let currentTurn;
        let player = createPlayer("Player", MOVE_TYPE.X);
        let computer = createPlayer("Computer", MOVE_TYPE.O, true);

        function randomizeFirstTurn() {
            (Math.random() < 0.5) ? currentTurn = TURN.PLAYER_TURN : currentTurn = TURN.COMPUTER_TURN;
            updateTurnDisplay();
        }

        function advanceTurn() {
            if (currentTurn === TURN.PLAYER_TURN) {
                currentTurn = TURN.COMPUTER_TURN;
            } else {
                currentTurn = TURN.PLAYER_TURN;
            }
            updateTurnDisplay();
        }

        function getCurrentPlayer() {
            if (currentTurn === TURN.PLAYER_TURN) {
                return player;
            } else {
                return computer;
            }
        }

        function incrementcurrentPlayerScore() {
            if (currentTurn === TURN.PLAYER_TURN) {
                player.incrementScore();
            } else {
                computer.incrementScore();
            }
            displayScore();
            updateTurnDisplay();
        }

        function resetScoreBoard() {
            player.resetScore();
            computer.resetScore();
            displayScore();
            updateTurnDisplay();
        }

        function displayScore() {
            playerScoreDisplay.textContent = player.getScore();
            computerScoreDisplay.textContent = computer.getScore();
        }

        function displayNames() {
            playerNameDisplay.textContent = player.getName();
            comNameDisplay.textContent = computer.getName();
        }

        function updateTurnDisplay() {
            currentTurnDisplay.textContent = `${getCurrentPlayer().getName()}'s Turn`.toUpperCase();
        }

        function setPlayerNames(playerName, computerName) {
            player.setName(playerName);
            computer.setName(computerName);
        }

        function getPlayer() {
            return player;
        }

        function getComputer() {
            return computer;
        }

        return {
            randomizeFirstTurn,
            advanceTurn,
            getCurrentPlayer,
            incrementcurrentPlayerScore,
            resetScoreBoard,
            setPlayerNames,
            displayNames,
            updateTurnDisplay,
            getPlayer,
            getComputer
        }
    })(mainDoc);

    //computer AI logic
    const calculationLogic = (function (manager) {
        let computerPlayerData = null;

        function playRandomMove(board) {
            let availablePosition = [];
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === 0) {
                        availablePosition.push([i, j]);
                    }
                }
            }

            if (availablePosition.length > 0) {
                let randomPosition = Math.floor(Math.random() * (availablePosition.length - 1));
                let x = availablePosition[randomPosition][0];
                let y = availablePosition[randomPosition][1];

                computerPlayerData = createLocation(x, y);
            } else {
                return null;
            }
        }

        function playSmartMove(board) {
            computerPlayerData = findBestMove(board);
        }

        function getComputerData() {
            if (computerPlayerData != null) {
                return computerPlayerData;
            } else {
                throw new Error("computer has not play a move yet!");
            }
        }

        function playMoveAndReturnData(board, isSmartPlay = true) {
            if(isSmartPlay){
               playSmartMove(board); 
            } else {
               playRandomMove(board);
            }
            
            return getComputerData();
        }

        function findBestMove(board) {
            let bestMove = {
                x: null,
                y: null,
                value: -1000
            };

            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === 0) {
                        board[i][j] = manager.getPlayer().getMoveType();

                        let bestVal = minimax(board, 0, false);

                        board[i][j] = 0;

                        if (bestVal > bestMove.value) {
                            bestMove.x = i;
                            bestMove.y = j;
                            bestMove.value = bestVal;
                        }
                    }
                }
            }
            console.log(`optimal value is ${bestMove.value}`);
            return createLocation(bestMove.x, bestMove.y);
        }

        function calculateWinning(board) {
            let rowResult = checkWinningRow(board);
            let colResult = checkWinningColumn(board);
            let diagResult = checkWinningDiagonal(board);

            if (rowResult === 3 || rowResult === -3) {
                return rowResult;
            } else if (colResult === 3 || colResult === -3) {
                return colResult;
            } else if (diagResult === 3 || diagResult === -3) {
                return diagResult;
            } else {
                return 0;
            }
        }

        function checkWinningRow(board) {
            for (let i = 0; i < board.length; i++) {
                let rowSum = board[i].reduce((totalVal, currentVal) => {
                    return totalVal + currentVal;
                }, 0);

                if (rowSum === 3 || rowSum === -3) {
                    return rowSum;
                }
            }
            return 0;
        }

        function checkWinningColumn(board) {
            let sumColOne = 0;
            let sumColTwo = 0;
            let sumColThree = 0;

            for (let j = 0; j < board[0].length; j++) {
                for (let i = 0; i < board.length; i++) {
                    if (j === 0) {
                        sumColOne += board[i][j];
                    } else if (j === 1) {
                        sumColTwo += board[i][j];
                    } else {
                        sumColThree += board[i][j];
                    }
                }
            }
            if (sumColOne === 3 || sumColOne === -3) {
                return sumColOne;
            } else if (sumColTwo === 3 || sumColTwo === -3) {
                return sumColTwo;
            } else if (sumColThree === 3 || sumColThree === -3) {
                return sumColThree;
            } else {
                return 0;
            }
        }

        function checkWinningDiagonal(board) {
            let sumDiagOne = board[0][0] + board[1][1] + board[2][2];
            let sumDiagTwo = board[0][2] + board[1][1] + board[2][0];

            if (sumDiagOne === 3 || sumDiagOne === -3) {
                return sumDiagOne;
            } else if (sumDiagTwo === 3 || sumDiagTwo === -3) {
                return sumDiagTwo;
            } else {
                return 0;
            }
        }

        function checkIfBoardFull(board) {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        function minimax(board, depth, isMax) {
            let score = calculateWinning(board);
            if (score === 3) {
                return score - depth;
            }

            if (score === -3) {
                return depth - score;
            }

            if (checkIfBoardFull(board)) {
                return 0;
            }

            if (isMax) {
                let bestVal = -1000;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 0) {
                            board[i][j] = manager.getPlayer().getMoveType();

                            bestVal = Math.max(bestVal, minimax(board, depth + 1, !isMax));

                            board[i][j] = 0;
                        }
                    }
                }
                return bestVal;

            } else {
                let bestVal = 1000;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 0) {
                            board[i][j] = manager.getComputer().getMoveType();

                            bestVal = Math.min(bestVal, minimax(board, depth + 1, !isMax));

                            board[i][j] = 0;
                        }
                    }
                }
                return bestVal;
            }
        }

        return {
            playMoveAndReturnData,
            calculateWinning,
            checkIfBoardFull
        }
    })(turnManager);

    //Board logic
    const gameBoard = (function (doc, manager, calLogic) {

        let mainBoard = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        let currentBoardState = BOARD_STATE.ONGOING;

        function initBoard() {
            resetBoard();
            updateBoard();
        }

        function updateBoard() {
            //when logging array, use its copy
            //this is because browser log are slow, so it will run after all operations finish
            //to get snapshot of value, make copy of it and log it instead
            //console.log(mainBoard.slice(0));

            let board = doc.querySelector("#game-board");
            board.textContent = "";

            for (let i = 0; i < mainBoard.length; i++) {
                for (let j = 0; j < mainBoard[i].length; j++) {
                    let cell = doc.createElement("div");
                    cell.classList.add("game-cell");
                    cell.setAttribute("data-x", i);
                    cell.setAttribute("data-y", j);

                    cell.addEventListener("click", (e) => {
                        if (e.target.hasAttribute("data-x") &&
                            e.target.hasAttribute("data-y")) {
                            if (!manager.getCurrentPlayer().checkIfIsComputer()) {
                                placeMove(
                                    manager.getCurrentPlayer().getMoveType(),
                                    createLocation(
                                        parseInt(e.target.getAttribute("data-x")),
                                        parseInt(e.target.getAttribute("data-y"))
                                    )
                                )
                            }
                        }
                    });

                    switch (mainBoard[i][j]) {
                        case 0: {
                            cell.textContent = " ";
                            break;
                        }
                        case 1: {
                            cell.textContent = "X";
                            break;
                        }
                        case -1: {
                            cell.textContent = "O";
                            break;
                        }
                    }
                    board.appendChild(cell);
                }
            }
        }

        function resetBoard() {
            mainBoard = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ];
            currentBoardState = BOARD_STATE.ONGOING;
            manager.randomizeFirstTurn();
            playComputerMoveIfItsTurn();
        }

        function getCurrentBoardState() {
            return currentBoardState;
        }

        function playComputerMoveIfItsTurn() {
            if (manager.getCurrentPlayer().checkIfIsComputer()) {
                if (calLogic.checkIfBoardFull(mainBoard) == false) {
                    setTimeout(() => {
                        placeMove(
                            manager.getCurrentPlayer().getMoveType(),
                            calLogic.playMoveAndReturnData(mainBoard)
                        )
                    }, 500);
                }
            }
        }

        function showToast(message) {
            const toastModal = doc.querySelector(".toast-container");
            toastModal.querySelector(".toast").textContent = message;
            toastModal.showModal();
            toastModal.addEventListener("click", (e) => {
                toastModal.close();
            });
        }

        /**
         * 
         * @param {Int} moveType 
         * @param {{Int,Int}} location 
         */
        function placeMove(moveType, location) {
            if (isLocationEmpty(location) && currentBoardState === BOARD_STATE.ONGOING) {
                console.log(`place ${moveType} at ${location.x}, ${location.y}`);
                mainBoard[location.x][location.y] = moveType;
                displayWinning();
                updateBoard();
                manager.advanceTurn();
                playComputerMoveIfItsTurn();
            }
        }


        /**
         * 
         * @param {{Int,Int}} location 
         */
        function isLocationEmpty(location) {
            if (mainBoard[location.x][location.y] === 0) {
                return true;
            } else {
                return false;
            }
        }

        function displayWinning() {
            let result = calLogic.calculateWinning(mainBoard);
            let boardFullCheck = calLogic.checkIfBoardFull(mainBoard);
            if (result === 3) {
                console.log("X win!");
                showToast(`X win, ${turnManager.getCurrentPlayer().getName()} has won this game!`);
                turnManager.incrementcurrentPlayerScore();
                currentBoardState = BOARD_STATE.X_WIN;
            } else if (result === -3) {
                console.log("O win!");
                showToast(`O win! ${turnManager.getCurrentPlayer().getName()} has won this game!`);
                turnManager.incrementcurrentPlayerScore();
                currentBoardState = BOARD_STATE.O_WIN;
            } else if (result !== -3 && result !== 3 && boardFullCheck) {
                console.log("draw!");
                showToast("draw!");
                currentBoardState = BOARD_STATE.DRAW;
            } else {
                console.log("...");
            }
        }


        return {
            initBoard,
            placeMove,
            getCurrentBoardState
        }
    })(mainDoc, turnManager, calculationLogic)

    const gameContainer = mainDoc.querySelector(".game-container");
    const scoreBoard = mainDoc.querySelector(".score-board");

    function initGame() {
        askForNameDialog();
    }

    function resetGame() {
        gameBoard.initBoard();
    }

    function hideGame() {
        gameContainer.style.display = "none";
        scoreBoard.style.display = "none";
    }

    function showGame() {
        gameContainer.classList.add("container-slideIn");
        gameContainer.style.display = "grid";

        setTimeout(() => {
            scoreBoard.classList.add("scoreboard-slideIn");
            scoreBoard.style.display = "table";
        }, 1000);
    }

    function askForNameDialog() {
        hideGame();

        const formModal = mainDoc.querySelector(".form-container");
        const form = mainDoc.querySelector(".name-form");
        const button = mainDoc.querySelector(".submit-button");

        formModal.showModal();

        button.addEventListener("click", (e) => {
            if (!form.checkValidity()) {
                form.reportValidity();
            } else {
                e.preventDefault();
                const playerNameInput = mainDoc.querySelector("#player-name").value;
                const comNameInput = mainDoc.querySelector("#computer-name").value;
                turnManager.setPlayerNames(
                    (playerNameInput == null) ? "Player (you)" : `${playerNameInput} (you)`,
                    (comNameInput == null) ? "Computer" : comNameInput
                )
                turnManager.displayNames();
                turnManager.updateTurnDisplay();
                gameBoard.initBoard();
                formModal.close();
                showGame();
            }
        });
    }

    return {
        initGame,
        resetGame
    }

})(document);


//For testing
game.initGame();
document.querySelector(".reset-board-button").addEventListener("click", (e) => {
    game.resetGame();
});