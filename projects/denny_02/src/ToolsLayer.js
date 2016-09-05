var ToolsLayer = cc.Layer.extend({
    stop:null,
    play:null,
    space:null,

    ctor:function (space) {
        this._super();
        this.space = space;
        var winSize = cc.director.getWinSize();
        var menuStop = new cc.MenuItemSprite(
            new cc.Sprite(s_menu_stop),
            new cc.Sprite(s_menu_stop),
            this.onStop, this);
        var size = menuStop.getContentSize()
        menuStop.setScaleX(20/size.width);
        menuStop.setScaleY(20/size.height);
        var stop = new cc.Menu(menuStop);

        var centerPos = cc.p(20, winSize.height-20);
        cc.MenuItemFont.setFontSize(30);
        stop.setPosition(centerPos);
        this.stop = stop;
        this.addChild(stop);
    },
    onStop:function(){
        GameState.current=GameState.stopped
        this.space.gravity=cp.vzero;
        this.getParent().stop();
        this.removeFromParent(true);
    },



});