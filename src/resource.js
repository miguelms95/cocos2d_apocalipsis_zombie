var res = {
    HelloWorld_png : "res/HelloWorld.png",
    boton_jugar_png : "res/boton_jugar.png",
    menu_titulo_png : "res/menu_titulo.png",
    tiles16_png: "res/tiles16.png",
    mapa1_tmx: "res/mapa1.tmx",
    caballero_png: "res/caballero.png",
    caballero_plist: "res/caballero.plist",
    llaves_plist: "res/llaves.plist",
    llaves_png: "res/llaves.png",
    pad_png: "res/pad.png",
    zombie_dcha_plist: "res/zombieDcha.plist",
    zombie_dcha_png: "res/zombieDcha.png",
    zombie_izqda_plist: "res/zombieIzqda.plist",
    zombie_izqda_png: "res/zombieIzqda.png",
    zombie_vertical_plist:"res/zombieVertical.plist",
    zombie_vertical_png:"res/zombieVertical.png",
    llave_gris_png: "res/llave_gris.png",
    llave_activada_png: "res/llave_activada.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}