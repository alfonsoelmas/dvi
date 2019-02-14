En la versión actual solamente sale 1 cliente en cada barra. Se hizo así de fácil para comprobar rápidamente que todo funcionaba correctamente.
Para ajustar la dificultad debemos cambia ren el siguiente fragmento de game las llamadas a la función Spawner.
Siendo los parámetros número de clientes que saldrán, tiempo entre clientes, retardo antes de empezar a generar los clientes, número de la barra; en ese orden.

   var c1 = 1;
   var c2 = 1;
   var c3 = 1;
   var c4 = 1;
   board.add(new Spawner(c1, 1, 1, 1));
   board.add(new Spawner(c2, 2, 2, 2));
   board.add(new Spawner(c3, 3, 3, 3));
   board.add(new Spawner(c4, 4, 4, 4));
