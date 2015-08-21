
var PlayScene = cc.Scene.extend({
    space:null,
    initPhysics:function() {
        this.space = new cp.Space();
        // Gravity
        this.space.gravity = cp.v(0, -350);


    },
    collisionRockBegin:function(arbiter, space){
        cc.log(arbiter);
        return true;
    },
    onEnter:function () {
        this._super();
        this.space = new cp.Space();
        this.initPhysics();
        this.addChild(new BackGroundLayer(this.space));
        var animationlayer = new AnimationLayer(this.space);
        this.addChild(animationlayer);
        animationlayer.init();
        this.scheduleUpdate();
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    }
});