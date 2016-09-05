var Dot = cc.Node.extend({

    _className:"dgDot",
    _running:true,
    sprite:null,
    body:null,
    shape:null,
    space:null,
    elasticity:0,
    startPosition:null,
    texture:s_dot,
    m:1,
    ctor: function(space,startPosition) {
        this._super();
        this.space=space;
        this.startPosition = startPosition;

        this._initSprite();

    },
    _initSprite:function(){
        this.sprite = new cc.PhysicsSprite(this.texture);
        var contentSize = this.sprite.getContentSize();
        this.body = new cp.Body(this.m, cp.momentForBox(this.m, contentSize.width, contentSize.height));
        this.body.p = this.startPosition;
        this.space.addBody(this.body);
        //init shape
        this.shape = new cp.CircleShape(this.body, contentSize.width / 2, cp.v(0, 0));
        this.shape.setElasticity(this.elasticity);
        this.space.addShape(this.shape);
        this.sprite.setBody(this.body);

    },


});
