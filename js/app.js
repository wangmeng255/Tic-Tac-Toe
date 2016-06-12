"use strict"
$(function() {
	var boardCount = 0;
	var game = {
		steps: 0,
		board: [0,0,0,0,0,0,0,0,0]
	};
	var games = [];
	games.push($.extend(true, {}, game));

	var winArr = [[1,2,3,6,4,8],
			   [0,2,4,7],
			   [0,1,5,8,4,6],
			   [0,6,4,5],
			   [0,8,1,7,2,6,3,5],
			   [2,8,3,4],
			   [0,3,2,4,7,8],
			   [1,4,6,8],
			   [0,4,2,5,6,7]];

	$(".new-board").click(function() {
		var newBoard = $(".hidden").clone();
		newBoard.toggleClass("hidden");
		boardCount += 1;
		newBoard.toggleClass("addBoard" + boardCount);
		$(".TTT").append(newBoard);
		games.push($.extend(true, {}, game));
	});
	$(".re-board").click(function() {
		var reBoard = $(".addBoard" + boardCount).remove();
		boardCount -= 1;
		games.pop();
	});
	$(".TTT").on("click", ".block", function() {
		$(this).css("pointer-events", "none");
		var className = $(this).parent().attr("class").split(" ");
		var classNum = className[1].match(/\d$/);
		var gameCount = parseInt(classNum.toString());
		var blockIndex = $(this).parent().find(".block").index($(this));
		if(games[gameCount].steps & 1) {
			var cloneCross = $(".hidden-cross").clone();
			cloneCross.attr("class", "cross");
			cloneCross.appendTo($(this));
			games[gameCount].board[blockIndex] = -1;
		}
		else {
			var cloneCircle = $(".hidden-circle").clone();
			cloneCircle.attr("class", "circle");
			cloneCircle.appendTo($(this));
			games[gameCount].board[blockIndex] = 1;
		}
		var win = isWin(games[gameCount], blockIndex, $(this).parent());

		if(!win) {
			games[gameCount].steps += 1;
			if(games[gameCount].steps===9) restart(game, $(this).parent());
		}
	});
	var isWin = function (game, blockIndex, boardSelector) {
		for(var i=0; i<winArr[blockIndex].length; i+=2)
		{
			var sum = game.board[blockIndex] + 
					  game.board[winArr[blockIndex][i]] +
					  game.board[winArr[blockIndex][i+1]];
			if(sum===-3) {
				alert("x win"); 
				restart(game, boardSelector); 
				return true;
			}
			if(sum===3) {
				alert("o win"); 
				restart(game, boardSelector); 
				return true;
			}
		}
		return false;
	};
	function restart(game, board) {
		game.steps = 0;
		jQuery.each(game.board, function(i, val) {
			val = 0;
		});
		console.log(game);
		board.html($(".hidden").children().clone());
	}
});
