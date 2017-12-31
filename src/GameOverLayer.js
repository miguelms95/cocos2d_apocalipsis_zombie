var GameOverLayer = cc.Layer.extend({
    ctor:function() {
        this._super();
        this.init();
    },
    init:function() {
        this._super(cc.color(0, 0, 0, 255));

        var winSize = cc.director.getWinSize();

        var botonReiniciar = new cc.MenuItemSprite(
            new cc.Sprite(res.boton_reanudar_png),
            new cc.Sprite(res.boton_reanudar_png),
            this.pulsarReiniciar, this);

        var menu = new cc.Menu(botonReiniciar);
        menu.setPosition(winSize.width / 2, winSize.height / 2);

        var fondo = new cc.Sprite();
        fondo.setTextureRect(cc.rect(winSize.width / 2, winSize.height / 2, winSize.width, winSize.height));
        fondo.setAnchorPoint(0.5, 0.5);
        fondo.setPosition(winSize.width / 2, winSize.height / 2);
        fondo.setColor(cc.color(0, 0, 0, 0));
        this.addChild(fondo);
        this.addChild(menu);
    },
    pulsarReiniciar:function(sender) {
        // Volver a ejecutar la escena principal
        cc.director.runScene(new GameScene());
    }
});