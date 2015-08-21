var BackGroundLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        var winSize = cc.director.getWinSize();
        var menuStop = new cc.MenuItemSprite(
            new cc.Sprite(res.restart_n_png),
            new cc.Sprite(res.restart_s_png),
            this.onRestart, this);
        var menu = new cc.Menu(menuStop);

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        cc.MenuItemFont.setFontSize(30);

        menu.setPosition(centerPos);
        this.addChild(menu);
    }

});