var ControlButton = cc.Node.extend({
    fillColor:"#42b9f4",
    ctor:function(){
        this._super()
        this.createButton()
    },
    createButton:function(){
        var dn  = new cc.DrawNode();
        dn.drawRect(cc.p(0,0), cc.p(20,20), cc.color(this.fillColor), 1, cc.color("#6D6D6D"));
        this.addChild(dn);
        this.setContentSize(20,20)
    },
    onActive:function(){
        console.log('Overrid me')
    },
    onInactive:function(){
        console.log('Overrid me')
    },
    transform:function(){
        console.log('Overrid me')
    }
})