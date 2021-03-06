var Persona = cc.Class.extend({
    frase: null,
    body: null,
    shape: null,
    sprite: null,
    ancho: null,
    alto: null,
    yahablado: false,
    ctor: function(layer, space, pos, frase) {
        this.frase = frase;

        this.body = new cp.StaticBody();
        this.body.setPos(pos);
        this.body.setAngle(0);

        var factorEscalado = 0.5;

        this.sprite = new cc.PhysicsSprite(res.persona_png);
        this.sprite.setBody(this.body);
        this.sprite.setScale(factorEscalado, factorEscalado);

        this.ancho = this.sprite.getContentSize().width * factorEscalado;
        this.alto = this.sprite.getContentSize().height * factorEscalado;

        this.shape = new cp.BoxShape(this.body,
            this.ancho,
            this.alto);

        this.shape.setSensor(false);
        this.shape.setCollisionType(tipoPersona);

        // forma dinamica
        space.addStaticShape(this.shape);

        layer.addChild(this.sprite, 10);
    }
});