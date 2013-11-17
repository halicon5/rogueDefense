/*
 interesting charcode ranges. 106400 - 107800 
						140550 - 141000
						141313 - 141567  (Braille)
						69382-69800
						[۞] 67294
[ᄼ] 69948	[ᄽ] 69949	[ᄾ] 69950	[ᄿ] 69951
[⌚] 140058	[⌛] 140059
74128 - 74550
75000 - 75500
76032 - 76159 variety of arrows
*/
var rd = {
    display: null,

    init: function() {
    	this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer());
        this._generateMap();

	    var scheduler = new ROT.Scheduler.Simple();
	    scheduler.add(this.player, true);
	    this.engine = new ROT.Engine(scheduler);
	    this.engine.start();	 
	    scheduler.add(this.player, true);
	    scheduler.add(this.pedro, true);
    }
}


rd.map = {};
rd._generateMap = function() {
	var digger = new ROT.Map.Digger();
	var freeCells = [];

	var digCallback = function (x,y,value) {
		var key = x+","+y;
		if (value) { 
//			this.map[key] = "#";
	 	} /* don't store walls */
	 	else {
			this.map[key] = String.fromCharCode(183);
			freeCells.push(key);
		}
	}
	digger.create(digCallback.bind(this));

    this._generateBoxes(freeCells);

	this._drawWholeMap();

//    this._createPlayer(freeCells);
	this.player = this._createBeing(Player, freeCells);
	this.pedro = this._createBeing(Pedro, freeCells);
}

rd._drawWholeMap = function() {
	for (var key in this.map) {
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		var color = "#fff";
		if (this.map[key] === "*") {
			color = "#0f0";
		}
		if (this.map[key] === String.fromCharCode(183) ) {
			color = "#555";
		}
		this.display.draw(x,y,this.map[key], color);
	}
}

rd.engine = null;

rd.ananas = null;

rd._generateBoxes = function(freeCells) {
    for (var i=0;i<10;i++) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        this.map[key] = "*";
        if (!i) { this.ananas = key; } /* first box contains an ananas */
    }
};

 

rd.player = null;

 
rd._createPlayer = function(freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    this.player = new Player(x, y);
};











var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}
 
Player.prototype._draw = function() {
    rd.display.draw(this._x, this._y, "@", "#ff0");
}


Player.prototype.act = function() {
   rd.engine.lock();
    window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
    var code = e.keyCode;
    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }

	var keyMap = {}; 
	keyMap[38] = 0; // up
	keyMap[33] = 1;
	keyMap[39] = 2; // right
	keyMap[34] = 3;
	keyMap[40] = 4; // down
	keyMap[35] = 5;
	keyMap[37] = 6; // left
	keyMap[36] = 7;
  
    if (!(code in keyMap)) { return; }
 
    var diff = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + diff[0];
    var newY = this._y + diff[1];
 
    var newKey = newX + "," + newY;
    if (!(newKey in rd.map)) { return; } // cannot move in this direction 

    rd.display.draw(this._x, this._y, rd.map[this._x+","+this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    window.removeEventListener("keydown", this);
    rd.engine.unlock();
}
 
Player.prototype._checkBox = function() {
    var key = this._x + "," + this._y;
    if (rd.map[key] != "*") {
        alert("There is no box here!");
    } else if (key == rd.ananas) {
        alert("Hooray! You found an ananas and won this game.");
        rd.engine.lock();
        window.removeEventListener("keydown", this);
    } else {
        alert("This box is empty :-(");
    }
}

Player.prototype.getX = function() { return this._x; }
 
Player.prototype.getY = function() { return this._y; }




var Pedro = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}
 
Pedro.prototype._draw = function() {
    rd.display.draw(this._x, this._y, "P", "red");
}

Pedro.prototype.act = function() {
    var x = rd.player.getX();
    var y = rd.player.getY();
    var passableCallback = function(x, y) {
        return (x+","+y in rd.map);
    }
    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
 
    var path = [];
    var pathCallback = function(x, y) {
        path.push([x, y]);
    }
    astar.compute(this._x, this._y, pathCallback);

    path.shift(); /* remove Pedro's position */
    if (path.length == 1) {
        rd.engine.lock();
        alert("Game over - you were captured by Pedro!");
    } else {
        x = path[0][0];
        y = path[0][1];
        rd.display.draw(this._x, this._y, rd.map[this._x+","+this._y]);
        this._x = x;
        this._y = y;
        this._draw();
    }
 
}


 
rd._createBeing = function(what, freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    return new what(x, y);
}
 
 
 
 


