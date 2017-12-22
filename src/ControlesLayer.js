var ControlesLayer = cc.Layer.extend({
    pad: null,
    enMouseDown: false,
    posMouseDown: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        this.pad = new Pad(this);

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown,
            onMouseUp: this.procesarMouseUp,
        }, this)

        this.scheduleUpdate();
        return true;
    },
    mouseDown: function (instancia) {
        var orientacionPad = instancia.pad.pulsado(instancia.posMouseDown);
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);

        if (orientacionPad == instancia.pad.IZQUIERDA) {
            gameLayer.moverCaballeroIzquierda();
        } else if (orientacionPad == instancia.pad.DERECHA) {
            gameLayer.moverCaballeroDerecha();
        } else if (orientacionPad == instancia.pad.ARRIBA) {
            gameLayer.moverCaballeroArriba();
        } else if (orientacionPad == instancia.pad.ABAJO) {
           gameLayer.moverCaballeroAbajo();
        }
    },
    update: function (dt) {
        if (this.enMouseDown) {
            this.mouseDown(this);
        }
    },
    procesarMouseDown: function (event) {
        var instancia = event.getCurrentTarget();
        instancia.enMouseDown = true;
        instancia.posMouseDown = cc.p(event.getLocationX(), event.getLocationY());
        instancia.mouseDown(instancia);
    },
    procesarMouseUp: function (event) {
        var instancia = event.getCurrentTarget();
        instancia.enMouseDown = false;
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
        gameLayer.caballero.detener();
    }
});