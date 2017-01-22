var Propulsor = Box.extend({
    fixedWidth:30,
    fixedHeight:10,
    countImpulse:0,
    isOn:false,
    ctor: function (world, options) {
        this._super(world,options)
        window.propulsor = this;
    },
    update:function(dt){
        this._super(dt)
        if(this.isOn){
            this.applyForce()
        }
    },

    createSpriteObject:function(){
        var options = this.addFixedOptions(this.options)
        this.sprite = new BoxSprite(options,this);
    },
    addBody:function(options){
        options = this.addFixedOptions(options)
        this.makeBody(options.width,options.height,options.type,options.density,options.restitution,options.friction,options.position,options.angle||0,this);
    },
    addFixedOptions:function(options){
        return _.extend({},options,{
            width:this.fixedWidth,
            height:this.fixedHeight,
            fillColor:'#fff844'
        })
    },
    onKeyPressed:function(key){
        switch (key){
            case 87:
                this.isOn = true
                break;
            default:
                break;

        }
    },
    onKeyReleased:function(key){
        switch (key){
            case 87:
                this.isOn = false
                break;
            default:
                break;
        }
    },
    applyForce:function(){
        var direction = cc.pRotateByAngle(cc.p(0,1),cc.p(0,0),this.body.GetAngle())
        this.body.ApplyForce(cc.pMult(direction,300),this.body.GetWorldCenter())
        this.countImpulse++
        console.log(this.countImpulse)
    }
})