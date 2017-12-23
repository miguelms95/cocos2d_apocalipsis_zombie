var llavesNecesarias = 10;
var tipoLlave = 1;
var GameLayer = cc.Layer.extend({
    caballero: null,
    space: null,
    tecla: 0,
    orientacionPad: 0,
    mapa: null,
    mapaAncho: 0,
    mapaAlto: 0,
    pad: null,
    llaves: [],
    scene: null,
    ctor: function(scene) {
        this._super();
        this.scene = scene;
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.llaves_plist);

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();
        /**
         this.depuracion = new cc.PhysicsDebugNode(this.space);
         this.addChild(this.depuracion, 10);
         **/

        this.cargarMapa();
        this.scheduleUpdate();

        this.caballero = new Caballero(this.space,
            cc.p(50, 150), this);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
        }, this);

        return true;

    },
    update: function(dt) {
        this.space.step(dt);

        var posicionXCamara = this.caballero.body.p.x - this.getContentSize().width / 2;
        var posicionYCamara = this.caballero.body.p.y - this.getContentSize().height / 2;

        if (posicionXCamara < 0) {
            posicionXCamara = 0;
        }
        if (posicionXCamara > this.mapaAncho - this.getContentSize().width) {
            posicionXCamara = this.mapaAncho - this.getContentSize().width;
        }

        if (posicionYCamara < 0) {
            posicionYCamara = 0;
        }
        if (posicionYCamara > this.mapaAlto - this.getContentSize().height) {
            posicionYCamara = this.mapaAlto - this.getContentSize().height;
        }

        this.setPosition(cc.p(-posicionXCamara, -posicionYCamara));

        // izquierda
        if (this.tecla === 65 || this.orientacionPad === PAD_IZQUIERDA) {
            this.moverCaballeroIzquierda();
        }
        // derecha
        if (this.tecla === 68 || this.orientacionPad === PAD_DERECHA) {
            this.moverCaballeroDerecha();
        }
        // arriba
        if (this.tecla === 87 || this.orientacionPad === PAD_ARRIBA) {
            this.moverCaballeroArriba();
        }

        // abajo
        if (this.tecla === 83 || this.orientacionPad === PAD_ABAJO) {
            this.moverCaballeroAbajo();
        }

        // ninguna pulsada
        if (this.tecla === 0 && this.orientacionPad === 0) {
            this.caballero.detener();
        }


    },
    cargarMapa: function() {
        this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
        // Añadirlo a la Layer
        this.addChild(this.mapa);
        // Ancho del mapa
        this.mapaAncho = this.mapa.getContentSize().width;
        this.mapaAlto = this.mapa.getContentSize().height;

        // Solicitar los objeto dentro de la capa Limites
        var grupoLimites = this.mapa.getObjectGroup("Limites");
        var limitesArray = grupoLimites.getObjects();

        // Los objetos de la capa limites
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < limitesArray.length; i++) {
            var limite = limitesArray[i];
            var puntos = limite.polylinePoints;
            for (var j = 0; j < puntos.length - 1; j++) {
                var bodyLimite = new cp.StaticBody();

                var shapeLimite = new cp.SegmentShape(bodyLimite,
                    cp.v(parseInt(limite.x) + parseInt(puntos[j].x),
                        parseInt(limite.y) - parseInt(puntos[j].y)),
                    cp.v(parseInt(limite.x) + parseInt(puntos[j + 1].x),
                        parseInt(limite.y) - parseInt(puntos[j + 1].y)),
                    1);

                shapeLimite.setFriction(1);
                shapeLimite.setElasticity(0);
                this.space.addStaticShape(shapeLimite);
            }
        }

        var grupoLlaves = this.mapa.getObjectGroup("llaves");
        var llavesArray = grupoLlaves.getObjects();

        for (var i = 0; i < llavesArray.length; i++) {
            var llave = new Llave(this,
                cc.p(llavesArray[i]["x"], llavesArray[i]["y"]),
                llavesArray[i]["width"], llavesArray[i]["height"]);
            this.llaves.push(llave);
        }

    },
    teclaPulsada: function(keyCode, event) {
        var instancia = event.getCurrentTarget();
        instancia.tecla = keyCode;
    },
    moverCaballeroIzquierda: function() {
        if (this.caballero.body.p.x > 0) {
            this.caballero.moverIzquierda();
        } else {
            this.caballero.detener();
        }
    },
    moverCaballeroDerecha: function() {
        if (this.caballero.body.p.x < this.mapaAncho) {
            this.caballero.moverDerecha();
        } else {
            this.caballero.detener();
        }
    },
    moverCaballeroArriba: function() {
        if (this.caballero.body.p.y < this.mapaAlto) {
            this.caballero.moverArriba();
        } else {
            this.caballero.detener();
        }
    },
    moverCaballeroAbajo: function() {
        if (this.caballero.body.p.y > 0) {
            this.caballero.moverAbajo();
        } else {
            this.caballero.detener();
        }
    },
    teclaLevantada: function(keyCode, event) {
        var instancia = event.getCurrentTarget();

        if (instancia.tecla == keyCode) {
            instancia.tecla = 0;
        }
    }
});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer(this);
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer(this);
        this.addChild(controlesLayer, 0, idCapaControles);
    }
});