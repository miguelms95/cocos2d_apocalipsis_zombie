var ControlesLayer = cc.Layer.extend({
    pad: null,
    botonTurbo:null,
    llaves: [],
    vidas: [],
    etiquetaCargas:null,
    ctor: function() {
        this._super();
        var size = cc.winSize;
        var posActualLlave = 30;
        for (var i = 0; i < llavesNecesarias; i++) {
            var capa = this;
            var llave = new ContadorLlave(capa, posActualLlave);
            this.llaves.push(llave);
            posActualLlave = posActualLlave + 27;
        }

        var posActualVida = 630;
        for (var i = 0; i < vidasJugador; i++) {
        var capa = this;
            var vida = new ContadorVidas(capa,posActualVida);
            this.vidas.push(vida);
            this.addChild(vida.sprite);
            posActualVida = posActualVida + 35;
        }

        // Contador de cargas
        this.etiquetaCargas = new cc.LabelTTF("Cargas de turbo: 0", "Helvetica", 20);
        this.etiquetaCargas.setPosition(cc.p(size.width - 90, size.height - 80));
        this.etiquetaCargas.fillStyle = new cc.Color(0, 0, 0, 0);
        this.addChild(this.etiquetaCargas);

        this.pad = new Pad(this);
        this.botonTurbo = new BotonTurbo(this);

        // Registrar Mouse Events
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown,
            onMouseMove: this.procesarMouseMove,
            onMouseUp: this.procesarMouseUp,
        }, this);

        this.scheduleUpdate();
        return true;
    },
    procesarMouseDown: function(event) {
        var instancia = event.getCurrentTarget();
        var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
        var posicion = cc.p(event.getLocationX(), event.getLocationY());
        gameLayer.orientacionPad = instancia.pad.pulsado(posicion);
        var pulsadoTurbo = instancia.botonTurbo.pulsado(posicion);
        if(pulsadoTurbo){
            if(gameLayer.caballero.cargasTurbo > 0){
                gameLayer.caballero.multVelocidad = 2;
                gameLayer.tiempoVelocidad = 5;
                gameLayer.caballero.cargasTurbo--;
                instancia.actualizarCargasTurbo();
            }
        }
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
        for (var i = 0; i < this.llaves.length; i++) {
            if (this.llaves[i].activada == 0) {
                this.llaves[i].activar();
                break;
            }
        }
    },reducirVida: function (){
         for (var i = 0; i < this.vidas.length; i++) {
            if (this.vidas[i].lleno == 1) {
                this.vidas[i].vaciar();
                break;
         }
      }
    },
    sumarVida: function(){
        for (var i = 0; i < this.vidas.length; i++) {
            if (this.vidas[i].lleno == 0) {
                this.vidas[i].rellenar();
                break;
        }
    }
  },
  actualizarCargasTurbo: function(){
        var gameLayer = this.getParent().getChildByTag(idCapaJuego);
        this.etiquetaCargas.setString("Cargas de turbo: " + gameLayer.caballero.cargasTurbo);
  }
});