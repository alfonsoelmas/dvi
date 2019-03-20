var sprites = {
  //TODO, VOY X AQUI
 coche_azul:  {sx: 9 , sy: 8, w: 91, h: 46, frames: 1}, 
 coche_verde: {sx: 110 , sy: 8, w: 91, h: 46, frames: 1},
 coche_amarillo: {sx: 214 , sy: 8, w: 91, h: 46, frames: 1},
 camion_corto:  {sx: 7 , sy: 63, w: 124, h: 45, frames: 1},
 camion_largo: {sx: 148 , sy: 63, w: 199, h: 40, frames: 1},
 tronco_corto:  {sx: 270, sy:170, w:131, h:43, frames:1},
 tronco_mediano:{sx: 10, sy:122, w:190, h:43, frames:1},
 tronco_largo:  {sx: 10, sy:172, w:245, h:43, frames:1},
 muerte:{sx: 211, sy:126, w:48, h:36, frames:4},

 cuadrado_negro: {sx: 220, sy:221, w:59, h:59, frames:1}, // TODO ARREGLAR
 cuadrado_azul: {sx: 158, sy:225, w:59, h:59, frames:1},
 cuadrado_verde: {sx: 94, sy:225, w:59, h:59, frames:1},
 base: {sx: 4, sy:233, w:48, h:44, frames:1},
 matorral: {sx: 284, sy:225, w:59, h:59, frames:1},
 base_matorral: {sx: 347, sy:225, w:59, h:59, frames:1},
 fondo: {sx: 421, sy:0, w:546, h:625, frames:1},
 
 mosca:{sx: 56, sy:236, w:37, h:40, frames:1},
 rana:{sx: -3, sy:339, w:40, h:49, frames:7},
 tortuga_hundir:{sx: 0, sy:285, w:54, h:47, frames:7},
 tortuga: {sx: 280, sy:339, w:54, h:49, frames:2},
 titulo: {sx: 5, sy:393, w:265, h:173, frames:1},

 agua:{sx: 0, sy:0, w:0, h:0, frames:0}

};

var OBJECT_PLAYER = 1,
    OBJECT_VEHICLES = 2,
    OBJECT_TRONCOS = 4,
    OBJECT_BASE = 8,
    OBJECT_WATER = 16;
    OBJECT_NONE  = 32;
    ///OBJECT_POWERUP = 16;


/// CLASE PADRE SPRITE
var Sprite = function()  
 { }

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}
Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}

Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
}

//var posicionesTablero = //TODO


//PLAYER-FROG
/*var PlayerFrog = function() {
  this.setup('rana',{vx: 0, frame: 0, reloadTime:0.25, maxVel: 200});
  this.x = Game.width/2 - this.w/2; 
}*/

// PLAYER

var Frog = function() {
  this.setup('rana',{ vx: 0, frame: 0, reloadTime: 0.25, maxVel: 0, up: false, saltoLateral:50, saltoFrontal:48 });
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - this.h + 5;
  this.subFrame = 0;
  this.lifes=2;
  this.animate = false;
  this.l=false;
  this.r=false;
  this.u=false;
  this.d=false;
  this.overTrunk=false;
  this.maxFrames=7;

   this.step = function(dt) {
    if(Game.keys['left'] && this.up) {
      this.x += -this.saltoLateral;
      this.up=false;
      this.l=true;
      this.animate = true;
      this.r=false;this.d=false;this.u=false;
    }
     else if(Game.keys['right'] && this.up) {
      this.x += this.saltoLateral;
      this.up=false;
      this.r=true;
      this.animate = true;
      this.l=false;this.d=false;this.u=false;
    }
     else if(!Game.keys['left'] && !Game.keys['right'] && !Game.keys['up'] && !Game.keys['down']) {
      this.up = true;
    }
     else if(Game.keys['up'] && this.up){
      this.y += -this.saltoFrontal;
      this.up=false;
      this.animate = true;
      this.u=true;
      this.r=false;this.l=false;this.d=false;
     }
     else if(Game.keys['down'] && this.up){
      this.y += this.saltoFrontal;
      this.up=false;this.d=true;
      this.animate = true;
      this.r=false;this.u=false;this.l=false;
     }
     if(this.animate){
      this.frame = Math.floor(this.subFrame++);
      if(this.subFrame == this.maxFrames){ this.subFrame = 0; this.animate=false; this.frame=0;}
    }

     if(this.x < 0) { this.x = 0; }
     else if(this.x > Game.width - this.w) { 
       this.x = Game.width - this.w;
     }
     if(this.y <0){this.y=0;}
     else if(this.y>Game.height-this.h) {
      this.y = Game.height - this.h;
     }
    
    this.x += this.vx * dt;
    this.reload-=dt;
    this.vx=0;
  }


  this.onTrunk = function(vx){
    this.overTrunk=true;
    this.vx=vx;
  }

}



Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;
Frog.prototype.draw = function(ctx) {
  ctx.save();
    if(this.l){
      ctx.translate(this.x+this.w/2,this.y+(this.h)/2);
      ctx.rotate(-Math.PI/2);
      ctx.translate(-this.x-this.w/2,-this.y-(this.h)/2);

      //this.l=false;
    } else if(this.d){
      ctx.translate(this.x+this.w/2,this.y+(this.h)/2);
      ctx.rotate(Math.PI);
      ctx.translate(-this.x-this.w/2,-this.y-(this.h)/2);
      //this.d=false;
    } else if(this.r){
      ctx.translate(this.x+this.w/2,this.y+(this.h)/2);
      ctx.rotate(Math.PI/2);
      ctx.translate(-this.x-this.w/2,-this.y-(this.h)/2);
      //this.r=false;
    }
    SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
  ctx.restore();
}

Frog.prototype.hit = function(damage) {
  if(!this.overTrunk){
   this.board.add(new AnimacionMuerte(this.x,this.y));
    if(this.lifes==0) {
      loseGame();
      this.board.remove(this);
    }else{
      this.lifes--;
      this.x = Game.width/2 - this.w / 2;
      this.y = Game.height - this.h + 5;
    }


  }else{
    this.overTrunk=false;
  }
}

///===ANIMACION MUERTE===
var AnimacionMuerte = function(x,y){
  this.setup('muerte',{ x: x, y: y, vx: 0, frame: 0, reloadTime: 0.25, maxVel: 0, maxFrames:4});
  this.subFrame = 0;
  this.step = function(dt){
   this.frame = Math.floor(this.subFrame++ / 10);
    if(this.frame == this.maxFrames){ 
      this.board.remove(this);
    }
  }
}
AnimacionMuerte.prototype = new Sprite();
AnimacionMuerte.prototype.type = OBJECT_NONE;

///===VIDAS JUGADOR===


///========ENTIDADES VEHICULOS=============
var tipoVehiculo = {1: 'coche_amarillo', 2:'coche_azul', 3:'coche_verde', 4:'camion_largo', 5:'camion_corto'};
var cantCarriles = 5;

var Vehicle = function(sprite, carril, lvl){



  this.setup(sprite,{x: 0, carril: carril, velocidad: 50, lvl: lvl, reloadTime: 0.25})
  this.damage=1;
  this.x = this.x - this.w;
  this.y = Game.height - this.h - 48 - 48*this.carril;
  this.reload = this.reloadTime;
  if(carril%2==0){
    this.velocidad = -this.velocidad;
    this.x = Game.width;
  }
  
  this.step = function(dt) {
    this.x += this.velocidad * dt * this.lvl;
    if(this.x +this.w< 0) { 
      this.board.remove(this);
      //this.x=Game.width 
    }
    else if(this.x > Game.width) { 
      this.board.remove(this);
      //this.x=-this.w;
    }

  var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {
      collision.hit(this.damage);
    }

    this.reload-=dt;
    
  }

}

Vehicle.prototype = new Sprite();
Vehicle.prototype.type = OBJECT_VEHICLES;

Vehicle.prototype.draw = function(ctx) {
  ctx.save();
    if(this.carril%2 == 0){
      if(this.sprite!='camion_largo'){
        ctx.translate(this.x+this.w/2,this.y+(this.h)/2);
        ctx.rotate(Math.PI);
        ctx.translate(-this.x-this.w/2,-this.y-(this.h)/2);
      }
    } else{
      if(this.sprite=='camion_largo'){
        ctx.translate(this.x+this.w/2,this.y+(this.h)/2);
        ctx.rotate(Math.PI);
        ctx.translate(-this.x-this.w/2,-this.y-(this.h)/2);
      }
    }
    

    SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
  ctx.restore();
}

/// Clase tronco

var Trunk = function(sprite, carril, lvl) {


  this.setup(sprite,{x: 0, carril: carril, velocidad: 50, lvl: lvl, reloadTime: 0.25});
  this.damage=0;
  this.x = this.x - this.w;
  this.y = Game.height - this.h - 48*7 - 48*this.carril;
  this.reload = this.reloadTime;
  if(carril%2==1){
    this.velocidad = -this.velocidad;
    this.x = Game.width;
  }
  
  this.step = function(dt) {
    this.x += this.velocidad * dt * this.lvl;
    if(this.x +this.w< 0) {
      //this.x = Game.width;
      this.board.remove(this);
    }
    else if(this.x > Game.width) { 
      this.board.remove(this);
      //this.x=-this.w;
    }

    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {
      collision.onTrunk(this.velocidad*this.lvl);
    }
    
  }
}

Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_TRONCOS;

/// Tortuga - hija de Tronco
var Turtle = function(carril,lvl) {
  this.setup('tortuga',{x: 0, carril: carril, velocidad: 50, lvl: lvl, reloadTime: 0.25});
  this.subFrame=1;
  this.frame=1;
  this.damage=0;
  this.overWater = true;
  this.x = this.x - this.w;
  this.y = Game.height - this.h - 48*7 - 48*this.carril;
  this.reload = this.reloadTime;
  if(carril%2==1){
    this.velocidad = -this.velocidad;
    this.x = Game.width;
  }

  this.step = function(dt){
    this.x += this.velocidad * dt * this.lvl;
    if(this.x +this.w< 0) {
      //this.x = Game.width;
      this.board.remove(this);
    }

    else if(this.x > Game.width) { 
      this.board.remove(this);
      //this.x=-this.w;
    }


    //Animacion tortuga normal
    var vel = 100/this.lvl*0.5;
    this.frame = Math.floor(Math.floor(this.subFrame++ / vel));
    if(this.subFrame >= 2*vel){ this.subFrame = 0; this.animate=false; this.frame=0;}


    //TODO SI THIS.OVERWATER == TRUE...
    if(this.overWater==true){
      //de alguna forma comprobar y en x tiempo hundir. siempre dependiendo de lvl
      //Al hundir poner a false esto. al terminar de hundir, volver a true.
      var collision = this.board.collide(this,OBJECT_PLAYER);
      //TODO DECIDIR HUNDIR, ETC
      if(collision) {
        collision.onTrunk(this.velocidad*this.lvl);
      }
    }


  }

  this.draw = function(ctx){
    ctx.save();
    if(this.carril%2==1){
      ctx.translate(this.x+this.w/2,this.y+(this.h)/2);
      ctx.rotate(Math.PI);
      ctx.translate(-this.x-this.w/2,-this.y-(this.h)/2);
    }
    SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
    ctx.restore();

  }


}
Turtle.prototype = new Sprite();
Turtle.prototype.type = OBJECT_TRONCOS;


/// Agua

var Water = function() {
  this.setup('agua',{x: 0, y: 48,  w: Game.width, h: 48*5});
  this.damage=1;
  this.x=0;
  this.y=48;
  this.w=Game.width;
  this.h=48*5;

  this.step = function(dt){
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {
      collision.hit(this.damage);
    }

  }
  this.draw = function(ctx) {
    //No hace nada
    /* Si nos interesa ver el agua:
    ctx.save();
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.restore();*/
  }
 

}
Water.prototype = new Sprite();
Water.prototype.type = OBJECT_WATER;


var Home = function() {
  this.setup('agua',{x: 0, y: 48,  w: Game.width, h: 48});
  this.damage=1;
  this.x=0;
  this.y=0;
  this.w=Game.width;
  this.h=46;

  this.step = function(dt){
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {
      winGame();
      //Next level
      /*
      levels se encarga de ello.
      */
    }

  }
  this.draw = function(ctx) {
    //No hace nada
    // Si nos interesa ver la meta:
    /*ctx.save();
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.restore();*/
  }
 

}
Home.prototype = new Sprite();
Home.prototype.type = OBJECT_BASE;

/// Fondo del Juego
var FondoJuego = function(clear) {

  // Set up the offscreen canvas
  var dimens = document.createElement("canvas");
  dimens.width = Game.width; 
  dimens.height = Game.height;
  var fondoCtx = dimens.getContext("2d");

  this.draw = function(ctx) {
    SpriteSheet.draw(ctx,"fondo",0,0,0);
  }

  this.step = function(dt) {
    //No hace nada
  }
}



/// Generador de elementos
/// Genera un elemento 
var Spawner = function(lvl,fila, tipo) {
  this.setup('agua',{x: -5, y: -5,  w: 0, h: 0, frecuencia:0});
  this.fila = fila;
  this.lvl = lvl;
  this.tipo = 0;
  this.elementos = [];
  if(tipo=="w"){
    //Tipo = agua
    this.tipo = 0;
    //Los elementos se crean así para hacer un "rand" sobre ellos y que salgan mas de unos que de otros
    this.elementos = [["coche_verde", fila, lvl],
                      ["coche_verde", fila, lvl],
                      ["coche_verde", fila, lvl], 
                      ["coche_amarillo", fila, lvl],
                      ["coche_amarillo", fila, lvl],
                      ["coche_amarillo", fila, lvl],
                      ["coche_azul", fila, lvl    ],
                      ["coche_azul", fila, lvl    ],
                      ["coche_azul", fila, lvl    ],
                      ["camion_corto", fila, lvl  ],
                      ["camion_corto", fila, lvl  ],
                      ["camion_largo", fila, lvl  ]];
  }else {
    //Tipo = carretera
    this.elementos = [["turtle",fila,lvl],
                      ["tronco_largo", fila, lvl],
                      ["tronco_corto", fila, lvl],
                      ["tronco_mediano", fila, lvl],
                      ["tronco_mediano", fila, lvl]];
    this.tipo = 1;
  }
  
  var max = Game.width;
  var min = Game.width/2;
  var creador = -1;
  this.cntFrecuencia = 50;
  
  

  this.step = function(dt) {
    this.frecuencia += (this.cntFrecuencia * dt * this.lvl);


    if(creador==-1){
		//tamaño posicion array elementos a generar
		  var tam = this.elementos.length;
		  //instanciamos nuevo objeto de ese elemento
		  var pos = Math.floor((Math.random() * tam));
		  if(this.tipo==0)
			this.board.add(new Vehicle(this.elementos[pos][0],this.elementos[pos][1], this.elementos[pos][2]));
		  else{
			if(this.elementos[pos][0]=="turtle"){
			  this.board.addFront(new Turtle(this.elementos[pos][1], this.elementos[pos][2]));
			} else {
			  this.board.addFront(new Trunk(this.elementos[pos][0],this.elementos[pos][1], this.elementos[pos][2]));
			}
		  }
		creador =  Math.floor(Math.random() * (max - min)) + min;
		if(tipo==0) creador+=200;
    }
   if(this.frecuencia > creador) //CONDICION DE FRECUENCIA DE CREACION DEL OBJETO
   {
      //tamaño posicion array elementos a generar
      var tam = this.elementos.length;
      //instanciamos nuevo objeto de ese elemento
      var pos = Math.floor((Math.random() * tam));
      if(this.tipo==0)
        this.board.add(new Vehicle(this.elementos[pos][0],this.elementos[pos][1], this.elementos[pos][2]));
      else{
        if(this.elementos[pos][0]=="turtle"){
          this.board.addFront(new Turtle(this.elementos[pos][1], this.elementos[pos][2]));
        } else {
          this.board.addFront(new Trunk(this.elementos[pos][0],this.elementos[pos][1], this.elementos[pos][2]));
        }
      }

      this.frecuencia = 0;
      creador =  Math.floor(Math.random() * (max - min)) + min;
      if(tipo==0) creador+=200;
   }
    

  }
  this.draw = function(ctx) {
    //No hace nada
  }

}

Spawner.prototype = new Sprite();
Spawner.prototype.type = OBJECT_NONE;
