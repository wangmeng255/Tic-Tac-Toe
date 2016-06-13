"use strict"
$(function() {
	var gameCount = 0;
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
		var newGame = $(".hidden").clone();
		newGame.toggleClass("hidden");
		gameCount += 1;
		newGame.toggleClass("addGame" + gameCount);
		newGame.find(".board").addClass("addBoard" + gameCount);
		newGame.find(".result").addClass("invisible");
		$(".TTT").append(newGame);
		games.push($.extend(true, {}, game));
	});
	$(".re-board").click(function() {
		if(gameCount) {
			var reGame = $(".addGame" + gameCount).remove();
			gameCount -= 1;
			games.pop();
		}
	});
	$(".TTT").on("click", ".block", function() {
		$(this).css("pointer-events", "none");
		var className = $(this).parent().attr("class").split(" ");
		var classNum = className[1].match(/\d$/);
		var boardCount = parseInt(classNum.toString());
		var blockIndex = $(this).parent().find(".block").index($(this));
		if(games[boardCount].steps & 1) {
			var cloneCross = $(".hidden-cross").clone();
			cloneCross.attr("class", "cross");
			cloneCross.appendTo($(this));
			games[boardCount].board[blockIndex] = -1;
		}
		else {
			var cloneCircle = $(".hidden-circle").clone();
			cloneCircle.attr("class", "circle");
			cloneCircle.appendTo($(this));
			games[boardCount].board[blockIndex] = 1;
		}
		var win = isWin(games[boardCount], blockIndex, $(this).parent());

		if(!win) {
			games[boardCount].steps += 1;
		}
	})
	.on("click", ".result input", function() {
		var className = $(this).closest(".game").attr("class").split(" ");
		var classNum = className[1].match(/\d$/);
		var boardCount = parseInt(classNum.toString());
		restart(games[boardCount], $(this).closest(".game").find(".board"));
	});
	var isWin = function (game, blockIndex, boardSelector) {
		for(var i=0; i<winArr[blockIndex].length; i+=2)
		{
			var sum = game.board[blockIndex] + 
					  game.board[winArr[blockIndex][i]] +
					  game.board[winArr[blockIndex][i+1]];
			if(sum===-3) {
				boardSelector.next().find("h2").text("X wins!");
				return true;
			}
			if(sum===3) {
				boardSelector.next().find("h2").text("O wins!");
				return true;
			}
		}
		return false;
	};
	function restart(game, board) {
		game.steps = 0;
		//game.board = [0,0,0,0,0,0,0,0,0]; this works!!
		$.each(game.board, function(i, val) {//this doesn't work
			val = 0;
		});
		console.log(game);
		board.next().find("h2").html("&nbsp;");
		board.html($(".hidden").find(".board").children().clone());
	}
});
