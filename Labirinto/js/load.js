
// tela de carregamento do jogo
var loadState = {

    preload: function(){

        // texto
        var textoLoading = game.add.text(game.world.centerX,220,'LOADING...', {font: '15px emulogic', fill: '#fff'});
            textoLoading.anchor.set(0.5); // centraliza na tela

        // barra de carregamento do jogo
        var progressBar = game.add.sprite(game.world.centerX,320,'progressBar');
            progressBar.anchor.set(0.5); // centraliza na tela

        game.load.setPreloadSprite(progressBar);

        // imagens
        game.load.image('background', 'img/bg.png');
        game.load.image('block', 'img/block.png');
        game.load.image('end', 'img/end.png');
        game.load.image('part', 'img/part.png');

        // sprites sheet (os 'atores' do jogo)
        game.load.spritesheet('coin', 'img/coin.png', 32,32);
        game.load.spritesheet('enemy', 'img/enemy.png', 24,40);
        game.load.spritesheet('player', 'img/player.png', 24,32);


        // carrega as funções de fisica do phaser        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        
    },

    create: function(){
        game.state.start('menu'); // chama o objeto menu
    }
};