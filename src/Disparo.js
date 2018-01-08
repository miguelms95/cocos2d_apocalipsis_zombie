var Disparo = cc.Class.extend({
    sprite:null,
    body:null,
    shape:null,
    ctor:function (space, posicion, layer){
        var size = cc.winSize;
        var factorEscala = 0.2;
        this.sprite = new cc.PhysicsSprite(res.disparo_png);
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

        this.body.applyImpulse(cp.v(1500, 0), cp.v(0, 0));
    }
});