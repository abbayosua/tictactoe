let origBoard;
let whosTurn = 1;
let onGoingGame = false;

const OPlayer = 'O';
const XPlayer = 'X';

let OScore = 0;
let XScore = 0;


let multiplayerHack = 1;

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6], 
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2],
];

const cells = document.querySelectorAll('.cell');
startGame();
initialGame();
toggleSinglePlayer();

function initialGame() {
	document.getElementById("infoGame").innerHTML = "Let's Start The Game <br/> <button onClick='deleteInfoGame()'>Start</button>";
	document.getElementById("infoGame").style.display = "block";
	document.getElementById("whosturn").innerHTML = " ";
	onGoingGame = false;
}

function toggleSinglePlayer() {
	document.querySelector(".score-board").style.display = "none";	


	if (onGoingGame === true) {
		if (confirm("Are you sure to dismiss current Game?")) {
	startGame();
	document.getElementById("levelButton").disabled = false;
	document.getElementById("levelIndicator").innerHTML = "Easy Mode";
	document.getElementById("levelButton").innerHTML = "Impossible Mode";
	document.getElementById("whosturn").innerHTML = "Single Player Mode";
		} 
	} else {
			startGame();
			document.getElementById("levelButton").disabled = false;
			document.getElementById("levelIndicator").innerHTML = "Easy Mode";
			document.getElementById("levelButton").innerHTML = "Impossible Mode";
			document.getElementById("whosturn").innerHTML = "Single Player Mode";
		}
}

function toggleMultiplayer() {
	document.querySelector(".score-board").style.display = "block";	

	if (onGoingGame === true) {
		if (confirm("Are you sure to dismiss current Game?")) {
		startGame();
		document.getElementById("levelIndicator").innerHTML = "Multiplayer Mode";
		document.getElementById("whosturn").innerHTML = "Multi Player Mode";	 
		document.getElementById("levelButton").disabled = true;
		}
	}  else {
			startGame();
			document.getElementById("levelIndicator").innerHTML = "Multiplayer Mode";	 
			document.getElementById("whosturn").innerHTML = "Multi Player Mode";
			document.getElementById("levelButton").disabled = true;
			multiplayerHack = 1;
		}
}

function deleteInfoGame() {
	document.getElementById("infoGame").style.display = "none";
}

function startGame() {
	whosTurn = 1;
	initialGame();

	if (document.getElementById("levelIndicator").innerHTML === "Multiplayer Mode") {
		document.getElementById("whosturn").innerHTML = "Multi Player Mode";
	} else {
		document.getElementById("whosturn").innerHTML = "Single Player Mode";

	}

	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function restartGame() {
	if (onGoingGame === true) {
		if (confirm("Are you sure to dismiss current Game?")) {
		startGame();
		multiplayerHack = 1;
		}
	} else {
		startGame();
		multiplayerHack = 1;
	}
}

function whosTurnNow () {
	document.getElementById("whosturn").innerHTML = "yep";	

}

function turnClick(square) {
let theMode = document.getElementById("levelIndicator").innerHTML;
onGoingGame = true;
checkTieMultiPlayer();

	if (theMode === "Multiplayer Mode") {
		whosTurn++;
			if (whosTurn & 1) {
				multiplayerHack++;
				document.getElementById("whosturn").innerHTML = "O Player Turn";
				turn(square.target.id, XPlayer);
			} else {
				multiplayerHack++;
				document.getElementById("whosturn").innerHTML = "X Player Turn";
				turn(square.target.id, OPlayer);
			}

		
	} else {
			if (typeof origBoard[square.target.id] == 'number'){
				turn(square.target.id, OPlayer);
			if (!checkTie()) turn(bestSpot(), XPlayer);

	}
}

}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
		if (gameWon) gameOver(gameWon)
}

function checkLevel() {
let theText = document.getElementById("levelButton").innerHTML;

	if (theText === "Easy Mode") {
		document.getElementById("levelButton").innerHTML = "Impossible Mode";
		document.getElementById("levelIndicator").innerHTML = "Easy Mode";
		
	} else  {
		document.getElementById("levelButton").innerHTML = "Easy Mode";
		document.getElementById("levelIndicator").innerHTML = "Impossible Mode";
		
	}


}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);

	let gameWon = null;

	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
 	if (document.getElementById("levelIndicator").innerHTML === "Multiplayer Mode") {
		for (let index of winCombos[gameWon.index]) {
			document.getElementById(index).style.backgroundColor =
			gameWon.player == OPlayer ? "blue" : "green";
		}

		for (var i = 0; i < cells.length; i++) {
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner(gameWon.player == OPlayer ? "O Player Win!" : "X Player Win!");

		document.getElementById("whosturn").innerHTML = "Game Over!";

 	} else {
				for (let index of winCombos[gameWon.index]) {
					document.getElementById(index).style.backgroundColor =
					gameWon.player == OPlayer ? "blue" : "red";
				}

				for (var i = 0; i < cells.length; i++) {
					cells[i].removeEventListener('click', turnClick, false);
				}
				declareWinner(gameWon.player == OPlayer ? "You win!" : "You lose.");
			}
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
	onGoingGame = false;

	if (document.getElementById("levelIndicator").innerHTML === "Multiplayer Mode") {
		if (document.getElementById("whowaswin").innerHTML === "X Player Win!") {
			XScore++;
			document.getElementById("xCurrentScore").innerHTML = "X Score : " + XScore;
		} else if (document.getElementById("whowaswin").innerHTML === "O Player Win!") {
			OScore++;
			document.getElementById("oCurrentScore").innerHTML = "O Score : " + OScore;
		} 
	} 
}

function resetScore() {
	if (XScore > 0 || OScore > 0) {
		if (confirm("Are You Sure to Reset the Score? You can't undo this action")) {
			XScore = 0;
			OScore = 0;
			document.getElementById("xCurrentScore").innerHTML = "X Score : " + XScore;
			document.getElementById("oCurrentScore").innerHTML = "O Score : " + OScore;
			toggleMultiplayer();
			}
	}
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	let theText = document.getElementById("levelIndicator").innerHTML;

	if (theText === "Impossible Mode") {
		return minimax(origBoard, XPlayer).index;
	} else  {
		return emptySquares()[0];
	}

}

function checkTie() {
			if (emptySquares().length == 0) {
				for (var i = 0; i < cells.length; i++) {
					cells[i].style.backgroundColor = "green";
					cells[i].removeEventListener('click', turnClick, false);
				}
				declareWinner("Draw")
				return true;
			}
	return false;
}

function checkTieMultiPlayer() {
	if (multiplayerHack > 8) {
		for (var i = 0; i < cells.length; i++) {
					cells[i].style.backgroundColor = "green";
					cells[i].removeEventListener('click', turnClick, false);
				}
				declareWinner("Draw")
				return true;
	}
}


function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, OPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, XPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == XPlayer) {
			var result = minimax(newBoard, OPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, XPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === XPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
