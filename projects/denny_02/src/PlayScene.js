
var PlayScene = cc.Scene.extend({
    space:null,
    initPhysics:function() {
        this.space = new cp.Space();

    },
    collisionRockBegin:function(arbiter, space){
        cc.log(arbiter);
        return true;
    },
    onEnter:function () {
        this._super();
        this.space = new cp.Space();
        this.initPhysics();
        this.levelLayer = new cc.Layer();
        this.backGroundLayer = new BackGroundLayer(this.space)
        this.levelLayer.addChild(this.backGroundLayer);

        this.animationlayer = new AnimationLayer(this.space);
        this.levelLayer.addChild(this.animationlayer,0,TagOfLayer.Animation);
        this.animationlayer.init();
        this.addChild(this.levelLayer);
        this.addChild(new EditLayer(this.space));
        this.scheduleUpdate();
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);

        var currentPos = this.levelLayer.getPosition();

        var eyeX = this.animationlayer.getEyeX();
        if(!eyeX) return;
        this.levelLayer.setPosition(cc.p(-eyeX,0));
    },
    play:function(){
        this.addChild(new ToolsLayer(this.space));
    },
    stop:function(){
        this.addChild(new EditLayer(this.space));
    }
});