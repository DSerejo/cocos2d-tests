var Rock = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    m:1,
    _className:'dgRock',

    /** Constructor
     * @param {cp.Space} space
     * @param {cc.p} pos
     * @param {int} width
     * @param {int} height
     */
    ctor:function (space, pos,width,height) {
        
        this.space = space;



        this.sprite = new cc.PhysicsSprite(s_block);
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScaleX(width/contentSize.width);
        this.sprite. setScaleY(height/contentSize.height);
        // init physics

        this.body = new cp.Body(this.m, cp.momentForPoly(this.m, [0,height,width,height,width,0,0,0],cp.v(-width/2,-height/2)));
        this.body.setPos(pos)
        this.space.addBody(this.body);

        this.shape = new cp.PolyShape(this.body,[0,height,width,height,width,0,0,0],cp.v(-width/2,-height/2));
        this.shape.setCollisionType(SpriteTag.rock);

        //Sensors only call collision callbacks, and never generate real collisions
        this.shape.setSensor(false);
        this.shape.setFriction(1);
        this.space.addShape(this.shape);
        this.sprite.setBody(this.body);
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
        return {
            block: this.sprite
        }
    },
    getObjects:function(){
        return {
            block: this
        }
    },
});