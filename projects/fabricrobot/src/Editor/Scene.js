
var EditorScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var nav = new Nav(),
            background = new cc.LayerColor(cc.color(255,255,255));
        cc.editorManager = new Manager();

        this.addChild(background);
        this.addChild(nav);
        this.addChild(cc.editorManager);
        nav.init()
        this.addTestSprite();
    },
    addTestSprite:function(){
        var sprite = new Rect(new cc.Size(50,50));
        sprite.setAnchorPoint(cc.p(0.5,0.5))
        sprite.setPosition(200,200);
        cc.editorManager.addChild(sprite)
    }

});
var Rect = ObjectBase.extend({
    ctor:function(size){
        this._super();
        this.setContentSize(size);
        this.draw()
    },
    draw:function(){
        var dn = new cc.DrawNode();
        this.addChild(dn);
        dn.drawRect(cc.p(0,0), cc.p(this._contentSize.width,this._contentSize.height), cc.color("#EFEFEF"), 3, cc.color("#6D6D6D"));
    }
})
