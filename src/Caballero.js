var IZQUIERDA = 3;
var DERECHA = 1;
var ARRIBA = 4;
var ABAJO = 2;
var Caballero = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    body: null,
    layer: null,
    animacionQuieto: null,
    animacionDerecha: null,
    animacionIzquierda: null,
    animacionArriba: null,
    animacionAbajo: null,
    multVelocidad: null,
    animacion: null, // Actuals
    llaves: 0,
    vidas: vidasJugador,
    cargasTurbo: 0,
    ancho: null,
    alto: null,
    orientacion: null,

    ctor: function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;
        this.orientacion = ABAJO;
        this.multVelocidad = 1.0;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#caballero_quieto_01.png");
        this.sprite.setScaleX(0.4);
        this.sprite.setScaleY(0.5);
        // Cuerpo dinamico, SI le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);

        this.body.setPos(posicion);
        //body.w_limit = 0.02;
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        this.ancho = this.sprite.getContentSize().width * 0.4;
        this.alto = this.sprite.getContentSize().height * 0.5;

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.ancho,
            this.alto);

        this.shape.setFriction(1);
        this.shape.setElasticity(0);
        this.shape.setCollisionType(tipoJugador);

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
        layer.addChild(this.sprite, 10);

    },
    inicializar: function() {
        this.llaves = 0;
        this.vidas = vidasJugador;
        this.cargasTurbo = 0;
    },
    cambiarCapa: function (space, posicion, layer) {
        this.space.removeShape(this.shape);
        this.space.removeBody(this.body);
        this.layer.removeChild(this.sprite);
        this.space = space;
        this.layer = layer;
        this.space.addShape(this.shape);
        this.space.addBody(this.body);
        this.body.setPos(posicion);
        layer.addChild(this.sprite, 10);
    },
    moverIzquierda: function () {
        if (this.animacion != this.animacionIzquierda) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionIzquierda;
            this.sprite.runAction(this.animacion);
            this.orientacion = IZQUIERDA;
        }
        this.body.vy = 0;
        if (this.body.vx > -100 * this.multVelocidad) {
            this.body.applyImpulse(cp.v(-100 * this.multVelocidad, 0), cp.v(0, 0));
        }
    },
    moverDerecha: function () {
        if (this.animacion != this.animacionDerecha) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionDerecha;
            this.sprite.runAction(this.animacion);
            this.orientacion = DERECHA;
        }
        this.body.vy = 0;
        if (this.body.vx < 100 * this.multVelocidad) {
            this.body.applyImpulse(cp.v(100 * this.multVelocidad, 0), cp.v(0, 0));
        }
    },
    moverArriba: function () {
        if (this.animacion != this.animacionArriba) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionArriba;
            this.sprite.runAction(this.animacion);
            this.orientacion = ARRIBA;
        }

        this.body.vx = 0;
        if (this.body.vy < 100 * this.multVelocidad) {
            this.body.applyImpulse(cp.v(0, 100 * this.multVelocidad), cp.v(0, 0));
        }
    },
    moverAbajo: function () {
        if (this.animacion != this.animacionAbajo) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionAbajo;
            this.sprite.runAction(this.animacion);
            this.orientacion = ABAJO;
        }

        this.body.vx = 0;
        if (this.body.vy > -100 * this.multVelocidad) {
            this.body.applyImpulse(cp.v(0, -100 * this.multVelocidad), cp.v(0, 0));
        }

    },
    detener: function () {
        if (this.animacion != this.animacionQuieto) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionQuieto;
            this.sprite.runAction(this.animacion);
            this.orientacion = ABAJO;
        }
        this.body.vx = 0;
        this.body.vy = 0;
    },
    mirandoHaciaArriba: function () {
        return this.animacion === this.animacionArriba;
    },
    mirarAbajo: function () {
        this.animacion = this.animacionAbajo;
    },
    mirarArriba: function () {
        this.animacion = this.animacionArriba;
    },
    quieto: function () {
        return this.animacion === this.animacionQuieto;
    },
    disparar: function () {
        if (this.orientacion == DERECHA)
            this.layer.disparos.push(new Disparo(this.space, cc.p(this.body.p.x + this.ancho, this.body.p.y), this.layer, this.orientacion, new cc.PhysicsSprite(res.disparoRi_png)));
        else if (this.orientacion == IZQUIERDA)
            this.layer.disparos.push(new Disparo(this.space, cc.p(this.body.p.x - this.ancho, this.body.p.y), this.layer, this.orientacion, new cc.PhysicsSprite(res.disparoLe_png)));
        else if (this.orientacion == ARRIBA)
            this.layer.disparos.push(new Disparo(this.space, cc.p(this.body.p.x, this.body.p.y + this.alto), this.layer, this.orientacion, new cc.PhysicsSprite(res.disparoUp_png)));
        else
            this.layer.disparos.push(new Disparo(this.space, cc.p(this.body.p.x, this.body.p.y - this.alto), this.layer, this.orientacion, new cc.PhysicsSprite(res.disparoDo_png)));
    }
});