/*Motor de juego.*/


/*
	Clase SpriteSheet
	Gestionará la carga de sprites y dibujado de sprites.
	Será usado por los elementos del juego.
	Será usado al inicializar el juego y las pantallas.


	Atributos:
		- map
		- image

	Métodos:
		- load(spriteData, callback)
		- draw(ctx,sprite,x,y,frame)
*/
var SpriteSheet = new function(){
	
	/***
	================================
				ATRIBUTOS
	================================
	***/
	/*
	 Atributo map: Diccionario que contiene la información de los sprites de cada elemento del juego
		(key) 	= nombre sprite
		(value) = coordenadas + dimensiones + cantidad de frames de ese componente
	*/
	this.map 	= {};

	/*
	 Atributo image: Imagen que contiene la hoja de sprites (Los graficos del juego)
	*/



	/***
	================================
				METODOS
	================================
	***/

	/*
	Metodo cargar: 
		- Carga los datos de la hoja de sprites a modo de diccionario de coordenadas, anchos y frames
	y asocia una llamada cuando se realice por completo la carga. crea el atributo image que será
	la carga en memoria de juego de la hoja de sprites.
		- Inputs:
			- spriteData: 	Diccionario con clave = "nombre de sprite", valor = "coordenadas, tamaño en hoja de sprites, cantidad de frames del componente"
			- callback: 	Funcion asociada que será llamada tras la carga de la hoja de sprites
		- return:
			- void: No devuelve nada 	
	*/
	this.load 	= function(spriteData, callback) {
		//Cargamos nuestro mapa para "navegar por la hoja de sprites"
		this.map 	= spriteData;
		//Creamos la imagen asociada al atributo imagen
		this.image	= new Image();
		//Asociamos una llamada a una funcion para cuando se cargue la imagen
		this.image.onload = callback;
		//Asociamos nuestro objeto imagen a la ruta de la imagen que queremos que cargue
		this.image.src = "images/sprites.png";
	};

	/*
	Metodo draw: 
		- Pinta un "sprite" de nuestra imagen de sprites sobre un "ctx" en unas coordenadas ("x","y") dadas. Indica el 
		frame correspondiente de nuestro elemento. 

		- Inputs:
			- ctx: 		Donde vamos a pintar
			- sprite: 	Nombre de sprite que queremos pintar
			- x,y: 		Coordenadas donde vamos a pintar
			- frame:  	Si el sprite tiene animacion, qué parte de la animacion queremos pintar 
		- return:
			- void: No devuelve nada 	
	*/
	this.draw	= function(ctx, sprite, x, y, frame) {
		//obtenemos los datos del sprite correspondiente de nuestro mapa
		var s = this.map[sprite];
		//Si no existe frame suponemos que queremos el primer frame
		if(!frame) frame = 0;
		//Pintamos sobre nuestro ctx el sprite indicado en las coordenadas deseadas.
		//Nota: el tamaño de la imagen será el real. Podemos "mejorar" esta parte del motor del juego con mas parametros
		ctx.drawImage(	this.image,
						s.sx + frame * s.w,
						s.sy,
						s.w, 	s.h,
						x, 		y,
						s.w, s.h);
	};

}


/*
	Clase GameBoard.
	Contendrá un tablero de los componentes del juego


	Atributos:

	Métodos:

*/
var GameBoard = new function(){



}


/*
	Clase Game
	Motor de juego a alto nivel que contiene las 
	subclases que componen el motor de juego y gestiona la ejecución principal del juego.
	
	Atributos:
		- canvas
		- width
		- height
		- ctx
		- keys

	Métodos:
		- initialize(canvasElementId, sprite_data, callback)
		- setupInput();
		- loop();
		- setBoard(num, board)

*/
var Game = new function(){
	//Equivaldría a un atributo privado y constante de nuestra clase
	var KEY_CODES = { 37: 'left', 39: 'right', 32: 'fire'};
	//Otro atributo privado, este no cte. Servirá para contener un array de elementos del juego y tratarlos
	var boards = [];
	/***
	================================
				ATRIBUTOS
	================================
	***/

	/*
		Atributo canvas:
			- nuestro "cuadro" del juego donde pintamos
		Atributos width, height:
			- ancho y alto de nuestro juego (canvas)
		Atributo ctx:
			- nuestra "paleta" para pintar sobre nuestro "cuadro"
	*/

	/*
		Atributo keys:
			- Las teclas que obtendremos de nuestros inputs y su estado
	*/
	this.keys = {};


	/***
	================================
				METODOS
	================================
	***/

	/*
	Metodo inicializar: 
		- Inicializa "el motor" del juego obteniendo el canvas, cargando los recursos, y llamando al callback de comienzo del juego
		Tambien llamamos al metodo loop y al método setupInput

		- Inputs:
			- canvasElementId: Nombre del canvas para obtenerlo
			- sprite_data: Información de los sprites
			- callback: Función que se llamará al cargar los elementos del juego

		- return:
			- No devuelve nada, a excepción de que no se pueda cargar el contexto del canvas. 	
	*/
	this.initialize = function(canvasElementId, sprite_data, callback) {
		//Obtenemos canvas, ancho alto y contexto
		this.canvas = document.getElementById(canvasElementId);
		this.width  = this.canvas.width;
		this.height = this.canvas.height;
		this.ctx 	= this.canvas.getContext && this.canvas.getContext("2d");
		//Comprobamos que se ha obtenido el contexto
		if(!this.ctx) {
			return alert("Actualiza tu navegador para jugar");	
		}
		//Llamamos a la gestión de la entrada
		this.setupInput();
		//Llamamos al loop... 
		//TODO: no genera problemas ya que el loop no termina nunca¿?
		this.loop();
		//Cargamos en nuestro obtejo SpriteSheet los datos de los sprites y la llamada de inicio
		SpriteSheet.load(sprite_data, callback);

	};


	/*
	Metodo setupInput: 
		- Realiza el tratamiento de la entrada e informa en atributo "keys" el estado de las teclas que nos interesan
			* Podremos mejorar le tratamiento de la entrada desde aqui (Otros eventos, etc)
		- Inputs:
			- No
		- return:
			- No
	*/
	this.setupInput = function() {
		window.addEventListener("keydown", function(e) {
			//Basicamente cuando se da el evento keydown vemos si es una de neustras teclas
			//Y actualizamos su estado en el diccionario de teclas
			if(KEY_CODES[e.keyCode]) {
				Game.keys[KEY_CODES[e.keyCode]] = true;
			}
		});

		window.addEventListener("keyup", function(e) {
			//Basicamente cuando se da el evento keyup vemos si es una de neustras teclas
			//Y actualizamos su estado en el diccionario de teclas
			if(KEY_CODES[e.keyCode]) {
				Game.keys[KEY_CODES[e.keyCode]] = false;
			}
		});
	};


	/*
	Metodo loop: 
		- bucle del juego, corazón del motor del juego. Se encargará de procesar entrada, recalcular físicas y hechos sobre cada elementos, y redibujarlos
		lo más rápido posible.
		- Inputs:
			- No
		- return:
			- No
	*/
	//TODO, MEJORAR LOOP Y FPS Y SETTIMEOUT
	this.loop = function() {
		//Velocidad a la que queremos que vaya el juego
		var fps = 60;
		//1000 ms = 1 segundo
		var dt = 30 / 1000;

		//Cada pasada borramos el canvas
		Game.ctx.fillStyle = "#000";
		Game.ctx.fillRect(0,0,Game.width,Game.height);

		//Actualizamos y dibujamos cada entidad del juego
		for(var i=0, len=boards.length; i<len; i++) {
			//Si existe elemento en esa posicion...
			if(boards[i]){
				//Le decimos que se calcule lo que debería hacer sobre el tiempo que ha pasado
				boards[i].step(dt); //TODO: ¿? Creo que hago mal el tema del dt
				//Y le decimos que se pinte
				boards[i].draw(Game.ctx);
			}
		}

		//Volvemos a llamar a loop en ese dt tiempo:
		setTimeout(Game.loop, 1000/fps);

	};

	/*
	Metodo setBoard: 
		- Añade una tabla de elementos en una capa de nuestro tableto de tablas de elemento
		Permite organizar el juego en capas y mejorar las dependencias entre elementos gracias a estas capas
		- Inputs:
			- num: la posicion en nuestro array de tablas
			- board: tabla en concreto de elementos
		- return:
			- No
	*/
	this.setBoard = function(num, board) {
		boards[num] = board;
	};

}

//TODO A VECES PUNTO Y COMA Y OTRAS NO EN DEFINICION DE METODOS