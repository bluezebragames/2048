// each tile knows where it is and what its value is
Tile = function(x,y,value){
	this.x = x;
	this.y = y;
	this.value = value;

	this.draw = function(){
		Game.context.fillRect(0,0,50,50);
	}
}

/*Tile.draw = function(){
	
}*/

Game = {};

Game.launch = function(){
	//Game.canvas = document.getElementById("canvas");
	Game.context = document.getElementById("canvas").getContext("2d");
	Game.tile = new Tile(0,0,2);
	Game.tile.draw();
}

window.onload = function(){
	Game.launch();
}