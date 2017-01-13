var Wheel = CircleBody.extend({
    ctor:function(world,options){
        this._super(world);
        this.options = options;
        this.sprite = new CircleSprite(options,this);
        if(options.position)
            this.sprite.setPosition(options.position)
        this.sprite.setAnchorPoint(0.5,0.5)
        //window.circle = this.sprite
        this.addBody(options);
    },
    addBody:function(options){
        this.makeBody(options.radius,options.type,1,0,1,options.position,30);
    },
    setRealPositionDiff:function(){
        //this.realPosition = cc.pSub(this.sprite._position,this.sprite.getPosition());
        this.realAngle = this.sprite._rotationX - this.sprite.getRotation();
    },
    updateShape:function(){
        this.removeBody();
        this.addBody(this.options);
    },
    _setPosition: function(p){
        //this.sprite.setPosition(cc.pAdd(p,this.realPosition))
        this.sprite.setPosition(p)
    },
    _setRotation: function(a){
        this.sprite.setRotation(a + this.realAngle)
    }

})