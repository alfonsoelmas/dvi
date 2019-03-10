


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {

  //Prueba de visibilidad de sprites. Hacer lo mismo con las colisiones x si aca
  var ctx = document.getElementById("game");
  var ctx = ctx.getContext("2d");
  SpriteSheet.draw(ctx,"fondo",0,0,0);
  SpriteSheet.draw(ctx,"coche_azul",1,0,0);
  SpriteSheet.draw(ctx,"coche_verde",100,0,0);
  SpriteSheet.draw(ctx,"coche_amarillo",200,0,0);
  SpriteSheet.draw(ctx,"camion_corto",1,50,0);
  SpriteSheet.draw(ctx,"camion_largo",140,50,0);
  SpriteSheet.draw(ctx,"tronco_corto",350,50,0);
  SpriteSheet.draw(ctx,"tronco_mediano",1,100,0);
  SpriteSheet.draw(ctx,"tronco_largo",200,100,0);

  for(var i =0; i<sprites["muerte"].frames; i++){
    SpriteSheet.draw(ctx,"muerte",0 + i*sprites["muerte"].w,150,i);
  }
  SpriteSheet.draw(ctx,"cuadrado_negro",200,150,0); //todo arreglar dimensiones, se pinta mal
  SpriteSheet.draw(ctx,"cuadrado_azul",270,150,0);
  SpriteSheet.draw(ctx,"cuadrado_verde",350,150,0);
  SpriteSheet.draw(ctx,"base",410,150,0);
  SpriteSheet.draw(ctx,"matorral",460,150,0);
  SpriteSheet.draw(ctx,"base_matorral",0,200,0);
  SpriteSheet.draw(ctx,"mosca",60,200,0);
  for(var i =0; i<sprites["rana"].frames; i++){
    SpriteSheet.draw(ctx,"rana",0 + i*sprites["rana"].w,250,i); //TODO > carga mal la animacion, desplaza de menos
  }                                                             //TODO: Recalcular
                                                                //SpriteSheet.draw(ctx,"rana",0 + 6*sprites["rana"].w,300,1)
  /*
  Game.setBoard(0,new FondoJuego(true));
  Game.setBoard(0,new TitleScreen("inicio", 
                                  "Press space to start",
                                  playGame));
  */
}



var playGame = function() {

  //PINTAMOS EL TABLERO DE FONDO
  //todo reemplazar por el fondo de la rana
  //todo definir "carriles"

  Game.setBoard(0,new FondoJuego(true));
  var board = new GameBoard();
  /*board.add(new PlayerShip());
  board.add(new Level(level1,winGame));
  */
  Game.setBoard(3,board);
}

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press space to play again",
                                  playGame));
};



var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press space to play again",
                                  playGame));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  SpriteSheet.load(sprites, startGame);
  
  //Game.initialize("game",sprites,startGame);
});
