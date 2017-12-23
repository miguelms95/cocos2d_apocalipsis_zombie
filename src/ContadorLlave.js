var ContadorLlave = cc.Class.extend({
    gameLayer: null,
    sprite: null,
    shape: null,
    ctor: function(posicionX) {
        this.sprite = new cc.Sprite(res.llave_gris_png);

        this.sprite.setPosition(posicionX, 420);


        this.sprite.setScaleX(0.5);
        this.sprite.setScaleY(0.5);

    },
    activar: function() {
        this.sprite = new cc.Sprite(res.llave_activada_png);
    }
});