var ContadorLlave = cc.Class.extend({
    gameLayer: null,
    sprite: null,
    shape: null,
    activada: null,
    posicionX: null,
    layer: null,
    ctor: function(layer, posicionX) {
        this.layer = layer;
        this.posicionX = posicionX;
        this.sprite = new cc.Sprite(res.llave_gris_png);
        this.activada = 0;
        this.sprite.setPosition(posicionX, 420);
        this.layer.addChild(this.sprite);

    },
    activar: function() {
        console.log("Activado")
        this.layer.removeChild(this.sprite);
        this.sprite = new cc.Sprite(res.llave_activada_png);
        this.sprite.setPosition(this.posicionX, 420);
        this.activada = 1;
        this.layer.addChild(this.sprite);
    }
});