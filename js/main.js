// each tile knows where it is and what its value is
Tile = function(x,y,value,cancombine){
	this.x = x;
	this.y = y;
	this.value = value;
	this.cancombine = cancombine;

	this.draw = function(){
		Game.context.fillStyle = Game.colormap.get(value);
		Game.context.fillRect(Game.tilesize*x + 5*(x+1),Game.tilesize*y + 5*(y+1), Game.tilesize, Game.tilesize);
	}
}

Game = {};


// ok so this function sets all of the cancombines to 1 before a move...
// kinda hackish
// make that extremely hackish
Game.clearCombines = function(){
	for(var x = 0; x<4; x++)
	{
		for(var y = 0; y<4; y++)
		{
			if(Game.tiles[x][y])
			{
				var tempvalue = Game.tiles[x][y].value;
				Game.tiles[x][y] = new Tile(x,y,tempvalue,1);
			}
		}
	}
}

// *sigh* I don't exactly want to do this... whatevs
Game.moveLeft = function(){
	// did anything change?
	var change = false;
	// loop y first because y is independent of moving left
	// that made no sense, but hey
	for(var y = 0; y<4; y++)
	{
		for(var x = 1; x<4; x++)
		{
			// don't move it if it's not there :P
			if(Game.tiles[x][y])
			{
				// two cases: the one to the left is either empty or equal
				if(!Game.tiles[x-1][y])
				{
					var tempvalue = Game.tiles[x][y].value;
					Game.tiles[x][y] = 0;
					Game.tiles[x-1][y] = new Tile(x-1,y,tempvalue,1);
					change = true;
					//alert(change);
				}
				if(Game.tiles[x][y].cancombine && Game.tiles[x-1][y].value === Game.tiles[x][y].value)
				{
					Game.score += Game.tiles[x][y].value;
					Game.tiles[x][y] = 0;
					Game.tiles[x-1][y] = new Tile(x-1,y,Game.tiles[x-1][y].value*2,0);
					change = true;
				}
			}
		}
	}
	Game.drawTiles();
	if(change){Game.moveLeft();}
	return change;
}

Game.moveUp = function(){
	// did anything change?
	var change = false;
	// loop x first because x is independent of moving up
	// that made no sense, but hey
	for(var x = 0; x<4; x++)
	{
		for(var y = 1; y<4; y++)
		{
			// don't move it if it's not there :P
			if(Game.tiles[x][y])
			{
				// two cases: the one above is either empty or equal
				if(!Game.tiles[x][y-1])
				{
					var tempvalue = Game.tiles[x][y].value;
					Game.tiles[x][y] = 0;
					Game.tiles[x][y-1] = new Tile(x,y-1,tempvalue,1);
					change = true;
				}
				if(Game.tiles[x][y].cancombine && Game.tiles[x][y-1].value === Game.tiles[x][y].value)
				{
					Game.score += 2*Game.tiles[x][y].value;
					Game.tiles[x][y] = 0;
					Game.tiles[x][y-1] = new Tile(x,y-1,Game.tiles[x][y-1].value*2,0);
					change = true;
				}
			}
		}
	}
	Game.drawTiles();
	if(change){Game.moveUp();}
	return change;
}

Game.moveRight = function(){
	// did anything change?
	var change = false;
	// loop y first because y is independent of moving right
	// that made no sense, but hey
	for(var y = 0; y<4; y++)
	{
		for(var x = 2; x>=0; x--)
		{
			// don't move it if it's not there :P
			if(Game.tiles[x][y])
			{
				// two cases: the one to the right is either empty or equal
				if(!Game.tiles[x+1][y])
				{
					var tempvalue = Game.tiles[x][y].value;
					Game.tiles[x][y] = 0;
					Game.tiles[x+1][y] = new Tile(x+1,y,tempvalue,1);
					change = true;
				}
				if(Game.tiles[x][y].cancombine && Game.tiles[x+1][y].value === Game.tiles[x][y].value)
				{
					Game.score += 2*Game.tiles[x][y].value;
					Game.tiles[x][y] = 0;
					Game.tiles[x+1][y] = new Tile(x+1,y,Game.tiles[x+1][y].value*2,0);
					change = true;
				}
			}
		}
	}
	Game.drawTiles();
	if(change){Game.moveRight();}
	return change;
}

Game.moveDown = function(){
	// did anything change?
	var change = false;
	// loop x first because x is independent of moving down
	// that made no sense, but hey
	for(var x = 0; x<4; x++)
	{
		for(var y = 2; y>=0; y--)
		{
			// don't move it if it's not there :P
			if(Game.tiles[x][y])
			{
				// two cases: the one above is either empty or equal
				if(!Game.tiles[x][y+1])
				{
					var tempvalue = Game.tiles[x][y].value;
					Game.tiles[x][y] = 0;
					Game.tiles[x][y+1] = new Tile(x,y+1,tempvalue,1);
					change = true;
				}
				if(Game.tiles[x][y].cancombine && Game.tiles[x][y+1].value === Game.tiles[x][y].value)
				{
					Game.score += 2*Game.tiles[x][y].value;
					Game.tiles[x][y] = 0;
					Game.tiles[x][y+1] = new Tile(x,y+1,Game.tiles[x][y+1].value*2,0);
					change = true;
				}
			}
		}
	}
	Game.drawTiles();
	if(change){Game.moveDown();}
	return change;
}

// finds random spot on grid to place the tile which is dropped every turn
Game.randomtile = function(){
	var x,y;
	do
	{
		x = Math.floor(Math.random()*4);
		y = Math.floor(Math.random()*4);
	}
	while (Game.tiles[x][y]);
	Game.tiles[x][y] = new Tile(x,y,Game.randomvalue(),1);
	Game.drawTiles();
	Game.isGameOver();
}

// a wrapper function! tasty
Game.isGameOver = function()
{
	if(Game.checkGameOver())
	{
		Game.gameOver();
	}
}

// is the game finally done yet?
Game.checkGameOver = function(){
	for(var x = 0; x<4; x++)
	{
		for(var y = 0; y<4; y++)
		{
			if(!Game.tiles[x][y]){return false;}
			//left
			if(x!=0 && Game.tiles[x][y].value == Game.tiles[x-1][y].value){return false;}
			//right
			if(x!=3 && Game.tiles[x][y].value == Game.tiles[x+1][y].value){return false;}
			//up
			if(y!=0 && Game.tiles[x][y].value == Game.tiles[x][y-1].value){return false;}
			//down
			if(y!=3 && Game.tiles[x][y].value == Game.tiles[x][y+1].value){return false;}
		}
	}
	return true;
}

// oh, the game's over!  let's do this
Game.gameOver = function(){
	var highscoreString = "";
	if(Game.score > Game.highscore)
	{
		Game.highscore = Game.score;
		localStorage.setItem("highscore", Game.highscore);
		alert("Your score: " + Game.score + "\nHighscore: " + Game.highscore + "\nNew highscore!");
	}
	else{
		alert("Your score: " + Game.score + "\nHighscore: " + Game.highscore);
	}
}


// and we need a random value for that random tile
Game.randomvalue = function(){
	var temp = Math.floor(Math.random() * 4);
	if(temp === 0){return 4;}
	return 2;
}

// actually draws border and tiles, but hey
Game.drawTiles = function(){

	Game.context.fillStyle = "#707070";
	Game.context.fillRect(0,0,Game.tilesize*4+5*5, Game.tilesize*4+5*5);
	Game.context.fillStyle = "#B4B4B4";

	for(var x = 0; x<4; x++)
	{
		for(var y = 0; y<4; y++)
		{
			if(Game.tiles[x][y]){Game.tiles[x][y].draw();}
			else{
				Game.context.fillStyle = "#B4B4B4";
				Game.context.fillRect(Game.tilesize*x + 5*(x+1),Game.tilesize*y + 5*(y+1), Game.tilesize, Game.tilesize);
			}
		}
	}
}

// maps each value to a color
Game.initializeColormap = function(){
	Game.colormap.set(2,"#FFFFFF");
	Game.colormap.set(4,"#DBDBA2");
	Game.colormap.set(8,"#F5B776");
	Game.colormap.set(16,"#DE882C");
	Game.colormap.set(32,"#DE562C");
	Game.colormap.set(64,"#DE2C2C");
	Game.colormap.set(128,"#F1F5C6");
	Game.colormap.set(256,"#E4ED7B");
	Game.colormap.set(512,"#DBED11");
	Game.colormap.set(1024,"#A7ED11");
	Game.colormap.set(2048,"#3DED11");
	Game.colormap.set(4096,"#11EDB6");
	Game.colormap.set(8192,"#000000");
}

// let's launch this thing
Game.launch = function(){
	Game.score = 0;
	if(localStorage.getItem("highscore")){Game.highscore = localStorage.getItem("highscore");}
	else{Game.highscore = 0;}
	Game.canvas = document.getElementById("canvas")
	Game.context = Game.canvas.getContext("2d");
	Game.tilesize = (Math.min(Game.canvas.width, Game.canvas.height) - 5*5) / 4;
	Game.tiles = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	// fancy coding guys, we're using a map
	Game.colormap = new Map();
	Game.initializeColormap();
	Game.randomtile();
}

keyhandler = function(e){
	e = e||event;
	switch(e.keyCode)
	{
	case 37:
		Game.clearCombines();
		if(Game.moveLeft()){Game.randomtile();}
		return false;
	case 38:
		Game.clearCombines();
		if(Game.moveUp()){Game.randomtile();}
		return false;
	case 39:
		Game.clearCombines();
		if(Game.moveRight()){Game.randomtile();}
		return false;
	case 40:
		Game.clearCombines();
		if(Game.moveDown()){Game.randomtile();}
		return false;
	}
}

window.onload = function(){
	Game.launch();
	window.addEventListener("keydown", keyhandler, false);
}