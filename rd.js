var rd = {
    display: null,

    init: function() {
    	this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer())
    }
}


