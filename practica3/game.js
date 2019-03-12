


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {

}



var playGame = function() {
  Game.setBoard(0,new FondoJuego());
  var board = new GameBoard();
  board.add(new Frog());
  Game.setBoard(2,board);
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
  Game.initialize("game",sprites, playGame);
  
  //Game.initialize("game",sprites,startGame);
});
