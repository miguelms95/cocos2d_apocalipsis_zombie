var BotonDisparar = cc.Class.extend({
    spriteBotonDisparar:null,
    ctor:function (layer){
        var size = cc.winSize;
        this.spriteBotonDisparar = cc.Sprite.create(res.boton_disparar_png);
        this.spriteBotonDisparar.setPosition(cc.p(size.width*0.9, size.height*0.45));
        this.spriteBotonDisparar.setScaleX(0.5);
        this.spriteBotonDisparar.setScaleY(0.5);
        layer.addChild(this.spriteBotonDisparar);
    },
    pulsado:function(posicion){
        var areaBotonDisparar = this.spriteBotonDisparar.getBoundingBox();
          if (cc.rectContainsPoint(areaBotonDisparar, posicion))
                return true;
          else
            return false;
    }
});