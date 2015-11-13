var caos  = new buzz.sound("sounds/caos.wav", {
	preload : true,
	volume  : 20
}),
	orden = new buzz.sound("sounds/orden.wav", {
	preload : true,
	volume  : 20
});
var teclas = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80];
var caotico = 'ESTÁ SONANDO CAOS';
var ordenado = 'ESTÁ SONANDO ORDEN';
var estado = caotico;
var timeouts = [];
var hotkey = [];
console.log(event);

onkeydown = onkeyup = function(e){
	var e = e || event;
	hotkey[e.keyCode] = e.type == 'keydown';
	console.log(hotkey);
}

caos.togglePlay().loop();


$(window).on('keydown', function(key){

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
	if(isInArray(key.which, teclas)){
		if(estado == ordenado){
			if(timeouts.length < 1){
				var count = window.setTimeout(function(){
					if(!orden.isPaused()){
						orden.fadeWith(caos, 2000).loop();
						estado = caotico;
						console.log(estado);
					}
				}, 3000);
				timeouts.push(count);
			}
		}	
	}
});

function isInArray(value, array){
	if(array.indexOf(value) > -1){
		return true;
	} else {
		return false;
	}
}