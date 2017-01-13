var Box = BoxBody.extend({
    ctor:function(world,options){
        this._super(world);
        this.options = options;
        this.sprite = new BoxSprite(options,this);
        if(options.position)
            this.sprite.setPosition(options.position)
        this.sprite.init()
        this.addBody(options);
    },
    addBody:function(options){
        this.makeBody(options.width,options.height,options.type,1,0,1,options.position,options.angle||0);
    },
    updateBodyFromSprite:function(){
        if(!this.sprite)
            return;
        this.removeBody();
        var originalSize = cc.pFromSize(this.sprite.getContentSize()),
            scale = cc.p(this.sprite.getScaleX(),this.sprite.getScaleY())
        var box = cc.pCompMult(originalSize,scale);
        this.addBody({
            width:box.x,
            height:box.y,
            position:this.sprite.getPosition(),
            type:this.options.type,
            angle:-this.sprite.getRotation()
        })
    },

    _setPosition: function(p){
        if(this.sprite)
            this.sprite.setPosition(p)
    },
    _setRotation: function(a){
        if(this.sprite)
            this.sprite.setRotation(a + this.realAngle)
    }

})