var Caballero = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacionQuieto:null,
    animacionDerecha:null,
    animacionIzquierda:null,
    animacionArriba:null,
    animacionAbajo:null,
    animacion:null, // Actual

ctor:function (space, posicion, layer) {
    this.space = space;
    this.layer = layer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#caballero_quieto_01.png");
    // Cuerpo dinamico, SI le afectan las fuerzas
    this.body = new cp.Body(5, Infinity);

    this.body.setPos(posicion);
    //body.w_limit = 0.02;
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    this.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);

    this.shape.setFriction(1);
    this.shape.setElasticity(0);

    // forma dinamica
    this.space.addShape(this.shape);

    // Crear animación - quieto
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_quieto_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionQuieto =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - derecha
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_derecha_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionDerecha =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - izquierda
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_izquierda_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionIzquierda =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - arriba
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_arriba_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionArriba =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - abajo
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_abajo_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionAbajo =
        new cc.RepeatForever(new cc.Animate(animacion));


    // ejecutar la animación
    this.sprite.runAction(this.animacionQuieto);
    this.animacion = this.animacionQuieto;
    layer.addChild(this.sprite,10);

    }, moverIzquierda:function() {
        if (this.animacion != this.animacionIzquierda){
            this.sprite.stopAllActions();
            this.animacion = this.animacionIzquierda;
            this.sprite.runAction(this.animacion);
        }

        this.body.vy = 0;
        if ( this.body.vx > -100){
            this.body.applyImpulse(cp.v(-100, 0), cp.v(0, 0));
        }

    }, moverDerecha:function() {
        if (this.animacion != this.animacionDerecha){
            this.sprite.stopAllActions();
            this.animacion = this.animacionDerecha;
            this.sprite.runAction(this.animacion);
        }

        this.body.vy = 0;
        if ( this.body.vx < 100){
            this.body.applyImpulse(cp.v(100, 0), cp.v(0, 0));
        }

    }, moverArriba:function() {
        if (this.animacion != this.animacionArriba){
            this.sprite.stopAllActions();
            this.animacion = this.animacionArriba;
            this.sprite.runAction(this.animacion);
        }

        this.body.vx = 0;
        if ( this.body.vy < 100){
            this.body.applyImpulse(cp.v(0, 100), cp.v(0, 0));
        }

    }, moverAbajo:function() {
        if (this.animacion != this.animacionAbajo){
            this.sprite.stopAllActions();
            this.animacion = this.animacionAbajo;
            this.sprite.runAction(this.animacion);
        }

       this.body.vx = 0;
       if ( this.body.vy > -100){
            this.body.applyImpulse(cp.v(0, -100), cp.v(0, 0));
       }

    }, detener : function() {
      if (this.animacion != this.animacionQuieto){
         this.sprite.stopAllActions();
         this.animacion = this.animacionQuieto;
         this.sprite.runAction(this.animacion);
       }

       this.body.vx = 0;
       this.body.vy = 0;
    }
});
