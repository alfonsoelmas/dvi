//Juego

//======================================
//	Definicion de nuestros sprites
//======================================
var sprites = {
	ship: {sx: 0, sy: 0, w: 38, h: 43, frames: 3}
};


//======================================
//	Definicion de tipos de entidades
//======================================
//Potencias de dos para usarlos a modo de máscaras
var OBJECT_PLAYER = 1,
	OBJECT_PLAYER_PROYECTILE = 2,
	OBJECT_ENEMY = 4,
	OBJECT_ENEMY_PROJECTILE = 8,
	OBJECT_POWERUP = 16;


//======================================
//	Pantalla de inicio
//======================================
var startGame = function() {
	Game.setBoard(0, new TitleScreen("Alien Invasion", "Press fire to start playing", playGame));
}

//======================================
//	Pantalla de juego
//======================================
var playGame = function() { 
	Game.setBoard(0, new TitleScreen("Alien Invasion", "Game started"));
	Game.setBoard(1, new PlayerShip());
}

/*
	De esta forma decimos que cuando haya cargado la página, llamemos a startGame
*/
window.addEventListener("load", function(){
	Game.initialize("game", sprites, startGame);
});


//====================================
//		Clase pantalla de título
//====================================
var TitleScreen = function TitleScreen(title, subtitle, callBack) {
	var up = false;

	this.step = function(dt) {
		if(!Game.keys["fire"]) up = true;
		if(up && Game.keys["fire"] && callBack) 
			callBack();
	}

	this.draw = function(ctx) {
		ctx.fillStyle = "#FFFFFF"
		ctx.textAlign = "center";

		ctx.font = "bold 40px bangers";
		ctx.fillText(title, Game.width/2, Game.height/2 - 140);

		ctx.font = "bold 20px bangers";
		ctx.fillText(subtitle, Game.width/2, Game.height/2 + 140);
	}
}

//==============================
//		Clase jugador
//===============================
var PlayerShip = function() {
	this.w = SpriteSheet.map["ship"].w;
	this.h = SpriteSheet.map["ship"].h;
	this.x = Game.width/2 - this.w/2;
	this.y = Game.height - 10 - this.h;
	this.maxVel = 200;

	this.step = function(dt) {
		if(Game.keys["left"]) {
			this.vx = -this.maxVel;
		} else if(Game.keys["right"]) {
			this.vx = this.maxVel;
		} else {
			this.vx=0;
		}
		//Se mueve a la velocidad correspondiente aunque se modifique la velocidad del loop
		this.x += this.vx*dt;
		//Para que no se pase de los límites
		if(this.x<0){this.x = 0;}
		else if(this.x >Game.width - this.w) {
			this.x = Game.width - this.w;
		}
	}

	this.draw = function(ctx) {
		SpriteSheet.draw(ctx, "ship", this.x, this.y, 0);
	}
}