var ContadorVidas = cc.Class.extend({
    layer: null,
    sprite: null,
    shape: null,
    lleno:null,
    posicionX:null,
    ctor: function(layer,posicionX) {
        this.lleno = 1;
        this.layer = layer;
        this.posicionX = posicionX;
        this.sprite = new cc.Sprite(res.vida_png);
        this.sprite.setPosition(this.posicionX, 420);

        this.sprite.setScaleX(0.5);
        this.sprite.setScaleY(0.5);

    },
    vaciar: function() {
        this.layer.removeChild(this.sprite);
        this.sprite = new cc.Sprite(res.vida_punto_png);
        this.sprite.setPosition(this.posicionX, 420);
        this.sprite.setScaleX(0.5);
        this.sprite.setScaleY(0.5);
        this.lleno = 0;
        this.layer.addChild(this.sprite);
    },
    rellenar:function(){
        this.layer.removeChild(this.sprite);
        this.sprite = new cc.Sprite(res.vida_png);
        this.sprite.setPosition(this.posicionX, 420);
        this.sprite.setScaleX(0.5);
        this.sprite.setScaleY(0.5);
        this.lleno = 1;
        this.layer.addChild(this.sprite);
    }
});