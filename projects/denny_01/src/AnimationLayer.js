var AnimationLayer = cc.Layer.extend({
    _debugNode:null,

    ctor:function(space){
        this._super();
        this.space=space;
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(this._debugNode, 10);
    },
    init:function (space) {

        this._super();

        var size = cc.director.getWinSize();
        this.hero = new Hero(space,cc.p(size.width / 3, 70));
        this.addChild(this.hero.sprite);
        for(var i = 0;i<5;i++){
            var position = cc.p(Math.random()*size.width,Math.random()*size.height);
            var speed = Math.floor(Math.random() * (300 - 100)) + 100;
            this.addChild((new Enemy(space,position,speed)).sprite);
        }


        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  this.hero.onKeyPressed,
            onKeyReleased:  this.hero.onKeyReleased
        },this);
    }

});

var PlayScene = cc.Scene.extend({
    space:null,

    onEnter:function () {
        this._super();
        this.space = new cp.Space();

        this.addChild(new BackGroundLayer(this.space));
        var animationlayer = new AnimationLayer(this.space);
        this.addChild(animationlayer);
        animationlayer.init(this.space);
        this.scheduleUpdate();
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    }
});
