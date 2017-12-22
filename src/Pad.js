var Pad = cc.Class.extend({
    IZQUIERDA: 1,
    DERECHA: 2,
    ARRIBA: 3,
    DERECHA: 4,
    spritePad: null,
    ctor: function (layer) {
        var size = cc.winSize;

        this.spritePad = new cc.Sprite(res.pad_png);
        // Asigno posición 
        this.spritePad.setPosition(90, 90);
        // Añado Sprite a la escena
        layer.addChild(this.spritePad);
    },

    pulsado: function (posicion) {
        var x = this.spritePad.getPosition().x;
        var y = this.spritePad.getPosition().y;
        var ancho = this.spritePad.ancho;
        var altura = this.spritePad.altura;

        var areaPad = this.spritePad.getBoundingBox();

        if (cc.rectContainsPoint(areaPad, posicion)) {
            if (Math.abs(x - posicion.x) > Math.abs(y - posicion.y)) {
                if (x - posicion.x > 0) {
                    return this.IZQUIERDA;
                }
                return this.DERECHA;
            } else {
                if (y - posicion.y > 0) {
                    return this.ABAJO;
                }
                return this.ARRIBA;
            }
        }
        return 0;
    }
});