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

//game class
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
     * @returns 
     */
    function createPlayer(name, moveType) {
        let playerScore = 0;
        let playerName = name;
        let playerMoveType;

        const incrementScore = () => {
            playerScore += 1;
        }

        const setMoveType = () => {
            if (moveType !== MOVE_TYPE.X && moveType !== MOVE_TYPE.O) {
                throw new Error("Illegal move type!");
            } else {
                playerMoveType = moveType;
            }
        }

        const getScore = () => playerScore;
        const getName = () => playerName;
        const getMoveType = () => playerMoveType;

        setMoveType();

        return {
            getName,
            getMoveType,
            getScore,
            incrementScore
        }
    }

    //Board logic
    const gameBoard = (function (doc) {

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
                            placeMove(
                                MOVE_TYPE.O,
                                createLocation(
                                    parseInt(e.target.getAttribute("data-x")),
                                    parseInt(e.target.getAttribute("data-y"))
                                )
                            )
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
        }

        function getCurrentBoardState() {
            return currentBoardState;
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
            let result = calculateWinning();
            let boardFullCheck = checkIfBoardFull();
            if (result === 3) {
                console.log("X win!");
                currentBoardState = BOARD_STATE.X_WIN;
            } else if (result === -3) {
                console.log("O win!");
                currentBoardState = BOARD_STATE.O_WIN;
            } else if (result !== -3 && result !== 3 && boardFullCheck) {
                console.log("draw!");
                currentBoardState = BOARD_STATE.DRAW;
            } else {
                console.log("...");
            }
        }

        function checkIfBoardFull() {
            for (let i = 0; i < mainBoard.length; i++) {
                for (let j = 0; j < mainBoard[i].length; j++) {
                    if (mainBoard[i][j] === 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        function calculateWinning() {
            let rowResult = checkWinningRow();
            let colResult = checkWinningColumn();
            let diagResult = checkWinningDiagonal();

            if (rowResult === 3 || rowResult === -3) {
                return rowResult;
            } else if (colResult === 3 || colResult === -3) {
                return colResult;
            } else if (diagResult === 3 || diagResult === -3) {
                return diagResult;
            } else {
                return -1;
            }
        }

        function checkWinningRow() {
            for (let i = 0; i < mainBoard.length; i++) {
                let rowSum = mainBoard[i].reduce((totalVal, currentVal) => {
                    return totalVal + currentVal;
                }, 0);

                if (rowSum === 3 || rowSum === -3) {
                    return rowSum;
                }
            }
            return -1;
        }

        function checkWinningColumn() {
            let sumColOne = 0;
            let sumColTwo = 0;
            let sumColThree = 0;

            for (let j = 0; j < mainBoard[0].length; j++) {
                for (let i = 0; i < mainBoard.length; i++) {
                    if (j === 0) {
                        sumColOne += mainBoard[i][j];
                    } else if (j === 1) {
                        sumColTwo += mainBoard[i][j];
                    } else {
                        sumColThree += mainBoard[i][j];
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
                return -1;
            }
        }

        function checkWinningDiagonal() {
            let sumDiagOne = mainBoard[0][0] + mainBoard[1][1] + mainBoard[2][2];
            let sumDiagTwo = mainBoard[0][2] + mainBoard[1][1] + mainBoard[2][0];

            if (sumDiagOne === 3 || sumDiagOne === -3) {
                return sumDiagOne;
            } else if (sumDiagTwo === 3 || sumDiagTwo === -3) {
                return sumDiagTwo;
            } else {
                return -1;
            }
        }

        return {
            initBoard,
            placeMove,
            getCurrentBoardState
        }
    })(mainDoc)

    //Game logic
    /*
        init board
        choose first turn
        let player play turn
        switch turn to computer
        repeat until one win
        when won, increment score
        restart game
    */

    const TURN = {
        PLAYER_TURN: 0,
        COMPUTER_TURN: 1
    }
    let currentTurn;
    let player = createPlayer("Player", MOVE_TYPE.X);
    let computer = createPlayer("Computer", MOVE_TYPE.O);


    function initGame() {
        gameBoard.initBoard();
        chooseFirstTurn();
    }

    function chooseFirstTurn(){
        (Math.random() < 0.5)? currentTurn = TURN.PLAYER_TURN:currentTurn = TURN.COMPUTER_TURN;
    }

    function PlayerPlayTurn(){
        //TODO
    }

    function computerPlayTurn(){
        //TODO
    }

    return {
        initGame
    }

})(document);


//For testing
game.initGame();
document.querySelector(".reset-board-button").addEventListener("click", (e) => {
    game.initGame();
});