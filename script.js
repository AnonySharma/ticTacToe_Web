var arr;
const huPlayer='O';
const aiPlayer='X';
const winCombos = [	[0,1,2],
					[3,4,5],
					[6,7,8],
					[0,3,6],
					[1,4,7],
					[2,5,8],
					[0,4,8],
					[2,4,6]]

const cells = document.querySelectorAll('.mini');
StartGame();

document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    restartGame();
  }
})

function StartGame() {
	document.querySelector(".winner").style.display = "none";
	arr = Array.from(Array(9).keys());
	for (var i = 0 ; i < cells.length ; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function restartGame() {
	var r = confirm("Do you want to restart the game?");
	if (r == true) {
	 	StartGame();
	}
}

function turnClick(square) {
	if(typeof arr[square.target.id] == 'number'){
		turn(square.target.id, huPlayer)
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareID, player) {
	arr[squareID] = player;
	document.getElementById(squareID).innerText = player;
	let gameWon = checkWin(arr, player)
	if (gameWon) gameOver(gameWon)
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
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "green" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lose.");
}

function declareWinner(who) {
	document.querySelector(".winner").style.display = "block";
	document.querySelector(".winner .text").innerText = who;
}

function emptySquares() {
	return arr.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(arr, aiPlayer).index;
}

function checkTie() {
	if(emptySquares().length==0){
		for(var i=0;i<cells.length;i++){
			cells[i].style.backgroundColor="yellow";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Game Tie!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var spots = emptySquares(newBoard);

	if(checkWin(newBoard, player)){
		return {score: -10};
	}
	else if(checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	}
	else if(spots.length===0){
		return {score: 0};
	}

	var moves = [];
	for(var i = 0; i < spots.length ; i++) {
		var move = {};
		move.index = newBoard[spots[i]];
		newBoard[spots[i]] = player;

		if(player == aiPlayer){
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		}
		else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;	
		}

	newBoard[spots[i]] = move.index;
	moves.push(move);
	}
	
	if(player === aiPlayer) {
		var bestScore = -1000;
		for(var i = 0; i< moves.length;i++) {
			if(moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	else {
		var bestScore = 1000;
		for(var i = 0; i< moves.length;i++) {
			if(moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}