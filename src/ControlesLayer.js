var ControlesLayer = cc.Layer.extend({
    pad: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        this.pad = new Pad(this);

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown,
            onMouseMove: this.procesarMouseMove,
            onMouseUp: this.procesarMouseUp,
        }, this)

        this.scheduleUpdate();
        return true;
    },
    procesarMouseDown: function (event) {
        var instancia = event.getCurrentTarget();
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
        var posicion = cc.p(event.getLocationX(), event.getLocationY());
        gameLayer.orientacionPad = instancia.pad.pulsado(posicion);
    },
    procesarMouseUp: function (event) {
        var instancia = event.getCurrentTarget();
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
        gameLayer.orientacionPad = 0;
    },
    procesarMouseMove: function (event) {
        var instancia = event.getCurrentTarget();
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);

        if (gameLayer.orientacionPad != 0) 
            gameLayer.orientacionPad = instancia.pad.pulsado(cc.p(event.getLocationX(), event.getLocationY()));
    }
});