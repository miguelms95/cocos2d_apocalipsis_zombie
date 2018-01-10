var caballeroGlobal = null;

var llavesNecesarias = 10;
var vidasJugador = 5;
var tipoJugador = 1;
var tipoLlave = 2;
var tipoEnemigo = 3;
var tipoCajaVida = 4;
var tipoCajaTurbo = 5;
var tipoCajaAturdimiento = 6;
var tipoEntradaCasa = 7;
var tipoEntradaCueva = 8;
var tipoPuertaSalida = 9;
var tipoPersona = 10;
var tipoDisparo = 11;
var tipoLimite = 12;
var tipoPersona = 13;
var tipoBloqueDestruible = 14;
var tipoEntradaBunker = 15;
var tipoCajaTeletransporte = 16;

var capas = {};
var capaActual = null;

var GameLayer = cc.Layer.extend({
    orientacion: 0,
    caballero: null,
    zombies: [],
    space: null,
    tecla: 0,
    orientacionPad: 0,
    tiempoInvulnerable: 0,
    nombreMapa: null,
    mapa: null,
    mapaAncho: 0,
    mapaAlto: 0,
    pad: null,
    llaves: [],
    cajasVida: [],
    bloquesDestruibles: [],
    formasEliminar: [],
    cajasTurbo: [],
    cajasAturdimiento: [],
    tiempoVelocidad: null,
    tiempoAturdimiento: null,
    scene: null,
    circuloVision: null,
    entradasCasas: [],
    entradasCuevas: [],
    salidas: [],
    capaACambiar: null,
    activarCirculoVision: false,
    yaEntradoEnCapa: false,
    ultimaPosicionCaballero: null,
    personas: [],
    disparos: [],
    puntosTeletransporte: [],
    cajasTeletransporte: [],
    esCasaOCueva: false,
    entregadaLlaveZombies: false,
    hayZombies: false,

    ctor: function (scene, nombreMapa, circuloVisionActivado = false) {
        this._super();
        this.inicializar();
        this.scene = scene;
        var size = cc.winSize;
        this.tiempoVelocidad = -1;
        this.nombreMapa = nombreMapa;

        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.llaves_plist);
        cc.spriteFrameCache.addSpriteFrames(res.zombie_vertical_plist);
        cc.spriteFrameCache.addSpriteFrames(res.zombie_dcha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.zombie_izqda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caja_vida_plist);

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();

        this.space.addCollisionHandler(tipoJugador, tipoLlave,
            this.colisionJugadorConLlave.bind(this), null, this.colisionJugadorConLlave.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
            null, null, this.colisionJugadorConEnemigo.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoCajaVida,
            this.colisionJugadorConCajaVida.bind(this), null, this.colisionJugadorConCajaVida.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoCajaTurbo,
            this.colisionJugadorConCajaTurbo.bind(this), null, this.colisionJugadorConCajaTurbo.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoCajaAturdimiento,
            this.colisionJugadorConCajaAturdimiento.bind(this), null, this.colisionJugadorConCajaAturdimiento.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoEntradaCasa,
            null, null, this.colisionJugadorConEntradaCasa.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoEntradaCueva,
            null, null, this.colisionJugadorConEntradaCueva.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoPuertaSalida,
            null, null, this.colisionJugadorConSalida.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoPersona,
            null, null, this.colisionJugadorConPersona.bind(this), null);

        this.space.addCollisionHandler(tipoDisparo, tipoEnemigo,
            null, null, this.colisionDisparoConEnemigo.bind(this), null);

        this.space.addCollisionHandler(tipoDisparo, tipoPersona,
            null, null, this.colisionDisparoConPersona.bind(this), null);

        this.space.addCollisionHandler(tipoDisparo, tipoBloqueDestruible,
            null, null, this.colisionDisparoConBloqueDestruible.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoEntradaBunker,
            null, null, this.colisionJugadorConEntradaBunker.bind(this), null);

        this.space.addCollisionHandler(tipoJugador, tipoCajaTeletransporte,
            this.colisionJugadorConCajaTeletransporte.bind(this), null, this.colisionJugadorConCajaTeletransporte.bind(this), null);

        this.space.setDefaultCollisionHandler(
            null, null, this.colisionZombie.bind(this), null);

        /**
         this.depuracion = new cc.PhysicsDebugNode(this.space);
         this.addChild(this.depuracion, 10);
         **/

        this.scheduleUpdate();
        this.cargarMapa();

        if (caballeroGlobal == null) {
            caballeroGlobal = new Caballero(this.space,
                cc.p(100, 150), this);
        } else {
            caballeroGlobal.cambiarCapa(this.space, cc.p(100, 150), this);
        }
        this.caballero = caballeroGlobal;


        this.circuloVision = new CirculoVision(this);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
        }, this);

        if (circuloVisionActivado)
            this.circuloVision.activar();

        capaActual = this;

        return true;

    },
    inicializar: function () {
        this.orientacion =  0;
        this.zombies =  [];
        this.space =  null;
        this.tecla =  0;
        this.orientacionPad =  0;
        this.tiempoInvulnerable =  0;
        this.nombreMapa =  null;
        this.mapa = null;
        this.mapaAncho = 0;
        this.mapaAlto = 0;
        this.llaves = [];
        this.cajasVida = [];
        this.bloquesDestruibles = [];
        this.formasEliminar = [];
        this.cajasTurbo = [];
        this.cajasAturdimiento = [];
        this.tiempoVelocidad =  null;
        this.tiempoAturdimiento = null;
        this.entradasCasas = [];
        this.entradasCuevas = [];
        this.salidas = [];
        this.capaACambiar = null;
        this.activarCirculoVision = false;
        this.personas = [],
        this.disparos = [],
        this.puntosTeletransporte = [],
        this.cajasTeletransporte = [],
        this.esCasaOCueva = false, 
        this.entregadaLlaveZombies = false;
        this.hayZombies = false;
    },
    update: function (dt) {
        this.space.step(dt);

        if (this.tiempoInvulnerable > 0)
            this.tiempoInvulnerable = this.tiempoInvulnerable - dt;

        if (this.tiempoVelocidad > 0)
            this.tiempoVelocidad = this.tiempoVelocidad - dt;

        if (this.tiempoVelocidad <= 0 && this.tiempoVelocidad != -1) {
            this.caballero.multVelocidad = 1.0;
            this.tiempoVelocidad = -1;
        }

        if (this.tiempoAturdimiento > 0)
            this.tiempoAturdimiento = this.tiempoAturdimiento - dt;

        if (this.tiempoAturdimiento <= 0 && this.tiempoAturdimiento != -1) {
            for (var zombie of this.zombies) {
                zombie.multVelocidad = 1.0;
            }
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
            //this.capaACambiar = "mapa1_tmx";
        }

        if (this.tecla === 32) {
            this.caballero.disparar();
        }

        // ninguna pulsada
        if (this.tecla === 0 && this.orientacionPad === 0) {
            this.caballero.detener();
        }

        for (var zombie of this.zombies) {
            this.moverZombie(zombie);
        }

        // Eliminar formas:
        for (var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

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
            for (var i = 0; i < this.cajasTeletransporte.length; i++) {
                if (this.cajasTeletransporte[i].shape == shape) {
                    this.cajasTeletransporte[i].eliminar();
                    this.cajasTeletransporte.splice(i, 1);
                }
            }
        }
        this.formasEliminar = [];

        if (this.capaACambiar != null) {
            capas[this.nombreMapa] = this;
            if (capas[res[this.capaACambiar]]) {
                capas[res[this.capaACambiar]].caballero.mirarAbajo();
                capaActual = capas[res[this.capaACambiar]];
                if (this.activarCirculoVision)
                    capaActual.circuloVision.activar();
                else
                    capaActual.circuloVision.desactivar();
                this.getParent().addChild(capaActual, -1, idCapaJuego);
            } else {
                capaActual = new GameLayer(this.scene, res[this.capaACambiar], this.activarCirculoVision);
                this.getParent().addChild(capaActual, -1, idCapaJuego);
            }
            this.getParent().removeChild(this, false);
            this.capaACambiar = null;
        }

        if (capaActual === this) {
            if (this.caballero.layer !== this) {
                if (this.ultimaPosicionCaballero != null)
                    this.caballero.cambiarCapa(this.space, cc.p(this.ultimaPosicionCaballero.x, this.ultimaPosicionCaballero.y), this);
            } else {
                this.ultimaPosicionCaballero = cc.p(this.caballero.body.p.x, this.caballero.body.p.y);
            }
        }

        for (var i = 0; i < this.disparos.length; i++) {
            var disparo = this.disparos[i];
            var space = this.space;
            if (disparo.body.p.x > this.mapaAncho ||
                disparo.body.p.x < 0 ||
                disparo.body.p.y > this.mapaAncho ||
                disparo.body.p.y < 0) {
                    this.removeChild(disparo.sprite);
                    this.disparos.splice(i, 1);
                    space.removeBody(disparo.body);
                    space.removeShape(disparo.shape);
                }
        }

        var esCasa = this.esCasaOCueva && !this.circuloVision.activado;

        if (esCasa) {
            if (this.hayZombies && this.zombies.length === 0 && !this.entregadaLlaveZombies) {
                this.caballero.llaves++;
                var capaControles = this.getParent().getChildByTag(idCapaControles);
                capaControles.colorearLlave();
                this.entregadaLlaveZombies = true;
            }
        }
    },
    cargarMapa: function () {
        this.mapa = new cc.TMXTiledMap(this.nombreMapa);
        // Añadirlo a la Layer
        this.addChild(this.mapa);
        // Ancho del mapa

        this.mapaAncho = this.mapa.getContentSize().width;
        this.mapaAlto = this.mapa.getContentSize().height;

        // Solicitar los objeto dentro de la capa Limites
        var grupoLimites = this.mapa.getObjectGroup("Limites");
        if (grupoLimites != null) {
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
                    shapeLimite.setCollisionType(tipoLimite);
                    this.space.addStaticShape(shapeLimite);
                }
            }
        }

        var grupoLlaves = this.mapa.getObjectGroup("llaves");
        if (grupoLlaves != null) {
            var llavesArray = grupoLlaves.getObjects();

            for (var i = 0; i < llavesArray.length; i++) {
                var llave = new Llave(this,
                    cc.p(llavesArray[i]["x"], llavesArray[i]["y"]),
                    llavesArray[i]["width"], llavesArray[i]["height"]);
                this.llaves.push(llave);
            }
        }

        var grupoCajasTurbo = this.mapa.getObjectGroup("cajasturbo");
        if (grupoCajasTurbo != null) {
            var cajasTurboArray = grupoCajasTurbo.getObjects();

            for (var i = 0; i < cajasTurboArray.length; i++) {
                var cajaTurbo = new CajaTurbo(this,
                    cc.p(cajasTurboArray[i]["x"], cajasTurboArray[i]["y"]),
                    cajasTurboArray[i]["width"], cajasTurboArray[i]["height"]);
                this.cajasTurbo.push(cajaTurbo);
            }
        }

        var grupoCajasAturd = this.mapa.getObjectGroup("cajasaturdimiento");
        if (grupoCajasAturd != null) {
            var cajasAturdArray = grupoCajasAturd.getObjects();

            for (var i = 0; i < cajasAturdArray.length; i++) {
                var cajaAturd = new CajaAturdimiento(this,
                    cc.p(cajasAturdArray[i]["x"], cajasAturdArray[i]["y"]),
                    cajasAturdArray[i]["width"], cajasAturdArray[i]["height"]);
                this.cajasAturdimiento.push(cajaAturd);
            }
        }

        var grupoCajasVida = this.mapa.getObjectGroup("cajasvida");
        if (grupoCajasVida != null) {
            var cajaVidasArray = grupoCajasVida.getObjects();

            for (var i = 0; i < cajaVidasArray.length; i++) {
                var estaCajaVida = new CajaVida(this,
                    cc.p(cajaVidasArray[i]["x"], cajaVidasArray[i]["y"]),
                    cajaVidasArray[i]["width"], cajaVidasArray[i]["height"]);
                this.cajasVida.push(estaCajaVida);
            }
        }

        var grupoCajasTeletransporte = this.mapa.getObjectGroup("cajasteletransporte");
        if (grupoCajasTeletransporte != null) {
            var cajaTeletransporteArray = grupoCajasTeletransporte.getObjects();

            for (var i = 0; i < cajaTeletransporteArray.length; i++) {
                var cajaTeletransporte = new CajaTeletransporte(this,
                    cc.p(cajaTeletransporteArray[i]["x"], cajaTeletransporteArray[i]["y"]),
                    cajaTeletransporteArray[i]["width"], cajaTeletransporteArray[i]["height"]);
                this.cajasTeletransporte.push(cajaTeletransporte);
            }
        }

        var grupoPuntosTeletransporte = this.mapa.getObjectGroup("puntosteletransporte");
        if (grupoPuntosTeletransporte != null) {
            var puntoTeletransporteArray = grupoPuntosTeletransporte.getObjects();

            for (var i = 0; i < puntoTeletransporteArray.length; i++) {
                this.puntosTeletransporte.push({ 
                                        x: puntoTeletransporteArray[i]["x"],
                                        y: puntoTeletransporteArray[i]["y"]
                                                });
            }
        }

        var grupoBloquesDestruibles = this.mapa.getObjectGroup("bloques_destruibles");
        if (grupoBloquesDestruibles != null) {
            var bloquesDestruiblesArray = grupoBloquesDestruibles.getObjects();

            for (var i = 0; i < bloquesDestruiblesArray.length; i++) {
                var esteBloqueDestruible = new BloqueDestruible(this,
                    cc.p(bloquesDestruiblesArray[i]["x"], bloquesDestruiblesArray[i]["y"]),
                    bloquesDestruiblesArray[i]["width"], bloquesDestruiblesArray[i]["height"]);
                this.bloquesDestruibles.push(esteBloqueDestruible);
            }
        }

        var grupoZombies = this.mapa.getObjectGroup("zombies");
        if (grupoZombies != null) {
            this.hayZombies = true;
            var zombiesArray = grupoZombies.getObjects();
      
            for (var i = 0; i < zombiesArray.length; i++) {
                this.zombies.push(new Zombie(zombiesArray[i].name == "v", this.space, cc.p(zombiesArray[i]["x"], zombiesArray[i]["y"]), this));
            }
        }

        var grupoEntradasCasas = this.mapa.getObjectGroup("entradascasas");
        if (grupoEntradasCasas != null) {
            var entradasCasasArray = grupoEntradasCasas.getObjects();
            for (var i = 0; i < entradasCasasArray.length; i++) {
                var entradaCasa = entradasCasasArray[i];
                var puntos = entradaCasa.polylinePoints;
                for (var j = 0; j < puntos.length - 1; j++) {
                    var bodyLimite = new cp.StaticBody();

                    var shapeEntradaCasa = new cp.SegmentShape(bodyLimite,
                        cp.v(parseInt(entradaCasa.x) + parseInt(puntos[j].x),
                            parseInt(entradaCasa.y) - parseInt(puntos[j].y)),
                        cp.v(parseInt(entradaCasa.x) + parseInt(puntos[j + 1].x),
                            parseInt(entradaCasa.y) - parseInt(puntos[j + 1].y)),
                        1);

                    shapeEntradaCasa.setFriction(1);
                    shapeEntradaCasa.setElasticity(0);
                    shapeEntradaCasa.setCollisionType(tipoEntradaCasa);
                    this.space.addStaticShape(shapeEntradaCasa);
                    this.entradasCasas.push(new Puerta(shapeEntradaCasa, entradaCasa.name));
                }
            }
        }

        var grupoEntradasCuevas = this.mapa.getObjectGroup("entradascuevas");
        if (grupoEntradasCuevas != null) {
            var entradasCuevasArray = grupoEntradasCuevas.getObjects();
            for (var i = 0; i < entradasCuevasArray.length; i++) {
                var entradaCueva = entradasCuevasArray[i];
                var puntos = entradaCueva.polylinePoints;
                for (var j = 0; j < puntos.length - 1; j++) {
                    var bodyLimite = new cp.StaticBody();

                    var shapeEntradaCueva = new cp.SegmentShape(bodyLimite,
                        cp.v(parseInt(entradaCueva.x) + parseInt(puntos[j].x),
                            parseInt(entradaCueva.y) - parseInt(puntos[j].y)),
                        cp.v(parseInt(entradaCueva.x) + parseInt(puntos[j + 1].x),
                            parseInt(entradaCueva.y) - parseInt(puntos[j + 1].y)),
                        1);

                    shapeEntradaCueva.setFriction(1);
                    shapeEntradaCueva.setElasticity(0);
                    shapeEntradaCueva.setCollisionType(tipoEntradaCueva);
                    this.space.addStaticShape(shapeEntradaCueva);
                    this.entradasCuevas.push(new Puerta(shapeEntradaCueva, entradaCueva.name));
                }
            }
        }

        var grupoPuertasSalidas = this.mapa.getObjectGroup("puertassalidas");
        if (grupoPuertasSalidas != null) {
            this.esCasaOCueva = true;
            var puertasSalidasArray = grupoPuertasSalidas.getObjects();
            for (var i = 0; i < puertasSalidasArray.length; i++) {
                var puertasalida = puertasSalidasArray[i];
                var puntos = puertasalida.polylinePoints;
                for (var j = 0; j < puntos.length - 1; j++) {
                    var bodyLimite = new cp.StaticBody();

                    var shapePuertaSalida = new cp.SegmentShape(bodyLimite,
                        cp.v(parseInt(puertasalida.x) + parseInt(puntos[j].x),
                            parseInt(puertasalida.y) - parseInt(puntos[j].y)),
                        cp.v(parseInt(puertasalida.x) + parseInt(puntos[j + 1].x),
                            parseInt(puertasalida.y) - parseInt(puntos[j + 1].y)),
                        1);

                    shapePuertaSalida.setFriction(1);
                    shapePuertaSalida.setElasticity(0);
                    shapePuertaSalida.setCollisionType(tipoPuertaSalida);
                    this.space.addStaticShape(shapePuertaSalida);
                    this.salidas.push(new Puerta(shapePuertaSalida, puertasalida.name));
                }
            }
        }

        var grupoPersonas = this.mapa.getObjectGroup("personas");
        if (grupoPersonas != null) {
            var personasArray = grupoPersonas.getObjects();
            for (var i = 0; i < personasArray.length; i++) {
                var persona = personasArray[i];
                this.personas.push(new Persona(this, this.space, cc.p(persona["x"], persona["y"]), persona["name"]));
            }
        }

        var grupoEntradaBunker = this.mapa.getObjectGroup("entradabunker");
        if (grupoEntradaBunker != null) {
            var entradaBunkerArray = grupoEntradaBunker.getObjects();
            for (var i = 0; i < entradaBunkerArray.length; i++) {
                var entradaBunker = entradaBunkerArray[i];
                var puntos = entradaBunker.polylinePoints;
                for (var j = 0; j < puntos.length - 1; j++) {
                    var bodyEntradaBunker = new cp.StaticBody();

                    var shapeEntradaBunker = new cp.SegmentShape(bodyEntradaBunker,
                        cp.v(parseInt(entradaBunker.x) + parseInt(puntos[j].x),
                            parseInt(entradaBunker.y) - parseInt(puntos[j].y)),
                        cp.v(parseInt(entradaBunker.x) + parseInt(puntos[j + 1].x),
                            parseInt(entradaBunker.y) - parseInt(puntos[j + 1].y)),
                        1);

                    shapeEntradaBunker.setFriction(1);
                    shapeEntradaBunker.setElasticity(0);
                    shapeEntradaBunker.setCollisionType(tipoEntradaBunker);
                    this.space.addStaticShape(shapeEntradaBunker);
                }
            }
        }
    },
    teclaPulsada: function (keyCode, event) {
        var instancia = event.getCurrentTarget();
        instancia.tecla = keyCode;

        var controlesLayer = instancia.getParent().getChildByTag(idCapaControles);

        if (controlesLayer.mostrandoDialogo && keyCode != 87) { // letra T
            cc.director.resume();
            instancia.caballero.moverAbajo();
            controlesLayer.ocultarDialogo();
        }
    },
    moverPersonajeIzquierda: function (personaje) {
        if (personaje.body.p.x > personaje.sprite.getContentSize().width / 2) {
            personaje.moverIzquierda();
        } else {
            personaje.detener();
        }
    },
    moverPersonajeDerecha: function (personaje) {
        if (personaje.body.p.x < this.mapaAncho - personaje.sprite.getContentSize().width / 2) {
            personaje.moverDerecha();
        } else {
            personaje.detener();
        }
    },
    moverPersonajeArriba: function (personaje) {
        if (personaje.body.p.y < this.mapaAlto - personaje.sprite.getContentSize().height / 2) {
            personaje.moverArriba();
        } else {
            personaje.detener();
        }
    },
    moverPersonajeAbajo: function (personaje) {
        if (personaje.body.p.y > personaje.sprite.getContentSize().height / 2) {
            personaje.moverAbajo();
        } else {
            personaje.detener();
        }
    },
    moverZombie: function (zombie) {
        if (zombie.moverVertical)
            this.moverZombieEjeY(zombie);
        else
            this.moverZombieEjeX(zombie);
    },
    moverZombieEjeY: function (zombie) {
        if (zombie.body.vy >= 0)
            this.moverPersonajeArriba(zombie);
        else
            this.moverPersonajeAbajo(zombie);
    },
    moverZombieEjeX: function (zombie) {
        if (zombie.body.vx >= 0)
            this.moverPersonajeDerecha(zombie);
        else
            this.moverPersonajeIzquierda(zombie);
    },
    depurarCordenadas: function (zom, cab) {
        if (true) return;

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
    colisionJugadorConEnemigo: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        if (this.tiempoInvulnerable <= 0) {
            this.caballero.vidas--;
            this.tiempoInvulnerable = 2;
            var capaControles = this.getParent().getChildByTag(idCapaControles);
            capaControles.reducirVida();

            var shapeEnemigo = shapes[1];

            for (var zombie of this.zombies) {
                if (zombie.shape === shapeEnemigo) {
                    zombie.girar();
                }
            }

            if (this.caballero.vidas <= 0) {
                this.getParent().addChild(new GameOverLayer());
            }
        }
    },
    colisionJugadorConCajaVida: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        if (this.caballero.vidas < vidasJugador) {
            this.caballero.vidas++;
            var capaControles = this.getParent().getChildByTag(idCapaControles);
            capaControles.sumarVida();
        }
        this.formasEliminar.push(shapes[1]);
    },
    colisionJugadorConCajaTurbo: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.caballero.cargasTurbo++;
        var capaControles = this.getParent().getChildByTag(idCapaControles);
        capaControles.actualizarCargasTurbo();
        this.formasEliminar.push(shapes[1]);
    },
    colisionJugadorConCajaAturdimiento: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        for (var zombie of this.zombies) {
            zombie.multVelocidad = 0.5;
        }
        this.tiempoAturdimiento = 3;
        this.formasEliminar.push(shapes[1]);
    },
    colisionJugadorConCajaTeletransporte: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        var posTeletransporte = parseInt(Math.random() * this.puntosTeletransporte.length);
        var puntoTeletransporte = this.puntosTeletransporte[posTeletransporte];

        this.caballero.body.p.x = puntoTeletransporte.x;
        this.caballero.body.p.y = puntoTeletransporte.y;
        this.formasEliminar.push(shapes[1]);
    },
    colisionJugadorConEntradaCasa: function (arbiter, space) {
        this.entrarEnCasaCueva(arbiter, space, this.entradasCasas, false);
    },
    colisionJugadorConEntradaCueva: function (arbiter, space) {
        this.entrarEnCasaCueva(arbiter, space, this.entradasCuevas, true);
    },
    colisionJugadorConSalida: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var shapeEntradaCasa = shapes[1];
        var nombreMapaCasa = this.salidas.filter(ec => ec.shape === shapeEntradaCasa)[0].name;

        if (!this.caballero.mirandoHaciaArriba() && !this.caballero.quieto()) {
            this.capaACambiar = nombreMapaCasa + "_tmx";
            this.activarCirculoVision = false;
            this.yaEntradoEnCapa = true;

            capas[res[this.capaACambiar]].caballero.moverAbajo();
            capas[res[this.capaACambiar]].detenerCaballero = true;
            capas[res[this.capaACambiar]].tecla = 0;
            capas[res[this.capaACambiar]].orientacionPad = 0;

            // capas[res[this.capaACambiar]].yaEntradoEnCapa = false;
        }
    },
    colisionJugadorConPersona: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var shapeJugador = shapes[0];
        var shapePersona = shapes[1];

        var persona = this.personas.filter(p => p.shape === shapePersona)[0];

        var puntoMedioJugador = this.caballero.body.p.x + this.caballero.ancho / 2;
        var puntoMedioPersona = persona.body.p.x + persona.ancho / 2;

        if (shapeJugador.body.p.y <= shapePersona.body.p.y &&
            Math.abs(puntoMedioJugador - puntoMedioPersona) <= 14) {
            if (this.caballero.mirandoHaciaArriba()) {
                var controlesLayer = this.getParent().getChildByTag(idCapaControles);
                var personaNameParts = persona.frase.split(";");
                var frasePersona = personaNameParts[1];
                var personaDaLlave = (personaNameParts[0] == 'true');

                if (persona.yahablado && personaDaLlave) {
                    frasePersona = personaNameParts[2];
                    personaDaLlave = false;
                } else {
                    persona.yahablado = true;
                }

                controlesLayer.mostrarDialogo(frasePersona, personaDaLlave);
            }
        }
    },
    colisionJugadorConEntradaBunker: function (arbiter, space) {
        if (this.caballero.llaves === llavesNecesarias) {
            this.getParent().addChild(new GameOverLayer());
        }
    },
    entrarEnCasaCueva: function (arbiter, space, entradasArray, activarCirculoVision) {
        if (this.caballero.mirandoHaciaArriba()) {
            var shapes = arbiter.getShapes();
            var shapeEntradaCasa = shapes[1];
            var nombreMapaCasa = entradasArray.filter(ec => ec.shape === shapeEntradaCasa)[0].name;

            if (this.caballero.mirandoHaciaArriba()) {
                this.capaACambiar = nombreMapaCasa + "_tmx";
                this.activarCirculoVision = activarCirculoVision;
                this.yaEntradoEnCapa = true;

                if (capas.hasOwnProperty(res[this.capaACambiar])) {
                    capas[res[this.capaACambiar]].caballero.moverArriba();
                    capas[res[this.capaACambiar]].detenerCaballero = true;
                    capas[res[this.capaACambiar]].tecla = 0;
                    capas[res[this.capaACambiar]].orientacionPad = 0;
                }
            }
        }
    },
    colisionZombie: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        if (shapes[0].collision_type === tipoEnemigo) {
            if (shapes[1].collision_type === tipoLlave) {
                alert("hola");
                return false;
                //arbiter.ignore();
            }
            for (var zombie of this.zombies) {
                if (zombie.shape === shapes[0]) {
                    //zombie.girar();
                    break;
                }
            }
        }

        if (shapes[0].collision_type === tipoDisparo &&
            shapes[1].collision_type !== tipoEnemigo &&
            shapes[1].collision_type !== tipoJugador) {
            var shapeDisparo = shapes[0];
            var disparo = null;
            var posDisparo = -1;

            for (var i = 0; i < this.disparos.length; i++) {
                if (this.disparos[i].shape === shapeDisparo) {
                    disparo = this.disparos[i];
                    posDisparo = i;
                    break;
                }
            }

            if (disparo != null) {
                this.removeChild(disparo.sprite);
                this.disparos.splice(posDisparo, 1);

                space.addPostStepCallback(function () {
                    space.removeBody(disparo.body);
                    space.removeShape(shapeDisparo);
                });
            }
        }
    },
    colisionDisparoConPersona: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var shapeDisparo = shapes[0];

        var disparo = null;
        var posDisparo = -1;

        for (var i = 0; i < this.disparos.length; i++) {
            if (this.disparos[i].shape === shapeDisparo) {
                disparo = this.disparos[i];
                posDisparo = i;
                break;
            }
        }

        if (disparo != null) {
            this.removeChild(disparo.sprite);
            this.disparos.splice(posDisparo, 1);

            space.addPostStepCallback(function () {
                space.removeBody(disparo.body);
                space.removeShape(shapeDisparo);
            });
        }
    },
    colisionDisparoConEnemigo: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var shapeDisparo = shapes[0];
        var shapeEnemigo = shapes[1];

        var zombie = null;
        var posZombie = -1;

        for (var i = 0; i < this.zombies.length; i++) {
            if (this.zombies[i].shape === shapeEnemigo) {
                zombie = this.zombies[i];
                posZombie = i;
                break;
            }
        }

        if (zombie != null) {
            this.removeChild(zombie.sprite);
            this.zombies.splice(posZombie, 1);

            space.addPostStepCallback(function () {
                space.removeBody(zombie.body);
                space.removeShape(shapeEnemigo);
            });
        }

        var disparo = null;
        var posDisparo = -1;

        for (var i = 0; i < this.disparos.length; i++) {
            if (this.disparos[i].shape === shapeDisparo) {
                disparo = this.disparos[i];
                posDisparo = i;
                break;
            }
        }

        if (disparo != null) {
            this.removeChild(disparo.sprite);
            this.disparos.splice(posDisparo, 1);

            space.addPostStepCallback(function () {
                space.removeBody(disparo.body);
                space.removeShape(shapeDisparo);
            });
        }
    },
    colisionDisparoConBloqueDestruible: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var shapeDisparo = shapes[0];
        var shapeBloqueDestruible = shapes[1];

        var posBloqueDestruible = -1;

        for (var i = 0; i < this.bloquesDestruibles.length; i++) {
            if (this.bloquesDestruibles[i].shape === shapeBloqueDestruible) {
                posBloqueDestruible = i;
                break;
            }
        }

        if (posBloqueDestruible != -1) {
            var bloqueDestruible = this.bloquesDestruibles[posBloqueDestruible];
            this.removeChild(bloqueDestruible.sprite);

            space.addPostStepCallback(function() {
                space.removeShape(bloqueDestruible.shape);
            });

            this.bloquesDestruibles.splice(posBloqueDestruible, 1);
        }

        var disparo = null;
        var posDisparo = -1;

        for (var i = 0; i < this.disparos.length; i++) {
            if (this.disparos[i].shape === shapeDisparo) {
                disparo = this.disparos[i];
                posDisparo = i;
                break;
            }
        }

        if (disparo != null) {
            this.removeChild(disparo.sprite);
            this.disparos.splice(posDisparo, 1);

            space.addPostStepCallback(function () {
                space.removeBody(disparo.body);
                space.removeShape(shapeDisparo);
            });
        }
    }
});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer(this, res.mapa2_tmx);
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer(this);
        this.addChild(controlesLayer, 0, idCapaControles);
    }
});