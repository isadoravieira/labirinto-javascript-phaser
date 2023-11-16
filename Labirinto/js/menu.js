// a partir desse objeto não é mais necessário usar o método preload, pois o objeto load já vai ser responsavel por fazer o pre-carregamento de todos os itens do jogo
var menuState = {

    create: function(){

        // texto 
        var txtLabirinto = game.add.text(game.world.centerX,250,'LABIRINTO',{font: '60px emulogic', fill: '#fff'});
            txtLabirinto.anchor.set(0.5); //centraliza na tela

        var txtPressStart = game.add.text(game.world.centerX,1090, 'PRESS ENTER', {font: '40px emulogic', fill: '#fff'});
            txtPressStart.anchor.set(0.5); // centraliza na tela

        var txtExplicacao = game.add.text(game.world.centerX, 1090, 'colete todas as moedas', {font:'33px emulogic', fill: '#fff'});
            txtExplicacao.anchor.set(0.5); // centraliza na tela

        var txtExplicacao2 = game.add.text(game.world.centerX, 1090, 'e cuidado com o', {font: '33px emulogic', fill: '#fff'});
            txtExplicacao2.anchor.set(0.5); // centraliza na tela

        var txtExplicacao3 = game.add.text(game.world.centerX, 690, 'MONSTRO', {font: '40px emulogic', fill: '#00FF40'});
            txtExplicacao3.anchor.set(0.5); // centraliza na tela

        // movimentos de texto 
        game.add.tween(txtPressStart).to({y: 500},1000).start();

        game.add.tween(txtExplicacao).to({y: 700}, 1000).start();

        game.add.tween(txtExplicacao2).to({y: 740}, 1000).start();

        game.add.tween(txtExplicacao3).to({y: 785}, 1000).start();

        // tecla enter como entrada do jogo
        game.time.events.add(1000,function(){
            var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                enterKey.onDown.addOnce(this.startGame, this); // addOnce dispara apenas uma vez
        },this);        

        },

        startGame: function(){
            game.state.start('stage');
        }

        
};