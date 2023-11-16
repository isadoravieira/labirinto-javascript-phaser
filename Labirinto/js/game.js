var gameWidth = 1000; // Largura da tela do jogo
var gameHeight = 1000; // Altura da tela do jogo

// Calcula a posição X e Y para centralizar o jogo
var centerX = (window.innerWidth - gameWidth) / 2;
var centerY = (window.innerHeight - gameHeight) / 2;

// Cria o objeto Phaser.Game e define a posição central
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, '', {
    preload: preload,
    create: create
});

function preload() {
    
}

function create() {
    // Define a posição central para o jogo
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    
    // Adicione os estados do jogo
    game.state.add('boot', bootState);
    game.state.add('load', loadState);
    game.state.add('menu', menuState);
    game.state.add('stage', stageState);
    game.state.add('end', endState);

    // Inicie o estado 'boot'
    game.state.start('boot');
}
