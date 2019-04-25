/*
Práctica 4 para la asignatura de DVI
____________________________________
Lógica juego: Super mario
Autor: Alfonso Soria Muñoz
Institución: Universiad complutense de madrid
Licencia Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
Motor de juego: Quintus
Comentarios: Este es un clon simple del juego Super Mario Bross realizado utilizando Quintus y tecnologías WEB.
*/

var game = function() {
    //Iniciamos el Quintus y todos sus módulos
    var Q = Quintus({audioSupported: [ "mp3","ogg" ] }).include("Scenes, Sprites, Input, UI, Touch, TMX, Anim, 2D, Anim, Audio").setup({
        width: 320,
        height: 480,
        maximize: true
    }).controls().touch();
   
    Q.audio.enableHTML5Sound(); //Activa el audio


/*===========================================================================================
=======================================ANIMACIONES===========================================
=============================================================================================*/

    Q.animations("wario", {
        run_right: { frames: [1,2,3], rate: 1/6, loop:false, next: "stand_right" }, 
        run_left: { frames: [15,16,17], rate:1/6, loop:false, next: "stand_left" },
        stand_right: { frames: [0] },
        stand_left: { frames: [14] },
        jump_right: { frames: [4], loop: false, rate:1, next: "stand_right" },
        jump_left: { frames: [18], loop: false, rate:1, next: "stand_left" },
        dieW: { frames: [12], rate:1, loop: false, trigger: "deadW"}
    });


/*===========================================================================================
=======================================NIVEL=1===============================================
=============================================================================================*/
    Q.scene("level1",function(stage) {
        Q.audio.stop();
        Q.audio.play("music_main.mp3",{ loop: true });
        Q.stageTMX("level.tmx",stage);

    /*Añadimos los componentes del nivel 1 en nuestro escenario*/
	//Protagonista
        var wario = stage.insert(new Q.Mario({ x: 150, y: 380 }));

	
	//Creamos una "camara" que siga a mario centrada en el centro de este con cierto offset (libertad de movimiento de personaje)
        stage.add("viewport").follow(wario,{ x: true, y: false }); 
        stage.centerOn(150,380); //Cámara siguiendo a Mario
        stage.viewport.offsetX=-125;

    });


/*===========================================================================================
=================================Comienzo y finalización=====================================
=============================================================================================*/

    //Menú/Pantalla de inicio
    Q.scene('startGame',function(stage) {
		var play = stage.insert(new Q.UI.Button({
	      asset: 'mainTitle.png',
	      x: Q.width/2,
	      y: Q.height/2,
	    }, function() {
	    }));

	    play.on("click", function() {
            Q.clearStages();
            Q.state.set("score",0);
            Q.state.set("lifes",3); 
            Q.stageScene('level1');
            Q.stageScene("HUD", 2);
	    });
	});
	
    //Menú/Pantalla de finalización
    Q.scene('endGame',function(stage) {
        var container = stage.insert(new Q.UI.Container({
          x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));
      
        var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                        label: "Volver a jugar" }))         
        var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                         label: stage.options.label }));
        button.on("click",function() {
          Q.clearStages();
          Q.stageScene('startGame');
        });
      
        container.fit(20);
      });

/*===========================================================================================
=======================================HUD del juego=========================================
=============================================================================================*/
    Q.scene("HUD",function(stage) {
        //Contador de monedas
		Q.UI.Text.extend("Monedas",{ 
	        init: function(p) {
	            this._super({
	                label: "Monedas: 0",
	                color: "yellow",
	                x: Q.width * 0.25 + 20,
	                y: 5
	            });
	        },
            
            step: function (dt) {
                this.p.label = "Monedas: " + Q.state.get("score");
            }
        });
        //Contador de vidas
        Q.UI.Text.extend("Vidas",{ 
	        init: function(p) {
	            this._super({
	                label: "Vidas: 0",
	                color: "white",
	                x: Q.width * 0.25 - 2,
	                y: 30
	            });
	        },
            
            step: function (dt) {
                this.p.label = "Vidas: " + Q.state.get("lifes");
            }
		});

	    var container = stage.insert(new Q.UI.Container({
	        x: 0, y: 0, fill: "rgba(0,0,0,1)"
	    }));

        container.insert(new Q.Monedas());
        container.insert(new Q.Vidas());
	});

/*===========================================================================================
=====================================Lógica de Wario=========================================
=============================================================================================*/
    Q.Sprite.extend("Wario", {
        init: function(p){
            this._super(p, {
                sheet: "warioAnda",
                sprite: "wario",
                frame: 0,
                x: 150,
                y: 380,
                inix: 150,
                iniy: 380,
                gravity: 0.5,
                salto: false //Para controlar el sonido del salto
            });
            this.add('2d, platformerControls, animation');
            this.on("killWario", "die");
           
        },
        step: function(dt) {
            //Control de sus animaciones:
            if(this.p.vy < 0){ //Está saltando
                if(!this.p.salto) {
                    Q.audio.play("jump_small.mp3");
                    this.p.salto=true;
                }
                if(this.p.vx > 0) {
                    this.play("jump_right");
                } else if(this.p.vx < 0) {
                    this.play("jump_left");
                }
            }
            else {
                this.p.salto = false;
                if(this.p.vx > 0) {
                    this.play("run_right");
                } else if(this.p.vx < 0) {
                    this.play("run_left");
                } else {
                    this.play("stand_" + this.p.direction);
                }    
            }
            if(this.p.y > 700) {
               this.die();
            }
        }, 

        die: function() {
            //Si nos quedan vidas perdemos una, si no perdemos definitivamente.
            if (Q.state.get("lifes") === 1) {
                Q.state.dec("lifes", 1);
                this.del("platformerControls");
                Q.audio.stop();
                Q.audio.play("music_die.mp3"); 
                Q.stageScene("endGame", 1, {label: "You Died!"});
                this.destroy();
            }
            else {
                Q.state.dec("lifes", 1);
                Q.stageScene("level1");
            }
            
        }
    });





/*===========================================================================================
=======================================Carga de recursos=====================================
=============================================================================================*/
    //Cargamos y compilamos las hojas de sprites con sus json correspondientes
   Q.load(["wario.png", "wario.json"], function() {
        
	Q.compileSheets("wario.png", "wario.json");
    Q.compileSheets("tiles.png", "block.json");
    Q.loadTMX("level.tmx", function() {
            Q.stageScene("startGame");
        });
    });
    //Carga de sonidos
    Q.load(["coin.mp3", "coin.ogg", "music_die.mp3", "music_die.ogg", "music_level_complete.mp3", "music_level_complete.ogg", "music_main.mp3", "music_main.ogg", "jump_small.mp3", "jump_small.ogg", "kill_enemy.mp3", "kill_enemy.ogg", "1up.mp3", "1up.ogg", "item_rise.mp3", "item_rise.ogg", "hit_head.mp3", "hit_head.ogg"]);



};

//Et voilá, juego implementado con quintus!
