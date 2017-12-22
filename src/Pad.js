var PAD_IZQUIERDA = 1;
var PAD_DERECHA = 2;
var PAD_ARRIBA = 3;
var PAD_ABAJO = 4;

var Pad = cc.Class.extend({
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
        var areaPad = this.spritePad.getBoundingBox();
        var x = areaPad.x + areaPad.width / 2;
        var y = areaPad.y + areaPad.height / 2;
        
        if (cc.rectContainsPoint(areaPad, posicion)) {
            if (Math.abs(x - posicion.x) > Math.abs(y - posicion.y)) {
                if (x - posicion.x > 0) {
                    return PAD_IZQUIERDA;
                }
                return PAD_DERECHA;
            } else {
                if (y - posicion.y > 0) {
                    return PAD_ABAJO;
                }
                return PAD_ARRIBA;
            }
        }

        return 0;
    }
});