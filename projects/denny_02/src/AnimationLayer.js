var AnimationLayer = cc.Layer.extend({
    _debugNode:null,
    space : null,
    objects:[],
    objectsByTag:{},
    groups:{},
    groupsByObject:{},
    dragging:null,
    uniqueGroup:0,
    ctor:function(space){
        this._super();
        this.space=space;
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        //this.addChild(this._debugNode, 10);
    },

    init:function () {

        this._super();
        var size = cc.director.getWinSize();
        /*
        this.addObject('motor',cc.p(50, 50),'motor');
        this.addObject('wheel',cc.p(110, 30),'roda1',{r:30});
        this.addObject('transmission',null,'trans',{motor:this.objectsByTag.motor,wheel:this.objectsByTag.roda1});
        this.addObject('rod',cc.p(200,50),'rod',{width:100});
        */
        this.handleEvents();
    },
    handleEvents:function(){
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
    addObject:function(type,pos,id,extra){
        if(!id || this.objectsByTag[id]){
            cc.log('Error: object must have an unique id');
            return;
        }
        var obj;
        switch(type){
            case 'motor':
                obj = new Motor(this.space,pos);
                break
            case 'wheel':
                obj = new Wheel(this.space,pos,extra.r)
                break
            case 'transmission':
                obj = new Transmission(this.space,extra.motor,extra.wheel);
                break
            case 'rod':
                obj = new Rod(this.space,pos,extra.width);
                break
        }
        obj.tag = id;
        this.objects.push(obj);
        this.objectsByTag[id]=obj;
        var sprites = obj.getSprites();
        for(var sprite in sprites){
            this.addChild(sprites[sprite]);
        }

    },
    onKeyPressed: function(keyCode, event){
        var self = event.getCurrentTarget();
        var motor = self.objectsByTag.motor;
        cc.log(self.getEyeX());
        switch(keyCode) {
            case 37:
                if(!motor) return;
                motor.break();
                break
            case 39:
                if(!motor) return;
                motor.accelerate();
                break
        }
    },
    onKeyReleased: function(keyCode, event){

    },
    onMouseDown: function(target,event){
        if(GameState.current==GameState.running) return;

        var self = target.getCurrentTarget();

        if(GameState.current==GameState.adding){
            var type = GameState.adding;
            self.addObject(type,target.getLocation(),type+guid(),{});
            GameState.changeState(GameState.prevState);
            GameState.editLayer.reloadMenus();
        }


        for(var i in self.objects){
            var obj = self.objects[i];
            var point = cc.p(target._x,target._y);
            if(cc.rectContainsPoint(obj.sprite.getBoundingBox(),point)){
                obj.sprite.getParent().reorderChild(obj.sprite,1);
                Utility.addFrame(obj,obj.sprite);
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
            var tag = self.dragging.tag;
            function move(obj){
                var sprites = obj.getSprites();
                for(var sprite in sprites){
                    sprites[sprite].setPosition(cp.v.add(sprites[sprite].getPosition(),target.getDelta()))
                }
            }
            if(self.groupsByObject[tag]){
                var group = self.groups[self.groupsByObject[tag]];
                for(var o in group){
                    move(group[o]);
                }
            }
            else{
                move(self.dragging);
            }
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
        var motor = this.objectsByTag.motor;
        if(!motor) return false;

        return Math.max(motor.sprite.getPosition().x-50,0);
    },
    stopPhysics: function(){

    },
    update: function(dt){


    }

});
