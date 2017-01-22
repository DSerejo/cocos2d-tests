var Box = BoxBody.extend({

    ctor:function(world,options){
        this._super(world);
        this.setOptions(options)
        this.recreateSprite()
    },
    createSpriteObject:function(){
        this.sprite = new BoxSprite(this.options,this);
    },
    addBody:function(options){
        this.makeBody(options.width,options.height,options.type,options.density,options.restitution,options.friction,options.position,options.angle||0,this);
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
            this.sprite.setRotation(a)
    },
    updateOptions:function(){
        this.options = _.extend({},this.options,{
            position:this.sprite.getPosition(),
            angle:-this.sprite.getRotation(),
            radius:this.sprite.getContentSize().width/2
        },this.sprite.getContentSize())
    },
    addX:function(dX){
        return Math.max(10,this.options.width+dX)
    }


})