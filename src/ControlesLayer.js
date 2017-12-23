var ControlesLayer = cc.Layer.extend({
    pad: null,
    llaves: [],
    vidas: [],
    ctor: function() {
        this._super();
        var posActualLlave = 30;
        for (var i = 0; i < llavesNecesarias; i++) {
            var llave = new ContadorLlave(posActualLlave);
            this.llaves.push(llave);
            this.addChild(llave.sprite);
            posActualLlave = posActualLlave + 27;
        }

        var posActualVida = 630;
        for (var i = 0; i < vidasJugador; i++) {
            var vida = new ContadorVidas(posActualVida);
            this.vidas.push(vida);
            this.addChild(vida.sprite);
            posActualVida = posActualVida + 35;
        }


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
    procesarMouseDown: function(event) {
        var instancia = event.getCurrentTarget();
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
        var posicion = cc.p(event.getLocationX(), event.getLocationY());
        gameLayer.orientacionPad = instancia.pad.pulsado(posicion);
    },
    procesarMouseUp: function(event) {
        var instancia = event.getCurrentTarget();
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
        gameLayer.orientacionPad = 0;
    },
    procesarMouseMove: function(event) {
        var instancia = event.getCurrentTarget();
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);

        if (gameLayer.orientacionPad != 0)
            gameLayer.orientacionPad = instancia.pad.pulsado(cc.p(event.getLocationX(), event.getLocationY()));
    },
    colorearLlave: function() {
        for (var i = 0; i < llaves.lenght; i++) {
            if (llaves[i].activado == 0) {
                llaves[i].activar();
                break;
            }
        }
    }
});