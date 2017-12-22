var Pad = cc.Class.extend({
    ctor: function (scene) {
        var size = cc.winSize;

        var spritePad = new cc.Sprite(res.pad_png);
        // Asigno posición 
        spritePad.setPosition(90, 90);
        // Añado Sprite a la escena
        scene.addChild(spritePad, 9999);
    }
});