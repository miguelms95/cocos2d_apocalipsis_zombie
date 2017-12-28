var llavesNecesarias = 5;
var vidasJugador = 5;
var tipoJugador = 1;
var tipoLlave = 2;
var tipoEnemigo = 3;
var tipoCajaVida = 4;
var tipoCajaTurbo = 5;
var tipoCajaAturdimiento = 6;
var GameLayer = cc.Layer.extend({
    orientacion: 0,
    caballero: null,
    zombie: null,
    space: null,
    tecla: 0,
    orientacionPad: 0,
    tiempoInvulnerable:0,
    mapa: null,
    mapaAncho: 0,
    mapaAlto: 0,
    pad: null,
    llaves: [],
    cajasVida: [],
    formasEliminar: [],
    cajasTurbo:[],
    cajasAturdimiento:[],
    tiempoVelocidad: null,
    tiempoAturdimiento:null,
    scene: null,
    circuloVision:null,
    ctor: function (scene) {
        this._super();
        this.scene = scene;
        var size = cc.winSize;
        this.tiempoVelocidad = -1;

        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.llaves_plist); 
        cc.spriteFrameCache.addSpriteFrames(res.zombie_vertical_plist);
        cc.spriteFrameCache.addSpriteFrames(res.zombie_dcha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.zombie_izqda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caja_vida_plist);

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();

        this.space.addCollisionHandler(tipoJugador, tipoLlave,
            null, null, this.colisionJugadorConLlave.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
            null, null, this.colisionJugadorConEnemigo.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoCajaVida,
            null, null, this.colisionJugadorConCajaVida.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoCajaTurbo,
            null, null, this.colisionJugadorConCajaTurbo.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoCajaAturdimiento,
            null, null, this.colisionJugadorConCajaAturdimiento.bind(this), null);

        /**
         this.depuracion = new cc.PhysicsDebugNode(this.space);
         this.addChild(this.depuracion, 10);
         **/

        this.scheduleUpdate();
        this.cargarMapa();
        this.caballero = new Caballero(this.space,
            cc.p(100, 150), this);

        this.zombie = new Zombie(this.space, cc.p(150, 250), this);
        this.circuloVision = new CirculoVision(this);
  
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
        }, this);

        // FELIZ 28 DE DICIEMBRE SANTOS INOCENTES

        return true;

    },
    update: function (dt) {
        this.space.step(dt);

        if(this.tiempoInvulnerable > 0)
            this.tiempoInvulnerable = this.tiempoInvulnerable - dt;

        if(this.tiempoVelocidad > 0)
            this.tiempoVelocidad = this.tiempoVelocidad -dt;

        if(this.tiempoVelocidad <= 0 && this.tiempoVelocidad != -1){
            this.caballero.multVelocidad = 1.0;
            this.tiempoVelocidad = -1;
        }

        if(this.tiempoAturdimiento > 0)
            this.tiempoAturdimiento = this.tiempoAturdimiento -dt;

        if(this.tiempoAturdimiento <= 0 && this.tiempoAturdimiento != -1){
            this.zombie.multVelocidad = 1.0;
            this.tiempoAturdimiento = -1;
        }

        var posicionXCamara = this.caballero.body.p.x - this.getContentSize().width / 2;
        var posicionYCamara = this.caballero.body.p.y - this.getContentSize().height / 2;

        this.circuloVision.mover(this.caballero);

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
        // Eliminar formas:
        for (var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            if (this.zombie.mismaPosicionX()) {
                this.moverZombieEjeY();
                this.depurarCordenadas(this.zombie, this.caballero);
            } else if (this.zombie.mismaPosicionY()) {
                this.moverZombieEjeX();
                this.depurarCordenadas(this.zombie, this.caballero);
            } else if (this.orientacion++ % 2 == 0) {
                this.moverZombieEjeX();
                this.depurarCordenadas(this.zombie, this.caballero);
            } else {
                this.moverZombieEjeY();
                this.depurarCordenadas(this.zombie, this.caballero);
            }

            for (var i = 0; i < this.llaves.length; i++) {
                if (this.llaves[i].shape == shape) {
                    this.llaves[i].eliminar();
                    this.llaves.splice(i, 1);
                }
             }

            for (var i = 0; i < this.cajasTurbo.length; i++) {
                if (this.cajasTurbo[i].shape == shape) {
                    this.cajasTurbo[i].eliminar();
                    this.cajasTurbo.splice(i, 1);
                }
            }
            for (var i = 0; i < this.cajasVida.length; i++) {
                if (this.cajasVida[i].shape == shape) {
                    this.cajasVida[i].eliminar();
                    this.cajasVida.splice(i, 1);
                }
            }
            for (var i = 0; i < this.cajasAturdimiento.length; i++) {
               if (this.cajasAturdimiento[i].shape == shape) {
                   this.cajasAturdimiento[i].eliminar();
                   this.cajasAturdimiento.splice(i, 1);
               }
           }
        }
        this.formasEliminar = [];
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

        var grupoCajasTurbo = this.mapa.getObjectGroup("cajasturbo");
        var cajasTurboArray = grupoCajasTurbo.getObjects();

        for (var i = 0; i < cajasTurboArray.length; i++) {
            var cajaTurbo = new CajaTurbo(this,
                cc.p(cajasTurboArray[i]["x"], cajasTurboArray[i]["y"]),
                cajasTurboArray[i]["width"], cajasTurboArray[i]["height"]);
            this.cajasTurbo.push(cajaTurbo);
        }

       var grupoCajasAturd = this.mapa.getObjectGroup("cajasaturdimiento");
       var cajasAturdArray = grupoCajasAturd.getObjects();

        for (var i = 0; i < cajasAturdArray.length; i++) {
            var cajaAturd = new CajaAturdimiento(this,
                cc.p(cajasAturdArray[i]["x"], cajasAturdArray[i]["y"]),
                cajasAturdArray[i]["width"], cajasAturdArray[i]["height"]);
            this.cajasAturdimiento.push(cajaAturd);
        }

        var grupoCajasVida = this.mapa.getObjectGroup("cajasvida");
        var cajaVidasArray = grupoCajasVida.getObjects();

        for (var i = 0; i < cajaVidasArray.length; i++) {
            var estaCajaVida = new CajaVida(this,
                cc.p(cajaVidasArray[i]["x"], cajaVidasArray[i]["y"]),
                cajaVidasArray[i]["width"], cajaVidasArray[i]["height"]);
            this.cajasVida.push(estaCajaVida);
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
        } else {
            this.moverPersonajeArriba(this.zombie);
        }
    },
    moverZombieEjeX: function () {

        if (this.zombie.moviendoseAIzquierda()) {
            this.moverPersonajeIzquierda(this.zombie);
        } else
            this.moverPersonajeDerecha(this.zombie);
    },
    depurarCordenadas: function (zom, cab) {
        console.log("ZOMBIE");
        console.log("X: " + zom.body.p.x);
        console.log("Y: " + zom.body.p.y);
        console.log("CABALLERO");
        console.log("X: " + cab.body.p.x);
        console.log("Y: " + cab.body.p.y);
    },
    teclaLevantada: function (keyCode, event) {
        var instancia = event.getCurrentTarget();

        if (instancia.tecla == keyCode) {
            instancia.tecla = 0;
        }
    },
    colisionJugadorConLlave: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador y shapes[1] es la llave
        this.caballero.llaves++;
        var capaControles = this.getParent().getChildByTag(idCapaControles);
        capaControles.colorearLlave();
        this.formasEliminar.push(shapes[1]);
    },
    colisionJugadorConEnemigo:function(arbiter,space) {
        var shapes = arbiter.getShapes();
        if(this.tiempoInvulnerable <= 0){
            this.caballero.vidas--;
            this.tiempoInvulnerable = 2;
            var capaControles = this.getParent().getChildByTag(idCapaControles);
            capaControles.reducirVida();
         }
    },
    colisionJugadorConCajaVida:function (arbiter,space){
        var shapes = arbiter.getShapes();
        if(this.caballero.vidas < vidasJugador){
           this.caballero.vidas++;
            var capaControles = this.getParent().getChildByTag(idCapaControles);
            capaControles.sumarVida();
        }
        this.formasEliminar.push(shapes[1]);
    },
    colisionJugadorConCajaTurbo: function(arbiter, space){
        var shapes = arbiter.getShapes();
        this.caballero.cargasTurbo++;
        var capaControles = this.getParent().getChildByTag(idCapaControles);
        capaControles.actualizarCargasTurbo();
        this.formasEliminar.push(shapes[1]);
    },
    colisionJugadorConCajaAturdimiento: function(arbiter,space){
        var shapes = arbiter.getShapes();
        this.zombie.multVelocidad = 0.5;
        this.tiempoAturdimiento = 3;
        this.formasEliminar.push(shapes[1]);
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