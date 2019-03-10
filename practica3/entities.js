var sprites = {
  //TODO, VOY X AQUI
 coche_azul:  {sx: 9 , sy: 8, w: 91, h: 46, frames: 1}, 
 coche_verde: {sx: 110 , sy: 8, w: 91, h: 46, frames: 1},
 coche_amarillo: {sx: 214 , sy: 8, w: 91, h: 46, frames: 1},
 camion_corto:  {sx: 7 , sy: 63, w: 124, h: 45, frames: 1},
 camion_largo: {sx: 148 , sy: 63, w: 199, h: 46, frames: 1},
 tronco_corto:  {sx: 269, sy:170, w:134, h:43, frames:1},
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
 rana:{sx: 0, sy:338, w:37, h:51, frames:7},
 tortuga:{sx: 0, sy:285, w:54, h:47, frames:7},
 tortuga_hundir: {sx: 280, sy:339, w:54, h:49, frames:2},
 titulo: {sx: 5, sy:393, w:265, h:173, frames:1}

};

var OBJECT_PLAYER = 1,
    OBJECT_VEHICLES = 2,
    OBJECT_TRONCOS = 4,
    OBJECT_BASE = 8;
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



// PLAYER

var PlayerShip = function() { 

  this.setup('ship', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

   this.x = Game.width/2 - this.w / 2;
   this.y = Game.height - 10 - this.h;

   this.reload = this.reloadTime;


   this.step = function(dt) {
     if(Game.keys['left']) { this.vx = -this.maxVel; }
     else if(Game.keys['right']) { this.vx = this.maxVel; }
     else { this.vx = 0; }

     this.x += this.vx * dt;

     if(this.x < 0) { this.x = 0; }
     else if(this.x > Game.width - this.w) { 
       this.x = Game.width - this.w 
     }

    this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }

   }

}

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
}


///// EXPLOSION

var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
  this.subFrame = 0;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame = Math.floor(this.subFrame++ / 3);
  if(this.subFrame >= 36) {
    this.board.remove(this);
  }
};


/// CARS - BUSES ///todo

var enemies = {
  straight: { x: 0,   y: -50, sprite: 'enemy_ship', health: 10, 
              E: 100 },
  ltr:      { x: 0,   y: -100, sprite: 'enemy_purple', health: 10, 
              B: 200, C: 1, E: 200  },
  circle:   { x: 400,   y: -50, sprite: 'enemy_circle', health: 10, 
              A: 0,  B: -200, C: 1, E: 20, F: 200, G: 1, H: Math.PI/2 },
  wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20, 
              B: 100, C: 4, E: 100 },
  step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
              B: 300, C: 1.5, E: 60 }
};


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
}

Enemy.prototype = new Sprite();
Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, health: 20, damage: 10 };


Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.step = function(dt) {
  this.t += dt;
  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

}

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }

}





/// Fondo del Juego
var FondoJuego = function(clear) {

  // Set up the offscreen canvas
  var dimens = document.createElement("canvas");
  dimens.width = Game.width; 
  dimens.height = Game.height;
  var fondoCtx = dimens.getContext("2d");

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    SpriteSheet.draw(ctx,"fondo",0,0,0);
  }

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  }
}

