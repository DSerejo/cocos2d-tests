var PhysicsObject = BaseObject.extend({
    PMR : PMR,

    world:null,
    body:null,
    sprite:null,
    shape:null,
    state: null,
    stateTime: 0,
    runTime: 0,
    isAlive: true,
    options:{
        density:1,
        restitution:0,
        friction:1
    },
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
        this.removeBody();
        this.sprite.removeFromParent();
        this.sprite = null;
    },
    removeBody:function(){
        if(this.body)
            this.world.DestroyBody(this.body);
        this.shape = null;
    },
    isSelected:function(){
        return this.sprite&&this.sprite.getChildByName('selected') !== null
    },
    select:function(){
        this.unSelect();
        var sprite  = new BoxSprite(_.extend({},this.sprite.getContentSize(),{fillColor:'#4286f4'}))
        this.sprite.addChild(sprite,1,'selected')
        this.selectedNode = sprite;
    },
    unSelect:function(){
        if(this.selectedNode){
            this.selectedNode.removeFromParent()
        }
        this.selectedNode = null
    },
    isTouched:function(p){
        var rect = new cc.Rect(0,0,this.sprite._contentSize.width, this.sprite._contentSize.height),
            localPoint = this.sprite.convertToNodeSpace(p)
        return cc.rectContainsPoint(rect,localPoint);
    },
    recreateSprite:function(){
        var oldSpriteConfig = this.removeSprite()
        this.createSpriteObject()
        if(this.options.position)
            this.sprite.setPosition(this.options.position)
        if(!this.options.delayedBodyCreation){
            this.addBody(this.options);
        }
        if(!this.options.delayedPosition){
            this.sprite.init();
        }
        if(oldSpriteConfig && oldSpriteConfig.parent){
            oldSpriteConfig.parent.addChild(this.sprite,oldSpriteConfig.zOrder);
            oldSpriteConfig.isSelected && this.select()
        }
    },
    removeSprite:function(){
        if(this.sprite){
            var parent = this.sprite.parent,
                zOrder = this.sprite.getLocalZOrder(),
                isSelected = this.isSelected()
            this.sprite.removeAllChildren()
            this.sprite.removeFromParent()
            this.sprite = null
            return {parent:parent,zOrder:zOrder,isSelected:isSelected}
        }
    },
    init:function(){
        this.sprite.init();
        this.addBody(this.options);
    },
    addX:function(){
        cc.error('Override me');
    }


});