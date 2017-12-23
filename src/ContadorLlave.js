var ContadorLlave = cc.Class.extend({
    gameLayer: null,
    sprite: null,
    shape: null,
    ctor: function(posicionX) {
        this.sprite = new cc.Sprite(res.llave_gris_png);

<<<<<<< HEAD
        this.sprite.setPosition(posicionX, 190);
=======
        // this.shape.setSensor(true); // Nunca genera colisiones reales, es como un “fantasma”

        this.sprite.setPosition(posicionX, 420);
>>>>>>> 1f85a44dd8bfb53fe3a9fbe5860a202986b1c431

        this.sprite.setScaleX(0.5);
        this.sprite.setScaleY(0.5);

    },
    activar: function() {
        this.sprite = new cc.Sprite(res.llave_activada_png);
    }
});