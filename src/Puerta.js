var Puerta = cc.Class.extend({
    shape: null,
    name: null,
    ctor: function(shape, name) {
        this.shape = shape;
        this.name = name;
    }
});