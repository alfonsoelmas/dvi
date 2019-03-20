/*===============
  Autor: Alfonso Soria Muñoz
  Juego: FROGGER
  Asignatura: DVI
=================*/

/*
TODO: Generar inicio coches en el spawner
A futuro: (No obligatorio para miembros de 1 grupo)
          Crear un objeto Lvl que gestione correctamente los niveles (implica cambiar las funciones que ahora tienen parametro lvl)
          Crear animacion tortuga hundirse
          Crear menu de vida y niveles
          Crear puntuación...

Lo que ya se ha realizado:
  La rana, los obstaculos, los troncos, etc Lo que viene a ser la dinamica principal del juego) funciona correctamente.
  Se han implementado tambien un sistema de dos vidas que no se ve, además de algunas animaciones(Salto rana, tortuga normal, muerte)
  Se han generado sencillos menus de comienzo de juego, win y lose.
  No se ha implementado un gestor de niveles por no ser obligatorio, pero si que, para probar, se ha creado un parametro adicional en la creacion de pantallas
  que indica el nivel y se incrementa o restaura segun si losegame o wingame, haciendo cada partida posterior mas rapida y dificil.
  (No es un sistema de niveles del todo real, pero es util para poder comprobar el funcionamiento completo de lo creado en diferentes situaciones.) 

*/
var actLvl=1;

// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  Game.setBoard(2,new TitleScreen("inicio", 
                                  "Pusa espacio para comenzar",
                                  playGame, actLvl));
}



var playGame = function(lvl) {
  Game.setBoard(0,new FondoJuego());
  var board = new GameBoard();
  /*
  board.add(new Trunk('tronco_corto',0,5));
  board.add(new Trunk('tronco_largo',1,5));
  board.add(new Trunk('tronco_mediano',2,5));
  board.add(new Trunk('tronco_largo',3,5));
  board.add(new Turtle(4,5));
  board.add(new Vehicle('coche_amarillo', 1, 3));
  board.add(new Vehicle('coche_azul', 2, 2));
  board.add(new Vehicle('camion_corto', 3, 2));
  board.add(new Vehicle('coche_verde', 4, 4));
  board.add(new Vehicle('camion_largo', 0, 5));*/
  //TODO: ESTO VA RARO, GENERA A LA VEZ Y NO DEBERÍA
  board.add(new Spawner(lvl,0, "w"));
  board.add(new Spawner(lvl,1, "w"));
  board.add(new Spawner(lvl,2, "w"));
  board.add(new Spawner(lvl,3, "w"));
  board.add(new Spawner(lvl,4, "w"));
  board.add(new Water());
  board.add(new Home());
  board.add(new Frog());
  board.add(new Spawner(lvl,0, "c"));
  board.add(new Spawner(lvl,1, "c"));
  board.add(new Spawner(lvl,2, "c"));
  board.add(new Spawner(lvl,3, "c"));
  board.add(new Spawner(lvl,4, "c"));

  Game.setBoard(2,board);
  Game.setBoard(3,new TitleScreen("", 
                                  "",
                                  null,0));
}

var winGame = function() {
  actLvl = actLvl+1;
  Game.setBoard(0,new FondoJuego());
  Game.setBoard(2,new GameBoard());
  Game.setBoard(3,new TitleScreen("Ganastes!", 
                                  "Presiona espacio para comenzar siguiente nivel",
                                  playGame,actLvl));
};



var loseGame = function() {
  Game.setBoard(0,new FondoJuego());
  Game.setBoard(2,new GameBoard());
  actLvl = 1;
  Game.setBoard(3,new TitleScreen("Perdiste!", 
                                  "Pulsa espacio para reintentarlo",
                                  playGame,actLvl));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites, startGame, actLvl);
  
  //Game.initialize("game",sprites,startGame);
});
