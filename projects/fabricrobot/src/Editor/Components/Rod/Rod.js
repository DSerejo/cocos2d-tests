var Rod = BoxBody.extend({
    ctor:function(world,options){
        this._super(world);
        this.sprite = new RodSprite(options,this);
        this.sprite.setPosition(options.position);
        this.addBody(options);
    },
    addBody:function(options){
        var size = this.sprite.bar.getContentSize(),
            angle = this.sprite.getRotation(),
            position = this.sprite.getPosition()

        this.makeBody(size.width,size.height,options.type,4,0,2,position,-angle);
    },
    updateShape:function(){
        this.removeBody();
        this.addBody();
    },

})