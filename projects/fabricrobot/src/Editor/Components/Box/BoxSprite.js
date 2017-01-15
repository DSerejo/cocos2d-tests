var BoxSprite = cc.Node.extend({
    dn:null,
    defaultOptions:{
        fillColor:'#EFEFEF'
    },
    options:null,
    ctor:function(options){
        this._super()
        this.dn = new cc.DrawNode()
        this.options =_.extend({},this.defaultOptions,options);
        this.addChild(this.dn)
        this.draw(this.options);
    },
    init:function(){
        this.setAnchorPoint(cc.p(0.5,0.5))
        this.setRotation(-this.options.angle)
    },
    draw:function(options){
        var width = options.width,
            height = options.height,
            fillColor = options.fillColor;
        this.dn.setContentSize(width,height)
        this.setContentSize(width,height)
        var fillColorObj = cc.hexToColor(fillColor);
        fillColorObj.a = 125
        this.dn.drawRect(cc.p(0,0), cc.p(width,height), fillColorObj, 1, cc.color("#6D6D6D"));

    },

})