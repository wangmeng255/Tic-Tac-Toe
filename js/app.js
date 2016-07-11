"use strict"
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

$(function() {
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
	$(".rm-board").click(function() {
		if(gameCount) {
			var reGame = $(".addGame" + gameCount).remove();
			gameCount -= 1;
			games.pop();
		}
	});
	$(".TTT").on("change", ".block input", function() {
		var boardCount = getBoardCount($(this));
		oneStep(boardCount, $(this), $(this).parent(".block"));
		$(this).closest(".game").children("input").focus();
	})
	.on("click", ".result input", function() {
		var boardCount = getBoardCount($(this));
		restart(games[boardCount], $(this).closest(".game").find(".board"));
		$(this).closest(".game").children("input").focus();
	});
});

function getBoardCount(block) {
	var className = block.closest(".game").attr("class").split(" ");
	var classNum = className[1].match(/\d$/);
	var boardCount = parseInt(classNum.toString());
	return boardCount;
}

var isWin = function (game, blockIndex, boardSelector) {
	for(var i=0; i<winArr[blockIndex].length; i+=2) {
		var sum = game.board[blockIndex] + 
				  game.board[winArr[blockIndex][i]] +
				  game.board[winArr[blockIndex][i+1]];
		if(sum===-3 || sum===3) {
			if(sum===-3) boardSelector.next().find("h2").text("X wins!");
			if(sum===3) boardSelector.next().find("h2").text("O wins!");
			var $block = boardSelector.find(".block");
			$($block.get(blockIndex)).find("svg").css("stroke", "red");
			$($block.get(winArr[blockIndex][i])).find("svg").css("stroke", "red");
			$($block.get(winArr[blockIndex][i+1])).find("svg").css("stroke", "red");
			return true;
		}
	}
	return false;
};

function oneStep(boardCount, eventTarget, eventBlock) {
	eventBlock.find("input").prop("disabled", true);
	eventBlock.css("pointer-events", "none");
	var blockIndex = eventBlock.closest(".board").find(".block").index(eventBlock);
	if(games[boardCount].steps & 1) {
		var cloneCross = $(".hidden-cross").clone();
		cloneCross.attr("class", "cross");
		cloneCross.appendTo(eventBlock.children("div"));
		games[boardCount].board[blockIndex] = -1;
	}
	else {
		var cloneCircle = $(".hidden-circle").clone();
		cloneCircle.attr("class", "circle");
		cloneCircle.appendTo(eventBlock.children("div"));
		games[boardCount].board[blockIndex] = 1;
	}
	var win = isWin(games[boardCount], blockIndex, eventTarget.closest(".board"));
	if(!win) {
		games[boardCount].steps += 1;
	}
	else {
		var closestBoard = eventTarget.closest(".board");
		closestBoard.addClass("finish");
		closestBoard.find("input").each(function() {
			if($(this).prop("disabled")===false) $(this).prop("disabled", "true");
		});
	}
}

function restart(game, board) {
	game.steps = 0;
	$.each(game.board, function(i, val) {
		game.board[i] = 0;
	});
	board.next().find("h2").html("&nbsp;");
	board.html($(".hidden").find(".board").children().clone());
	board.removeClass("finish");
}
