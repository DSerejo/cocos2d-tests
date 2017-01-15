var PhysicsObject = cc.Class.extend({
    PMR : PMR,

    world:null,
    body:null,
    sprite:null,
    shape:null,
    state: null,
    stateTime: 0,
    runTime: 0,
    isAlive: true,

    ctor : function(world){
        this.world = world;
    },
    makeBody:function(){
        throw  "Overwrite me";
    },
    update: function (dt) {
        this.stateTime++;
        this.runTime++;
        if(this.sprite!=null&&this.isAlive){
            this._setPosition(this.getPosition());
            this._setRotation(-this.getRotation());
        }
    },
    _setPosition:function(p){
        this.sprite.setPosition(p)
    },
    _setRotation:function(a){
        this.sprite.setRotation(a)
    },
    getPosition:function () {
        var pos = this.body.GetPosition();
        return cc.p(pos.x * this.PMR, pos.y * this.PMR);
    },
    getX: function () {
        return this.getPosition().x;
    },
    getY: function () {
        return this.getPosition().y;
    },
    setPosition:function (p) {
        this.body.SetPosition(new b2Vec2(p.x / this.PMR, p.y / this.PMR));
        if(this.sprite!=null){
            this.sprite.setPosition(this.getPosition());
        }
    },
    getRotation:function () {
        return cc.radiansToDegrees(this.body.GetAngle());
    },
    setRotation:function (r) {
        this.body.SetAngle(cc.degreesToRadians(r));
        if(this.sprite!=null){
            //this.sprite.setRotation(this.getRotation());
        }
    },
    getBody:function () {
        return this.body;
    },
    removeFromParent:function () {
        this.world.RemoveBody(this.body);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },
    removeBody:function(){
        this.world.DestroyBody(this.body);
        this.shape = null;
    }
});