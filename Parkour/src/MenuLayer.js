var MenuLayer = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
    },
    init:function(){
        //call super class's super function
        this._super();

        //2. get the singleton director

        //3. get the screen size of your game canvas
        var winsize = cc.director.getWinSize();
        //4. calculate the center point
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        //5. create a background image and set it's position at the center of the screen
        var spritebg = cc.Sprite.create(res.helloBG_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        //6.
        cc.MenuItemFont.setFontSize(60);

        //7.create a menu and assign onPlay event callback to it
        var menuItemPlay= cc.MenuItemSprite.create(
            cc.Sprite.create(res.start_n_png), // normal state image
            cc.Sprite.create(res.start_s_png), //select state image
            this.onPlay, this);
        var menu = cc.Menu.create(menuItemPlay);  //7. create the menu
        menu.setPosition(centerpos);
        this.addChild(menu);
    },

    onPlay : function(){
        cc.log("==onplay clicked");
        var director = cc.director;
        director.runScene(new PlayScene());
    }
});
var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }

});