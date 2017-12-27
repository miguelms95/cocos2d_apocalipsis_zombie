
var BotonTurbo = cc.Class.extend({
    spriteBotonTurbo:null,
    ctor:function (layer){
        var size = cc.winSize;
        this.spriteBotonTurbo = cc.Sprite.create(res.boton_turbo_png);
        this.spriteBotonTurbo.setPosition(cc.p(size.width*0.8, size.height*0.2));
        layer.addChild(this.spriteBotonTurbo);
    },
    pulsado:function(posicion){
        var areaBotonTurbo = this.spriteBotonTurbo.getBoundingBox();
          if (cc.rectContainsPoint(areaBotonTurbo, posicion))
                return true;
          else
            return false;
    }
});