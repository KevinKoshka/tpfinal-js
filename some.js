/*-------HELPER FUNCTIONS--------*/

/*Función que permite comparar arreglos entre sí.*/

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

/*Función que determina la existencia de un valor en un arreglo.*/

function isInArray(value, array){
	if(array.indexOf(value) > -1){
		return true;
	} else {
		return false;
	}
}


/*-------LABRYNTH CODE--------*/

/*
Cargo los 3 sonidos:
- caos    : suena cuando los usuarios se alejan del camino indicado
(no pulsan ningun contacto).
- orden   : suena cuando al menos un usuario va por el camino indicado
(pulsa un contacto).
- armonia : suena cuando dos usuarios se encuentran en posiciones
adyacentes el uno del otro (se pulsan dos contactos adyacentes).
*/
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

/*Teclas mapeadas:
			 [q,  w,  e,  r,  t,  y,  u,  i,  o,  p ]*/
var teclas = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80];

/*Todos los pares posibles de teclas adyacentes.*/
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

/*Distintos estados*/
var caotico = 'ESTÁ SONANDO CAOS';
var ordenado = 'ESTÁ SONANDO ORDEN';
var armonico = 'ESTÁ SONANDO ARMONÍA';
var estado = caotico;
var timeouts = [];
var hotkey = [];
console.log(event);

/*Función que mata todos los timeouts que estén de más. No debe
haber más de un timeout por vez.*/
function killTimeouts(){
	if(timeouts.length >= 1){
		clearTimeout(timeouts[0]);
		timeouts.pop();
	}
}


/*Handlers que se encargan de mapear todas las teclas que se han presionado
durante 'keydown' y 'keyup'. Solo los valores que están siendo presionados
tienen valor true.*/
onkeydown = onkeyup = function(e){
	var e = e || event;
	hotkey[e.keyCode] = e.type == 'keydown';
}

/*Inicia el caos.*/
caos.togglePlay().loop();


$(window).on('keydown', function(key){

	/*Se guardan solo las teclas que están siendo presionadas en 'currentKeys'*/
	var currentKeys = [];
	for(var i = 0; i < hotkey.length; i++){
		if(hotkey[i]){
			currentKeys.push(i);
		}
	}
	//Si se presionan 2 teclas...
	if(currentKeys.length == 2){
		for(var i = 0; i < pares.length; i++){
			//...si las teclas presionadas corresponden algun valor de 'pares'...
			if(pares[i].equals(currentKeys)){
				//...si no está sonando armonía...
				if((estado !== armonico) && (armonia.isPaused())){
					//...se pasa de caos u orden a armonía.
					if((estado == ordenado) && (!orden.isPaused())){
						killTimeouts();
						orden.fadeWith(armonia, 2000).loop();
						estado = armonico;
						console.log(estado);
					} else if((estado == caotico) && (!caos.isPaused())){
						caos.fadeWith(armonia, 2000).loop();
						estado = armonico;
						console.log(estado);
					}
				}
			}
		}
	}
	/*Si la tecla presionada corresponde a 'teclas' y esta sonando caos, comienza a
	sonar orden*/
	if(isInArray(key.which, teclas)){
		if(estado == caotico){
			if(!caos.isPaused()){
				caos.fadeWith(orden, 2000).loop();
				killTimeouts();
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
	/*Si se soltó una tecla de dos que estaban siendo presionadas, suena orden.*/
	if(currentKeys.length == 1){
		if(isInArray(currentKeys[0], teclas)){
			if(estado == armonico){
				if(!armonia.isPaused()){
					armonia.fadeWith(orden, 2000).loop();
					killTimeouts();
					estado = ordenado;
					console.log(estado);
				}
			}
		}
	} else if(isInArray(key.which, teclas)){
		if(estado == ordenado || estado == armonico){
			/*Si no hay ningún timeout corriendo, se espera al timeout para dar un
			tiempo de gracia después que se suelta una tecla para iniciar con el caos.*/
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