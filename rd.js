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
    }
}


rd.map = {};
rd._generateMap = function() {
	var digger = new ROT.Map.Digger();
	var freeCells = [];

	var digCallback = function (x,y,value) {
		var key = x+","+y;
		if (value) { 
			this.map[key] = "#";
	 	} /* don't store walls */
	 	else {
			this.map[key] = String.fromCharCode(183);
			freeCells.push(key);
		}
	}
	digger.create(digCallback.bind(this));

    this._generateBoxes(freeCells);

	this._drawWholeMap();
}

rd._drawWholeMap = function() {
	for (var key in this.map) {
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		this.display.draw(x,y,this.map[key]);
	}
}

 
rd._generateBoxes = function(freeCells) {
    for (var i=0;i<10;i++) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        this.map[key] = String.fromCharCode(69382);
    }
};


