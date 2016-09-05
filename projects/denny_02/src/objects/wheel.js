var Wheel = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    editFrame:null,
    m:1,
    r:10,
    _className:'dgWheel',

    /** Constructor
     * @param {cp.Space} space
     * @param {cc.p} pos
     * @param {int} r
     */
    ctor:function (space, pos,r) {
        this.r = r || this.r
        this.space = space;
        this.space = space;

        this.sprite = new cc.PhysicsSprite(s_wheel);
        this.setSize(cc.p(this.r*2,this.r*2));
        // init physics
        var contentSize = this.sprite.getContentSize()
        this.body = new cp.Body(this.m, cp.momentForCircle(this.m,this.r,this.r ,cp.vzero));
        this.body.setPos(pos)
        this.space.addBody(this.body);
        //init shape
        this.shape = new cp.CircleShape(this.body, this.r, cp.vzero);
        this.shape.setCollisionGroup(3);
        this.shape.setFriction(1);
        this.space.addShape(this.shape);
        this.sprite.setBody(this.body);
    },
    setSize:function(size){
        var contentSize = this.sprite.getContentSize();
        this.sprite.setScaleX(size.x/contentSize.width);
        this.sprite. setScaleY(size.y/contentSize.height);
    },

    removeFromParent:function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    getShape:function () {
        return this.shape;
    },
    getSprites:function(){
        var sprites = {
            wheel: this.sprite
        };
        if(this.editFrame){
            sprites.editFrame=this.editFrame
        }
        return sprites;
    },
    getObjects:function(){
        return {
            wheel: this
        }
    },
});