<<<<<<< HEAD
var ContadorLlave = cc.Class.extend({
    gameLayer: null,
    sprite: null,
    shape: null,
    ctor: function(posicionX) {
=======

var ContadorLlave = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (posicionX) {
>>>>>>> 15669a0bbe22cfdd6621a8d94f98e3d2ca603e52
        this.sprite = new cc.Sprite(res.llave_gris_png);

        // this.shape.setSensor(true); // Nunca genera colisiones reales, es como un “fantasma”

        this.sprite.setPosition(posicionX, 190);

        this.sprite.setScaleX(0.5);
        this.sprite.setScaleY(0.5);

    },
    activar: function() {
        this.sprite = new cc.Sprite(res.llave_activada_png);
    }
});