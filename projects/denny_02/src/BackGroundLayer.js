var BackGroundLayer = cc.Layer.extend({

    space:null,
    addWallsAndGround: function () {
        var winSize= cc.director.getWinSize();
        var WALLS_WIDTH = 0;
        var WALLS_ELASTICITY = 1;
        var WALLS_FRICTION = 1;

        //leftWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(0, winSize.height), WALLS_WIDTH);
        //leftWall.setElasticity(WALLS_ELASTICITY);
        //leftWall.setFriction(WALLS_FRICTION);
        //this.space.addStaticShape(leftWall);
        //
        //rightWall = new cp.SegmentShape(this.space.staticBody, new cp.v(winSize.width, winSize.height), new cp.v(winSize.width, 0), WALLS_WIDTH);
        //rightWall.setElasticity(WALLS_ELASTICITY);
        //rightWall.setFriction(WALLS_FRICTION);
        //this.space.addStaticShape(rightWall);

        bottomWall = new cp.SegmentShape(this.space.staticBody, new cp.v(-4294967295, 0), new cp.v(4294967295, 0), WALLS_WIDTH);
        bottomWall.setElasticity(WALLS_ELASTICITY);
        bottomWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(bottomWall);

        //upperWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, winSize.height), new cp.v(winSize.width, winSize.height), WALLS_WIDTH);
        //upperWall.setElasticity(WALLS_ELASTICITY);
        //upperWall.setFriction(WALLS_FRICTION);
        //this.space.addStaticShape(upperWall);
    },
    ctor:function (space) {

        this._super();
        this.space = space
        var size = cc.director.getWinSize();

        var sprite1 = new cc.Sprite(s_background);
        var sprite2 = new cc.Sprite(s_background);
        var imageSize = sprite1.getContentSize();

        sprite1.setScale(
            size.width/imageSize.width,
            size.height/imageSize.height
        )
        sprite2.setScale(
            size.width/imageSize.width,
            size.height/imageSize.height
        )
        imageSize = sprite1.getContentSize();
        this.mapWidth=size.width;
        sprite1.setPosition(cc.p(size.width/2,size.height/2));
        sprite2.setPosition(cc.p(size.width*3/2,size.height/2));
        this.map1 = sprite1;
        this.map2 = sprite2;
        this.addChild(this.map1);
        this.addChild(this.map2);

        this.mapIndex = 0;
        this.addWallsAndGround();
        this.scheduleUpdate();
    },
    update:function(dt) {

        var animationLayer = this.getParent().getChildByTag(TagOfLayer.Animation);
        var eyeX = animationLayer.getEyeX();
        if(eyeX===false) return;
        var newMapIndex = parseInt(eyeX / this.mapWidth);
        if (this.mapIndex == newMapIndex) return false;
        if (0 == newMapIndex % 2) {
            this.map2.setPositionX(this.mapWidth * (newMapIndex + 1) + this.mapWidth/2 );
        }else{
            this.map1.setPositionX(this.mapWidth * (newMapIndex + 1)+ this.mapWidth/2);
        }
        this.mapIndex = newMapIndex;


    }


});