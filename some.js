/*-------HELPER FUNCTIONS--------*/


// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

function isInArray(value, array){
	if(array.indexOf(value) > -1){
		return true;
	} else {
		return false;
	}
}


/*-------LABRYNTH CODE--------*/


var caos  = new buzz.sound("sounds/caos.wav", {
	preload : true,
	volume  : 100
}),
	armonia  = new buzz.sound("sounds/jail.mp3", {
	preload : true,
	volume  : 100
}),
	orden = new buzz.sound("sounds/orden.wav", {
	preload : true,
	volume  : 100
});

var teclas = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80];
var pares = [
	[81, 87],
	[69, 87],
	[69, 82],
	[82, 84],
	[84, 89],
	[85, 89],
	[73, 85],
	[73, 79],
	[79, 80]
];
var caotico = 'ESTÁ SONANDO CAOS';
var ordenado = 'ESTÁ SONANDO ORDEN';
var armonico = 'ESTÁ SONANDO ARMONÍA';
var estado = caotico;
var timeouts = [];
var hotkey = [];
console.log(event);

onkeydown = onkeyup = function(e){
	var e = e || event;
	hotkey[e.keyCode] = e.type == 'keydown';
}

caos.togglePlay().loop();


$(window).on('keydown', function(key){

	var currentKeys = [];
	for(var i = 0; i < hotkey.length; i++){
		if(hotkey[i]){
			currentKeys.push(i);
		}
	}
	if(currentKeys.length == 2){
		for(var i = 0; i < pares.length; i++){
			console.log(0)
			if(pares[i].equals(currentKeys)){
				console.log(1)
				if((estado !== armonico) && (armonia.isPaused())){
					console.log(2)
					if((estado == ordenado) && (!orden.isPaused())){
						console.log(3)
						if(timeouts.length >= 1){
							clearTimeout(timeouts[0]);
							timeouts.pop();
						}
						orden.fadeWith(armonia, 2000).loop();
						estado = armonico;
						console.log(estado);
					} else if((estado == caotico) && (!caos.isPaused())){
						console.log(4)
						caos.fadeWith(armonia, 2000).loop();
						estado = armonico;
						console.log(estado);
					}
				}
			}
		}
	}
	
	if(isInArray(key.which, teclas)){
		if(estado == caotico){
			if(!caos.isPaused()){
				caos.fadeWith(orden, 2000).loop();
				if(timeouts.length >= 1){
					clearTimeout(timeouts[0]);
					timeouts.pop();
				}
				estado = ordenado;
				console.log(estado);
			}
		}
	}
});

$(window).on('keyup', function(key){

	var currentKeys = [];
	for(var i = 0; i < hotkey.length; i++){
		if(hotkey[i]){
			currentKeys.push(i);
		}
	}
	if(currentKeys.length == 1){
		if(isInArray(currentKeys[0], teclas)){
			if(estado == armonico){
				if(!armonia.isPaused()){
					armonia.fadeWith(orden, 2000).loop();
					if(timeouts.length >= 1){
						clearTimeout(timeouts[0]);
						timeouts.pop();
					}
					estado = ordenado;
					console.log(estado);
				}
			}
		}
	} else if(isInArray(key.which, teclas)){
		if(estado == ordenado || estado == armonico){
			if(timeouts.length < 1){
				var count = window.setTimeout(function(){
					if(!orden.isPaused()){
						orden.fadeWith(caos, 2000).loop();
						estado = caotico;
						console.log(estado);
					} else if(!armonia.isPaused()){
						armonia.fadeWith(caos, 2000).loop();
						estado = caotico;
						console.log(estado);
					}
				}, 3000);
				timeouts.push(count);
			}
		}	
	}
});