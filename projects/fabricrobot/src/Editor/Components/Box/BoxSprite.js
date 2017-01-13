var BoxSprite = cc.Node.extend({
    dn:null,
    defaultOptions:{
        fillColor:'#EFEFEF'
    },
    ctor:function(options){
        this._super()
        this.dn = new cc.DrawNode()
        this.addChild(this.dn)
        this.draw(_.extend({},this.defaultOptions,options));
    },
    init:function(){
        this.dn.setAnchorPoint(cc.p(0.5,0.5))
    },
    draw:function(options){
        var width = options.width,
            height = options.height,
            fillColor = options.fillColor;
        this.dn.setContentSize(width,height)
        this.setContentSize(width,height)
        this.dn.drawRect(cc.p(0,0), cc.p(width,height), cc.color(fillColor), 1, cc.color("#6D6D6D"));
    },

})