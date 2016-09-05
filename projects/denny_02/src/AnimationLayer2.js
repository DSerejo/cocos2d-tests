var AnimationLayer = cc.Layer.extend({
    _debugNode:null,
    space : null,
    objects:[],
    dragging:null,

    ctor:function(space){
        this._super();
        this.space=space;
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(this._debugNode, 10);
    },

    init:function () {

        this._super();
        var size = cc.director.getWinSize();
        this.hero = new Hero(this.space,cc.p(size.width / 2, 70));
        this.addChild(this.hero.sprite);
        this.objects.push(this.hero);

        //var rock = new Rock(this.space,cc.p(size.width /2 + 20, 70),60,60);
        //this.addChild(rock.sprite);
        //this.objects.push(rock);
        //
        //var constraint = new cp.PinJoint(this.hero.body,rock.body,cp.vzero,cp.vzero);
        //this.space.addConstraint(constraint);
        //
        //
        //var rod = new Rod(this.space,cc.p(size.width /2 + 30, 70),60,60);
        //this.addChild(rod.sprite);
        //this.objects.push(rod);
        //
        //rock.shape.setCollisionGroup(1);
        //this.hero.shape.setCollisionGroup(1);

        this.currentScale = 1;
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.onMouseDown,
            onMouseMove: this.onMouseMove,
            onMouseUp: this.onMouseUp
        }, this)
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  this.onKeyPressed,
            onKeyReleased:  this.onKeyReleased
        }, this)
        this.scheduleUpdate();
    },
    onKeyPressed: function(keyCode, event){

        var self = event.getCurrentTarget();
        cc.log(self.hero.body.getVel().x)
        switch(keyCode){

            case 39:
                cc.log()
                if(self.hero.body.getVel().x>=50) return;
                self.hero.body.applyImpulse(cp.v(10,0),cp.v(0,0));
                break;
            case 37:

                if(self.hero.body.getVel().x && self.hero.body.getVel().x<=-50) return;
                self.hero.body.applyImpulse(cp.v(-10,0),cp.v(0,0));
                break;
            case 38:

                var parent = self.getParent();
                var size = cc.director.getWinSize();
                parent.setScale(self.currentScale+0.25);
                self.currentScale+=0.25
                break;
            case 40:
                var parent = self.getParent();
                var size = cc.director.getWinSize();
                parent.setScale(self.currentScale-0.25);
                self.currentScale-=0.25
                break;


        }



    },
    onKeyReleased: function(keyCode, event){

    },
    onMouseDown: function(target,event){
        if(GameState.current==GameState.running) return;
        var self = target.getCurrentTarget();
        for(var i in self.objects){
            var obj = self.objects[i];
            var point = cc.p(target._x,target._y);
            if(cc.rectContainsPoint(obj.sprite.getBoundingBox(),point)){
                cc.log('==clicked obj')
                self.dragging = obj;
            }
            else{
                cc.log('==clicked world')
            }
        }
    },
    onMouseMove: function(target,event){
        var self = target.getCurrentTarget();
        if(self.dragging){

            cc.log(target._x,target._y);
            var action = cc.moveBy(0,target.getDelta());
            self.dragging.sprite.runAction(action);
        }
    },
    onMouseUp: function(target,event){
        var self = target.getCurrentTarget();
        if(self.dragging){

            cc.log('==drag ends')
        }
        self.dragging = null;
    },
    initPhysics: function(){

    },
    getEyeX:function () {
        return this.hero.sprite.getPositionX();
    },
    stopPhysics: function(){

    },
    update: function(dt){

    }

});
