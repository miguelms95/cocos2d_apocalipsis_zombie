
var ContadorLLave = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (posicion, p_width, p_height) {
        this.sprite = new cc.Sprite(res.llave_gris_png);

        this.shape.setSensor(true); // Nunca genera colisiones reales, es como un “fantasma”

        this.sprite.setScaleX(0.3);
        this.sprite.setScaleY(0.3);

    }, eliminar: function (){
        // quita la forma
        this.gameLayer.space.removeShape(this.shape);

        // quita el cuerpo *opcional, funciona igual
        // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
        // this.gameLayer.space.removeBody(shape.getBody());

        // quita el sprite
        this.gameLayer.removeChild(this.sprite);
    }
});
