var BackGroundLayer = cc.Layer.extend({

    space:null,
    addWallsAndGround: function () {
        var winSize= cc.director.getWinSize();
        var WALLS_WIDTH = 5;
        var WALLS_ELASTICITY = 1;
        var WALLS_FRICTION = 0;

        leftWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(0, winSize.height), WALLS_WIDTH);
        leftWall.setElasticity(WALLS_ELASTICITY);
        leftWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(leftWall);

        rightWall = new cp.SegmentShape(this.space.staticBody, new cp.v(winSize.width, winSize.height), new cp.v(winSize.width, 0), WALLS_WIDTH);
        rightWall.setElasticity(WALLS_ELASTICITY);
        rightWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(rightWall);

        bottomWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(winSize.width, 0), WALLS_WIDTH);
        bottomWall.setElasticity(WALLS_ELASTICITY);
        bottomWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(bottomWall);

        upperWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, winSize.height), new cp.v(winSize.width, winSize.height), WALLS_WIDTH);
        upperWall.setElasticity(WALLS_ELASTICITY);
        upperWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(upperWall);
    },
    ctor:function (space) {

        this._super();
        this.space = space
        var backgroundLayer = new cc.LayerColor();
        backgroundLayer.setColor(new cc.Color(255, 255, 255));
        this.addChild(backgroundLayer);
        this.addWallsAndGround();
    }

});