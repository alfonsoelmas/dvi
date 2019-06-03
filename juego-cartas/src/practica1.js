/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

//Enumerado para los diferentes estados en los que se pueden encontrar las cartas
var EnumEstadoCartas = {
    "bocaArriba": 1,
    "bocaAbajo": 2,
    "encontrado": 3
};


/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
    this.cartas = [];
    this.finJuego = true;
    this.mensaje = "Comenzamos";
    this.graphics = gs;

    this.parejaCartasAcertadas = 0;
    this.primeraCarta = -1;
    this.timer;
    this.espera = false;

    /*
     * Función buscada en internet. 
     * Dado un array, lo desordena aleatoriamente para que las cartas queden barajadas y lo devuelve.
     */
    this.__desordenarCartas = function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    /*
     * Se encarga de controlar si el juego ha acabado. 
     * Si el número de cartas encontradas es igual a la longitud del array que contiene todas las cartas devuelve TRUE.
     */
    this.__checkEnd = function() {
        return this.parejaCartasAcertadas * 2 === this.cartas.length;
    }

    /*
        Inicializa el juego. Creamos las cartas (dos de cada tipo) en el array de cartas.
        Las desordenamos.
    */
    this.initGame = function() { 
        //Obtenemos las claves de los sprites
        var nombresSprites = Object.keys(this.graphics.maps);

        var j = 0;
        var duplico = true;
        for(var i = 0; i < 16; i++) {
            var carta = new MemoryGameCard(nombresSprites[j]);
            this.cartas.push(carta);
            if(!duplico){
                j++;
                //Nos saltamos el sprite "back"
                if(nombresSprites[j]=="back")j++;
                duplico = true;
            } else {             
                duplico = false;
            }
        }
        this.__desordenarCartas(this.cartas);

        this.loop();

    };

    /*
     * Se encarga de dibujar el juego.
     * Dibuja las cartas llamando a la función draw de cada una de ellas y actualiza el mensaje mostrado.
     * Además, si el juego ha terminado muestra el mensaje de ganador y para el bucle de juego.
     */
    this.draw = function() {
        this.graphics.drawMessage(this.mensaje);

        for (var i = 0; i < 16; i++) {
            this.cartas[i].draw(this.graphics, i);
        }
        if (this.__checkEnd()) {
            this.mensaje = "Enhorabuena, has ganado!";
            this.graphics.drawMessage(this.mensaje);
            clearInterval(this.timer);
        }
    };

    /*
     * Bucle del juego. 
     * Llama a la función draw cada 16ms para actualizar los gráficos.
     */
    this.loop = function() {
        var that = this;
        this.timer = setInterval(function() { that.draw(); }, 16);
    };

    /*
     * Responde a los clicks del jugador.
     * Comprueba si es la primera o segunda carta pulsada y en función de eso deja pulsar o otra o comprueba si son iguales.
     */
    this.onClick = function(idCard) {
        if (!this.espera) {
            if (this.cartas[idCard] !== undefined && this.cartas[idCard].estado === EnumEstadoCartas.bocaAbajo) {
                this.cartas[idCard].flip(); // La ponemos boca arriba siempre

                if (this.primeraCarta === -1) { // Es la primera carta en pulsar  
                    this.primeraCarta = idCard;
                } else { // Es la segunda carta en pinchar y la anterior clickada se guarda en primeraCarta
                    this.espera = true;

                    if (this.cartas[idCard].compareTo(this.cartas[this.primeraCarta])) { //Comprueba si ambas cartas son pareja
                        this.mensaje = "Correcto!";
                        this.cartas[this.primeraCarta].found();
                        this.cartas[idCard].found();
                        this.parejaCartasAcertadas++;
                        this.espera = false;
                    } else { // Las dos cartas no son la misma pareja
                        this.mensaje = "Error!  Inténtalo otra vez";
                        var dat = this;

                        var primeraCartaAux = dat.primeraCarta;
                        setTimeout(function() {
                            dat.cartas[primeraCartaAux].flip();
                            dat.cartas[idCard].flip();
                            dat.espera = false;
                        }, 500);
                    }
                    this.primeraCarta = -1;
                }
            }
        }

    };
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */

MemoryGameCard = function(id) {
    //Atributos
    this.sprite = id;
    this.estado = EnumEstadoCartas.bocaAbajo;

    /*
     * Da la vuelta a la carta cambiando su estado.
     * Si está boca abajo la pone boca arriba, y si no la pone boca abajo
     */
    this.flip = function() {
        if (this.estado === EnumEstadoCartas.bocaAbajo) {
            this.estado = EnumEstadoCartas.bocaArriba;
        } else {
            this.estado = EnumEstadoCartas.bocaAbajo;
        }
    };

    /*
     * Marca una carta como encontrada, cambiando su estado a encontrado.
     */
    this.found = function() {
        this.estado = EnumEstadoCartas.encontrado;
    };


    /*
     * Compara dos cartas. 
     * Devuelve true si la carta en cuestión y la pasada por parámetro tienen el mismo sprite y false si no.
     */
    this.compareTo = function(otherCard) {
        return this.sprite === otherCard.sprite;
    };

    /*
     * Dibuja una carta. 
     * Si su estado está boca abajo dibuja el dorso y, si no dibuja el sprite correspondiente.
     */
    this.draw = function(gs, pos) {
        if (this.estado === EnumEstadoCartas.bocaAbajo) {
            gs.draw("back", pos);
        } else {
            gs.draw(this.sprite, pos);
        }
    };

};