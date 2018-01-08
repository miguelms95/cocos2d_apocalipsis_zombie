var Disparo = cc.Class.extend({
    sprite: null,
    body: null,
    shape: null,
    orientacion: null,
    ctor: function (space, posicion, layer, orientacion, sprite) {
        var size = cc.winSize;
        var factorEscala = 0.2;
        this.orientacion = orientacion;
        this.sprite = sprite;
        this.sprite.setScale(factorEscala, factorEscala);
        this.body = new cp.Body(5, Infinity);
        this.body.setPos(posicion);
        this.body.setAngle(0);

        this.sprite.setBody(this.body);
        space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width * factorEscala,
            this.sprite.getContentSize().height * factorEscala);

        this.shape.setFriction(1);
        this.shape.setElasticity(0);
        this.shape.setCollisionType(tipoDisparo);

        space.addShape(this.shape);

        layer.addChild(this.sprite, 10);
        if (this.orientacion == DERECHA)
            this.body.applyImpulse(cp.v(1500, 0), cp.v(0, 0));
        else if (this.orientacion == IZQUIERDA)
            this.body.applyImpulse(cp.v(-1500, 0), cp.v(0, 0));
        else if (this.orientacion == ARRIBA)
            this.body.applyImpulse(cp.v(0, 1500), cp.v(-0, 0));
        else
            this.body.applyImpulse(cp.v(0, -1500), cp.v(0, 0));
    }
});