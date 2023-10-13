/** TIC-TAC-TOE
 * GUI: show board through html and css
 * Input: user place X or O in the board
 * Output: show updated board and let computer place X or O on board
 * 
 * 
 * let X be 1
 * let O be -1
 * 
 * player would win if a row, column, or diagonal row is equal to 3 (for X) or -3 (for O)
 */

const MOVE_TYPE = {
    X: 1,
    O: -1
}

function createLocation(x, y){
    return {
        x,y
    }
}

/**
 * 
 * @param {String} name 
 * @param {MOVE_TYPE} moveType 
 * @returns 
 */
function createPlayer(name, moveType){
    let playerName = name;
    let playerMoveType;

    const setMoveType = () => {
        if(moveType !== MOVE_TYPE.X && moveType !== MOVE_TYPE.O){
            throw new Error("Illegal move type!");
        } else {
            playerMoveType = moveType;
        }
    }
    const getName = () => playerName;
    const getMoveType = () => playerMoveType;

    setMoveType();

    return {
        getName,
        getMoveType
    }
}


const gameBoard = (function(doc){
        
    const mainBoard = [
        [0,0,0],
        [0,0,0],
        [0,0,0],
    ];

    function showBoard(){
        doc.querySelector("#game-board").textContent = mainBoard.toString();
    }


    /**
     * 
     * @param {Int} moveType 
     * @param {{Int,Int}} location 
     */
    function placeMove(moveType, location){
        console.log(`place ${moveType} at ${location.x}, ${location.y}`);
        mainBoard[location.x][location.y] = moveType;
        checkWinning();
    }

    function checkWinning(){
        let rowResult = checkWinningRow();
        let colResult = checkWinningColumn();
        let diagResult = checkWinningDiagonal();

        if(rowResult === 3 || rowResult === -3){
            console.log("someone win!");
        } else if (colResult === 3 || colResult === -3){
            console.log("someone win!");
        } else if (diagResult === 3 || diagResult === -3){
            console.log("someone win!");
        } else {
            console.log("...");
        }
    }

    function checkWinningRow(){
        for(let i = 0; i<mainBoard.length; i++){
            let rowSum = mainBoard[i].reduce((totalVal,currentVal) => {
                return totalVal + currentVal;
            },0);

            if(rowSum === 3 || rowSum === -3){
                return rowSum;
            }
        }
        return -1;
    }

    function checkWinningColumn(){
        let sumColOne = 0;
        let sumColTwo = 0;
        let sumColThree = 0;
        
        for(let j = 0; j < mainBoard[0].length; j++){
            for(let i = 0; i < mainBoard.length; i++){
                if(j === 0){
                    sumColOne += mainBoard[i][j];
                }else if(j === 1){
                    sumColTwo += mainBoard[i][j];
                } else {
                    sumColThree += mainBoard[i][j];
                }
            }
        }
        if(sumColOne === 3 || sumColOne === -3){
            return sumColOne;
        } else if (sumColTwo === 3 || sumColTwo === -3){
            return sumColTwo;
        } else if (sumColThree === 3 || sumColThree === -3){
            return sumColThree;
        } else {
            return -1;
        }
    }

    function checkWinningDiagonal(){
        let sumDiagOne = mainBoard[0][0] + mainBoard[1][1] + mainBoard[2][2];
        let sumDiagTwo = mainBoard[0][2] + mainBoard[1][1] + mainBoard[0][0];

        if(sumDiagOne === 3 || sumDiagOne === -3){
            return sumDiagOne;
        } else if (sumDiagTwo === 3 || sumDiagTwo === -3){
            return sumDiagTwo;
        } else {
            return -1;
        }
    }

    return {
        showBoard,
        placeMove
    }
})(document)

//For testing
let num = 0;

document.querySelector(".add-button").addEventListener("click", (e) => {
    if(num < 3){
        gameBoard.placeMove(MOVE_TYPE.X, createLocation(num,1));
        num++;
    }
    gameBoard.showBoard();
});