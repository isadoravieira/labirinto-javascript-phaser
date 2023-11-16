var scriptState = {};

(function(){

    var canva = document.querySelector("canvas");
    var contexto = canva.getContext("2d");

    var WIDTH = canva.width, HEIGHT = canva.height;

    var LEFT = 37, UP = 38, RIGHT =39, DOWN = 40;
    var mvLeft = mvUp = mvRight = mvDown = false;

    var tileSize = 64;

    // armazena as dimensões de captura da imagem
    var tileSrcSize = 96;

    var imagem = new Image()
        imagem.src = "./img/img.png";
        imagem.addEventListener("load", function(){
            requestAnimationFrame(loop,canva); // a chamada do disparo do jogo só vai ser feita depois de concluir o carregamento da imagem
        }, false);

    var walls = []; // armazenas todas as paredes do labirinto

    // objeto jogador
    var player = {
        x: tileSize + 2, // posição horizontal do jogador
        y: tileSize + 2, // posição vertical do jogador
        width: 24, // largura do jogador de acordo com a imagem
        height: 32, // altura do jogador de acordo com a imagem
        speed: 2, // velocidade do jogador
        srcX: 0,
        srcY: tileSrcSize,
        countAnim: 0
    }

    // é uma matriz multidimensional de 20x20 para representar o labirinto
    var maze = [ 
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,1,0,0,1,0,0,1,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,0,1,1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,1],
        [1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // armazenam a altura e largura total do labirinto
    var T_WIDTH = maze[0].length * tileSize,
        T_HEIGHT = maze.length * tileSize;

    for( var row in maze){
        for(var column in maze[row]){
            var tile = maze[row][column];
            if(tile === 1){ // verificando se é um muro
                var wall = {
                    x: tileSize * column,
                    y: tileSize * row,
                    width: tileSize,
                    height: tileSize
                };
                walls.push(wall);
            }
        }
    }

    var camera = {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        innerLeftBoundary: function(){
            return this.x + (this.width*0.25);
        },
        innerTopBoundary: function(){
            return this.y + (this.height*0.25);
        },
        innerRightBoundary: function(){
            return this.x + (this.width*0.75);
        },
        innerBottomBoundary: function(){
            return this.y + (this.height*0.75);
        }
    };

    function blockRectangle(objA, objB){
        var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);// armazena a distancia entre dois objetos no eixo 'x' //ve se o muro está a direita ou esquerda do personagem, verificando se o resultado é positivo ou negativo
        var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);

        var sumWidth = (objA.width + objB.width)/2;
        var sumHeight = (objA.height + objB.height)/2;

        if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){ // situação de colisão
            var overLapX = sumWidth - Math.abs(distX);
            var overLapY = sumHeight - Math.abs(distY);

            if(overLapX > overLapY){ // verifica se a colisão aconteceu no eixo 'y'
                objA.y = distY > 0 ? objA.y + overLapY : objA.y - overLapY; // verifica se a colisão veio de cima ou de baixo
            } else { // se a colisão não veio do eixo 'y' , significa que veio do eixo 'x'
                objA.x = distX > 0 ? objA.x + overLapX : objA.x - overLapX;
            }
        }
    }

    window.addEventListener("keydown", keydownHandler, false); // evento quando uma tecla é apertada
    window.addEventListener("keyup", keyupHandler, false); // evento quando uma tecla é solta

    function keydownHandler(e){
        var key = e.keyCode;
        switch(key){
            case LEFT:
                mvLeft = true;
                break;
            case UP:
                mvUp = true;
                break;
            case RIGHT:
                mvRight = true;
                break;
            case DOWN:
                mvDown = true;
                break;
        }
    }

    function keyupHandler(e){
        var key = e.keyCode;
        switch(key){
            case LEFT:
                mvLeft = false;
                break;
            case UP:
                mvUp = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case DOWN:
                mvDown = false;
                break;
        }
    }

    function update(){ 
        
        // verifica o estados das variaveis de movimento do personagem
        if(mvLeft && !mvRight){ // se move left for verdadeiro e moce right seja falso
            player.x -= player.speed;
            player.srcY = tileSrcSize + player.height * 2;
        } else
        if(mvRight && !mvLeft){
            player.x += player.speed;
            player.srcY = tileSrcSize + player.height * 3;
        } else
        if(mvUp && !mvDown){
            player.y -= player.speed;
            player.srcY = tileSrcSize + player.height * 1;
        } else
        if(mvDown && !mvUp){
            player.y += player.speed;
            player.srcY = tileSrcSize + player.height * 0;
        }

        if(mvLeft || mvRight || mvUp || mvDown){
            player.countAnim++;

            if(player.countAnim >= 40){ // garante que a imagem nunca passe de 7
                player.countAnim = 0;
            }

            player.srcX = Math.floor(player.countAnim/5) * player.width;
        } else{
            player.srcX = 0;
            player.countAnim = 0;
        }

        // verifica se o jogador colidiu com o muro
        for(var i in walls){
            var wall = walls[i];
            blockRectangle(player,wall);
        }

        // verifica os limites da tela
        if(player.x < camera.innerLeftBoundary()){
            camera.x = player.x - (camera.width * 0.25);
        }
        if(player.y < camera.innerTopBoundary()){
            camera.y = player.y - (camera.height * 0.25);
        }
        if(player.x + player.width > camera.innerRightBoundary()){
            camera.x = player.x + player.width - (camera.width * 0.75);
        }
        if(player.y + player.height > camera.innerBottomBoundary()){
            camera.y = player.y + player.height - (camera.height * 0.75);
        }


        // ajuste final das coordenadas da camera, que não podem ser nem menores que zero e nem maiores do que a largura total da camera 
        camera.x = Math.max(0,Math.min(T_WIDTH - camera.width, camera.x));
        camera.y = Math.max(0,Math.min(T_HEIGHT - camera.height, camera.y)); 

    }

    function render(){
        contexto.clearRect(0,0, WIDTH,HEIGHT); // limpa as posições anteriores do jogador
        contexto.save();

        // desloca o contexto de renderização em proporção inversa ao deslocamento da camera
        contexto.translate(-camera.x,-camera.y);

        for( var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];                
                var x = column * tileSize; // faz o posicionamento de renderização a cada 32 pixels do eixo horizontal
                var y = row * tileSize; // faz o posicionamento de renderização a cada 32 pixels do eixo vertical 

                // desenha imagens na tela
                contexto.drawImage(
                    imagem,
                    tile * tileSrcSize,0,tileSrcSize,tileSrcSize, // dimensões de caaptura da imagem do labirinto (chão e parede)
                    x,y,tileSize,tileSize
                );
                
            }
        }

        
        contexto.drawImage(
            imagem,
            player.srcX, player.srcY, player.width, player.height, // dimensões de caaptura da imagem do personagem
            player.x , player.y, player.width, player.height
        );
        contexto.restore(); // restaura todo o cotexto do labirinto como ele estava antes de mudar a cor

    }

    function loop(){
        update();
        render();
        requestAnimationFrame(loop,canva);
    }
    
}());