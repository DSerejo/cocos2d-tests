var Hero = cc.Class.extend({
    _className:"dgHero",
    space:null,
    sprite:null,
    shape:null,
    body:null,
    m:1,

    /** Constructor
     * @param {cp.Space} space
     * @param {cc.p} pos
     * @param {int} m optional
     */
    ctor:function (space, pos,m) {
        this.m = m || this.m;
        this.space = space;

        this.sprite = new cc.PhysicsSprite(s_dot);

        // init physics
        var contentSize = this.sprite.getContentSize()
        this.body = new cp.Body(this.m, cp.momentForBox(this.m, contentSize.width/2, contentSize.height/2));
        this.body.setPos(pos)
        this.space.addBody(this.body);
        //init shape
        this.shape = new cp.CircleShape(this.body, contentSize.width / 2, cp.v(0, 0));
        this.shape.setCollisionType(SpriteTag.hero);
        this.shape.setFriction(1);
        //Sensors only call collision callbacks, and never generate real collisions
        //this.shape.setSensor(true);

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
    }
});