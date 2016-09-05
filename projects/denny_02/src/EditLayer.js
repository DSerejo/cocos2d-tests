var EditLayer = cc.Layer.extend({

    play:null,
    space:null,
    menus:{},
    normalOpacity:150,
    ctor:function (space) {
        this._super();
        this.space = space;
        var winSize = cc.director.getWinSize();
        var menus = this.menusToAdd();

        var initPosX = 20;
        for(var i in menus){
            var menu = menus[i];
            menu.pos=cc.p(initPosX,winSize.height-20);
            this.addTopMenu(menu);
            initPosX+=30;
        }

    },
    onPlay:function(){
        GameState.current=GameState.running
        this.space.gravity=cp.v(0, -350);
        this.getParent().play();
        this.removeFromParent(true);
    },
    reloadMenus:function(){
        for(var id in this.menus){
            var menu = this.menus[id];
            menu.setOpacity(this.normalOpacity);
            menu.setPosition(menu.originalPosition);
        }
    },
    addObject:function(type){
        this.reloadMenus();
        this.menus[type].setOpacity(255);
        var originalScale = this.menus[type].originalScale;
        this.menus[type].setPositionY(this.menus[type].originalPosition.y-5);
        GameState.adding = type;
        GameState.editLayer = this;
        GameState.changeState(GameState.adding);
    },
    addTopMenu:function(options){
        var centerPos = options.pos,
            png = options.png,
            func = options.func,
            id = options.id;

        var newMenu = new cc.MenuItemSprite(
            new cc.Sprite(png),
            new cc.Sprite(png),
            func, this);

        var size = newMenu.getContentSize()
        newMenu.setScaleX(20/size.width);
        newMenu.setScaleY(20/size.height);
        var menu = new cc.Menu(newMenu);
        cc.MenuItemFont.setFontSize(30);
        menu.setPosition(centerPos);
        menu.setOpacity(this.normalOpacity);
        this.menus[id]=menu;
        menu.originalPosition = centerPos;
        this.addChild(menu);
    },
    menusToAdd:function() {
    return [
        {
            id:'play',
            func:this.onPlay,
            png:s_menu_play
        },
        {
            id:'motor',
            func:function(){this.addObject('motor')},
            png:s_motor
        },
        {
            id:'wheel',
            func:function(){this.addObject('wheel')},
            png:s_wheel
        },
        {
            id:'rod',
            func:function(){this.addObject('rod')},
            png:s_joint
        },
        {
            id:'rock',
            func:function(){this.addObject('rock')},
            png:s_block
        },

    ]
},

});