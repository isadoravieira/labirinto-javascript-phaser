// tela do jogo com o labirinto
var stageState = {

    create: function(){

        this.onGame = true;

        game.add.sprite(0,0,'background');

        //é uma matriz multidimensional de 20x20 para representar o labirinto
        // 1 = muro, 2 = personagem, 3 = moedas
        this.maze =  [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,0,0,1,0,0,1,0,0,0,0,0,1],
        [1,0,0,0,0,0,3,1,0,0,1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,3,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,3,1,0,0,1,0,0,0,0,1,0,0,0,1],
        [1,0,0,1,1,1,1,1,0,0,1,0,0,0,0,3,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,0,1,0,0,2,0,0,1,0,0,0,0,3,1],
        [1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,1],
        [1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,3,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,0,0,0,0,3,0,1,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        
        // armazena os blocos que compoe o labirinto
        this.blocks = game.add.group();

        // adiciona fisica nos blocos
        this.blocks.enableBody = true;

        // posições das moedas
        this.coinPositions = [];

        this

        for(var row in this.maze){
            for(var column in this.maze[row]){
                var tile = this.maze[row][column];

                var x = column * 50;
                var y = row * 50;

                if(tile === 1){ // verificando se é um muro
                    var block = this.blocks.create(x,y, 'block');
                        block.body.immovable = true; // deixa o muro fixo
                } else
                if(tile === 2){
                    this.player = game.add.sprite(x + 25,y + 25,'player');
                    this.player.anchor.set(0.5);
                    game.physics.arcade.enable(this.player); // aplica as funções de fisica no personagem , para que ele possa interargir com o ambiente

                    // animações do personagem
                    this.player.animations.add('goDown', [0,1,2,3,4,5,6,7], 12, true); // adiciona animação ao personagem andar para baixo
                    this.player.animations.add('goUp', [8,9,10,11,12,13,14,15], 12, true); // adiciona animação ao personagem andar para cima
                    this.player.animations.add('goLeft', [16,17,18,19,20,21,22,23], 12, true); // adiciona animação ao personagem andar para a esquerda
                    this.player.animations.add('goRight', [24,25,26,27,28,29,30,31], 12, true); // adiciona animação ao personagem andar para a direita
                }else
                if(tile === 3){
                    var position = {
                        x: x + 25,
                        y: y + 25
                    };
                    this.coinPositions.push(position); // armazena as posições em quem as moedas podem aparecer
                }
            }
        }

        // Inimigo
        this.enemy = game.add.sprite(75,75, 'enemy');
        this.enemy.anchor.set(0.5);
        game.physics.arcade.enable(this.enemy);
        // animações do inimigo
        this.enemy.animations.add('goDown', [0,1,2,3,4,5,6,7], 12, true); // adiciona animação ao personagem andar para baixo
        this.enemy.animations.add('goUp', [8,9,10,11,12,13,14,15], 12, true); // adiciona animação ao personagem andar para cima
        this.enemy.animations.add('goLeft', [16,17,18,19,20,21,22,23], 12, true); // adiciona animação ao personagem andar para a esquerda
        this.enemy.animations.add('goRight', [24,25,26,27,28,29,30,31], 12, true); // adiciona animação ao personagem andar para a direita
        this.enemy.direction = 'DOWN';

        //  criação das moedas
        this.coin = {};
        this.coin.position = this.newPosition();
        this.coin = game.add.sprite(this.coin.position.x,this.coin.position.y, 'coin');
        this.coin.anchor.set(0.5);
        this.coin.animations.add('spin', [0,1,2,3,4,5,6,7,8,9], 10,true).play();

        // coletar moedas
        this.coins = 0;
        this.txtCoins = game.add.text(15,15, 'COINS: ' + this.getText(this.coins), {font: '15px emulogic', fill: '#fff'});
        game.physics.arcade.enable(this.coin);


        // controles
        this.controls = game.input.keyboard.createCursorKeys();

        // // camera
        // game.physics.arcade.setBounds(0, 0, 750, 650);
        // game.camera.follow(this.player); // Inicia o acompanhamento da câmera com o jogador
        // game.camera.setBoundsToWorld(0,0,750,600); // Define os limites da câmera para o tamanho do mundo do jogo

        // // // objeto camera
        // // const camera = game.cameras;
        // // game.camera.startFollow(this.player);

        //particulas de explosão
        this.emitter = game.add.emitter(0,0,15);
        this.emitter.makeParticles('part');
        this.emitter.setXSpeed(-50,50);
        this.emitter.setYSpeed(-50,50);
        this.emitter.gravity.y = 0;

        //timer
        this.time = 60;
        this.txtTimer = game.add.text(game.world.width - 15,15, 'TIME: ' + this.getText(this.time), {font: '15px emulogic', fill: '#fff'});
        this.txtTimer.anchor.set(1, 0);
        this.timer = game.time.events.loop(1000, function(){
            this.time --;
            this.txtTimer.text = 'TIME: ' + this.getText(this.time);
        },this);
    },

    update: function(){

        if(this.onGame){
            // faz a fisica de colisaõ com os blocos
            game.physics.arcade.collide(this.player,this.blocks);

            // faz a fisica da moeda em relaçã ao personagem
            game.physics.arcade.overlap(this.player, this.coin, this.getCoin,null,this);

            // faz a fisica do inimigo em relaçã ao personagem
            game.physics.arcade.overlap(this.player, this.enemy, this.loseCoin,null,this);

            //chama a função de movimento do inimigo
            this.moveEnemy();

            // chama a função de movimento do personagem
            this.movePlayer();

            // game over
            if(this.time < 1 || this.coins >= 10){
                this.gameOver();
            }
        }
        
    },

    gameOver: function(){
        this.onGame = false;

        // para a contagem de tempo
        game.time.events.remove(this.timer);

        // para o personage,
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.animations.stop();
        this.player.frame = 0;

        // para o inimigo
        this.enemy.animations.stop();
        this.enemy.frame =0;

        if(this.coins >= 10){ // ganhou
           var txtLevelComplete = game.add.text(game.world.centerX, 460, 'LEVEL COMPLETE', {font: '40px emulogic', fill: '#fff'});
            txtLevelComplete.anchor.set(0.5);
        }else{// acabou o tempo
            var txtGameOver = game.add.text(game.world.centerX, 460, 'GAME OVER', {font: '40px emulogic', fill: '#fff' });
            txtGameOver.anchor.set(0.5);
        }

        game.time.events.add(3000, function(){
            if(this.coins >= 10){
                game.state.start('end');
            } else{
                game.state.start('menu');
            }
        }, this);

    },
    
    loseCoin: function(){

        if(this.coins > 0){
            this.emitter.x = this.player.position.x;
            this.emitter.y = this.player.position.y;
            this.emitter.start(true, 500,null, 15);

            this.coins = 0;
            this.txtCoins.text = 'COINS: ' + this.getText(this.coins);
        }
        
    },
    
    moveEnemy: function() {
        if (Math.floor(this.enemy.x - 25) % 50 === 0 && Math.floor(this.enemy.y - 25) % 50 === 0) {
            // Endereço no qual o inimigo se encontra
            var enemyColumn = Math.floor(this.enemy.x / 50);
            var enemyRow = Math.floor(this.enemy.y / 50);
    
            // Possíveis direções para as quais o inimigo pode se mover
            var validPath = [];
    
            if (enemyColumn > 0 && this.maze[enemyRow][enemyColumn - 1] !== 1 && this.enemy.direction !== 'RIGHT') {
                validPath.push('LEFT');
            }
            if (enemyColumn < this.maze[0].length - 1 && this.maze[enemyRow][enemyColumn + 1] !== 1 && this.enemy.direction !== 'LEFT') {
                validPath.push('RIGHT');
            }
            if (enemyRow > 0 && this.maze[enemyRow - 1][enemyColumn] !== 1 && this.enemy.direction !== 'DOWN') {
                validPath.push('UP');
            }
            if (enemyRow < this.maze.length - 1 && this.maze[enemyRow + 1][enemyColumn] !== 1 && this.enemy.direction !== 'UP') {
                validPath.push('DOWN');
            }
    
            // Escolher uma direção aleatória das válidas
            if (validPath.length > 0) {
                this.enemy.direction = validPath[Math.floor(Math.random() * validPath.length)];
            }
        }
    
        
        // Movimento com base na direção
        switch (this.enemy.direction) {
            case 'LEFT':
                this.enemy.x -= 1;
                this.enemy.animations.play('goLeft');
                break;
            case 'RIGHT':
                this.enemy.x += 1;
                this.enemy.animations.play('goRight');
                break;
            case 'UP':
                this.enemy.y -= 1;
                this.enemy.animations.play('goUp');
                break;
            case 'DOWN':
                this.enemy.y += 1;
                this.enemy.animations.play('goDown');
                break;
        }
    },

    getCoin: function(){
        this.emitter.x = this.coin.position.x;
        this.emitter.y = this.coin.position.y;
        this.emitter.start(true, 500,null, 15);

        this.coins ++;
        this.txtCoins.text = 'COINS: ' + this.getText(this.coins);

        this.coin.position = this.newPosition();
    },

    

    // formata moedas e pontuação
    getText: function(value){
        if(value < 10){
            return '00' + value.toString();
        }
        if(value < 100){
            return '0' + value.toString();
        }
        return value.toString();
    },

    // move o personagem
    movePlayer: function(){
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if(this.controls.left.isDown && !this.controls.right.isDown){
            this.player.body.velocity.x = -150;     
            this.player.direction = "left";     
            
            
        }else
        if(this.controls.right.isDown && !this.controls.left.isDown){
            this.player.body.velocity.x = 150;
            this.player.direction = "right";
        }

        if(this.controls.up.isDown && !this.controls.down.isDown){
            this.player.body.velocity.y = -150;
            this.player.direction = "up";
        }else
        if(this.controls.down.isDown && !this.controls.up.isDown){
            this.player.body.velocity.y = 150;
            this.player.direction = "down";
        }

        switch(this.player.direction){
            case "left":
                this.player.animations.play('goLeft'); break;
            case "right":
                this.player.animations.play('goRight'); break;
            case "up":
                this.player.animations.play('goUp'); break;
            case "down":
                this.player.animations.play('goDown'); break;
        }

        // para a animação de movimentto do persongem quando ele estiver parado
        if(this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0){
            this.player.animations.stop();
        }
    },

    

    // função que atualiza a posição  da moeda
    newPosition: function(){
        
        var pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];

        while(this.coin.position === pos){
            pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
        }
        return pos;
    }
};