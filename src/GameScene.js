var tipoLlave = 1;
var GameLayer = cc.Layer.extend({
    orientacion: 0,
    caballero: null,
    zombie: null,
    space: null,
    tecla: 0,
    orientacionPad: 0,
    mapa: null,
    mapaAncho: 0,
    mapaAlto: 0,
    pad: null,
    llaves: [],
    scene: null,
    ctor: function (scene) {
        this._super();
        this.scene = scene;
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);

        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.llaves_plist);
        cc.spriteFrameCache.addSpriteFrames(res.zombie_vertical_plist);
        cc.spriteFrameCache.addSpriteFrames(res.zombie_dcha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.zombie_izqda_plist);

        //cc.spriteFrameCache.addSpriteFrames(res.llave_gris_plist);

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

        this.zombie = new Zombie(this.space, cc.p(1, 250), this);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
        }, this);

        return true;

    },
    update: function (dt) {
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
            this.moverPersonajeIzquierda(this.caballero);
        }
        // derecha
        if (this.tecla === 68 || this.orientacionPad === PAD_DERECHA) {
            this.moverPersonajeDerecha(this.caballero);
        }
        // arriba
        if (this.tecla === 87 || this.orientacionPad === PAD_ARRIBA) {
            this.moverPersonajeArriba(this.caballero);
        }

        // abajo
        if (this.tecla === 83 || this.orientacionPad === PAD_ABAJO) {
            this.moverPersonajeAbajo(this.caballero);
        }

        // ninguna pulsada
        if (this.tecla === 0 && this.orientacionPad === 0) {
            this.caballero.detener();
        }

        if (this.zombie.mismaPosicionX()) {
            this.moverZombieEjeY();
            this.depurarCordenadas(this.zombie,this.caballero);
        }

        else if (this.zombie.mismaPosicionY()) {
            this.moverZombieEjeX();
            this.depurarCordenadas(this.zombie,this.caballero);
        }


        else if (this.orientacion++ % 2 == 0) {
            this.moverZombieEjeX();
            this.depurarCordenadas(this.zombie,this.caballero);
        }

        else {
            this.moverZombieEjeY();
            this.depurarCordenadas(this.zombie,this.caballero);
        }

    },
    cargarMapa: function () {
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
    teclaPulsada: function (keyCode, event) {
        var instancia = event.getCurrentTarget();
        instancia.tecla = keyCode;
    },
    moverPersonajeIzquierda: function (personaje) {
        if (personaje.body.p.x > 0) {
            personaje.moverIzquierda();
        } else {
            personaje.detener();
        }
    },
    moverPersonajeDerecha: function (personaje) {
        if (personaje.body.p.x < this.mapaAncho) {
            personaje.moverDerecha();
        } else {
            personaje.detener();
        }
    },
    moverPersonajeArriba: function (personaje) {
        if (personaje.body.p.y < this.mapaAlto) {
            personaje.moverArriba();
        } else {
            personaje.detener();
        }
    },
    moverPersonajeAbajo: function (personaje) {
        if (personaje.body.p.y > 0) {
            personaje.moverAbajo();
        } else {
            personaje.detener();
        }
    },
    moverZombieEjeY: function () {
        if (this.zombie.moviendoseAbajo()) {
            this.moverPersonajeAbajo(this.zombie);
        }
        else {
            this.moverPersonajeArriba(this.zombie);
        }
    },
    moverZombieEjeX: function () {

        if (this.zombie.moviendoseAIzquierda()) {
            this.moverPersonajeIzquierda(this.zombie);
        }
        else
            this.moverPersonajeDerecha(this.zombie);
    },
    depurarCordenadas: function (zom,cab) {
        console.log("ZOMBIE");
      console.log("X: "+zom.body.p.x);
      console.log("Y: "+zom.body.p.y);
        console.log("CABALLERO");
        console.log("X: "+cab.body.p.x);
        console.log("Y: "+cab.body.p.y);
    },
    teclaLevantada: function (keyCode, event) {
        var instancia = event.getCurrentTarget();

        if (instancia.tecla == keyCode) {
            instancia.tecla = 0;
        }
    }
});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer(this);
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer(this);
        this.addChild(controlesLayer, 0, idCapaControles);
    }
});