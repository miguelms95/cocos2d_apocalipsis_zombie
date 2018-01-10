
var CajaVida = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion, p_width, p_height) {
        this.gameLayer = gameLayer;

        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = "caja_vida_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.9);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#caja_vida_1.png");
        this.sprite.setScale(0.5, 0.5);
        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);

        this.sprite.setBody(body);

        // Los cuerpos estáticos nunca se añaden al Space
        var radio = (this.sprite.getContentSize().width * 0.5) / 2;
        // forma
        this.shape = new cp.CircleShape(body, radio , cp.vzero);

        // Nunca genera colisiones reales, es como un “fantasma”
        this.shape.setSensor(true);

        this.shape.setCollisionType(tipoCajaVida);

        // this.sprite.setScaleX(0.25);
        // this.sprite.setScaleY(0.25);

        // forma estática
        gameLayer.space.addStaticShape(this.shape);
        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);
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
