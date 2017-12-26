var CirculoVision = cc.Class.extend({
    sprite: null,
    activado: false,
    layer: null,
    ctor: function(layer) {
        this.layer = layer;
        var size = cc.winSize;
        this.sprite = new cc.Sprite(res.vision_cueva_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            width: size.width,
            height: size.height
        });
    },
    activar: function() {
        if (!this.activado) {
            this.layer.addChild(this.sprite, 20);
            this.activado = true;
        }
    },
    desactivar: function() {
        if (this.activado) {
            this.layer.removeChild(this.sprite);
            this.activado = false;
        }
    },
    mover: function(caballero) {
        var posVisionX = caballero.body.p.x - 34;
        var posVisionY = caballero.body.p.y - 20;
        
        this.sprite.x = posVisionX - cc.winSize.width / 2;
        this.sprite.y = posVisionY - cc.winSize.height / 2;
    }
});