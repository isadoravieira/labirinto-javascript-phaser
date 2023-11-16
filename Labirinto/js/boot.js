// Gatilho que inicia o jogo. Carrega o minimo necessário na memória do computador, para que seja iniciado o carregamento do sistema
var bootState = {

    preload: function(){
        game.load.image('progressBar','img/progressBar.png');
    },

    create: function(){
        game.state.start('load'); //chama o objeto load
    }
};

// o phaser necessita de 4 métodos fundamentais:
// preload(); -> responsável pelo pré-carregamento de algo
// create(); ->  responsável pela configuração daquele State (os objetos)
// update(); -> responsável pelo processamento da lógica do jogo
// render(); -> faz o debug do sistema