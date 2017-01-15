
var EditorScene = cc.Scene.extend({
    objects:[],
    stopped:true,
    selectedObject:null,
    mousePressed: false,
    selectedNode:null,
    newObjectLayer:null,
    onEnter:function () {
        this._super();
        var background = new cc.LayerColor(cc.color(255,255,255));

        this.initPhysics();
        this.listenEvents();
        this.debugDraw();
        this.addChild(background,-1,EditorScene.Tags.background);
        this.worldLayer = new WorldLayer(this.world);
        //this.addTestSprite({position:cc.p(400,0),type:b2_staticBody,con1:{position: cc.p(-400,0)},con2:{position: cc.p(400,0)}});
        this.initObjects([
            {position:cc.p(250,300),width:100,height:100,type:b2_dynamicBody,angle:30,'class':'box'},
            {position:cc.p(300,300),width:150,height:100,type:b2_dynamicBody,angle:-30,'class':'box'},
            {position:cc.p(300,300),width:100,height:100,type:b2_dynamicBody,angle:0,'class':'box'},
            {position:cc.p(270,300),type:b2_dynamicBody,radius:5,'class':'pin'},
            {position:cc.p(270,310),type:b2_dynamicBody,radius:5,'class':'pin'},
        ])
        this.scheduleUpdate();
        window.editor = this
    },
    initPhysics : function(){
        //1. new world object
        this.world = new b2World(new b2Vec2(0,-10));
        this.world.SetContinuousPhysics(true);
        var bodyDef = new b2BodyDef();
        bodyDef.position.Set(cc.view.getDesignResolutionSize().width/PMR/2,0);
        this.bodyGround = this.world.CreateBody(bodyDef);
        this.groundShape = new b2PolygonShape();
        this.groundShape.SetAsBox(cc.view.getDesignResolutionSize().width/PMR/2,10/PMR)
        var fixDef = new b2FixtureDef();
        fixDef.shape = this.groundShape;
        this.bodyGround.CreateFixture(fixDef)
    },
    initObjects:function(listOfObjects){
        var self = this
        listOfObjects.forEach(function(object){
            var newObject = Factory[object.class](self.world,object)
            self.objects.push(newObject)
            newObject.class = object.class
            if(newObject.sprite)
                self.addChild(newObject.sprite,object.class=='pin'?2:0);
        })
    },
    update:function(dt){
        this.world.DrawDebugData();
        if(this.stopped) return;
        this.world.Step(1/60,10,10);
        this.world.ClearForces();
        this.objects.forEach(function(o){
            o.update(dt)
        })
    },
    debugDraw:function(){
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("box2d").getContext("2d"));
        debugDraw.SetDrawScale(30);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    },
    togglePhysics:function(){
        this.stopped = !this.stopped;
    },
    listenEvents: function(){
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMove.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this)
        })
        cc.eventManager.addListener(listener, this);
        cc.eventManager.setPriority(listener,1);
    },
    onMouseDown:function(event){
        if(this.isNewObjectLayerClicked()) return;
        this.mousePressed = true;
        var objects = this.getElementAtMouse(event);
        if(objects.length){
            if(this.controlLayer && this.controlLayer.selectedButton && this.selectedObject && this.rectContainsPoint(this.selectedObject.sprite,event)) return;
            this.showControlLayer()
            this.updateSelectedObject(objects)
        }else{
            if(!this.isControlLayerClicked(event) && !this.isRotateAction()){
                this.hideControlLayer()
                this.setAllObjectsToInactive()
            }
        }
    },
    isClickAvailable:function(){

    },
    isNewObjectLayerClicked:function(){
        return this.newObjectLayer && this.newObjectLayer.isClicked()
    },
    isControlLayerClicked:function(event){
        return this.controlLayer && this.rectContainsPoint(this.controlLayer,event)
    },
    isRotateAction:function(){
        return this.controlLayer && this.controlLayer.selectedButton && this.controlLayer.selectedButton._name=="Rotate"
    },
    onMouseUp:function(event){
        if(this.isNewObjectLayerClicked()) return;
        this.mousePressed = false;
    },
    onMouseMove:function(event){
        if(this.isNewObjectLayerClicked()) return;
        if(this.mousePressed && this.controlLayer && this.controlLayer.selectedButton && !this.isControlLayerClicked(event)){
            this.controlLayer.selectedButton.transform(event,this.selectedObject);
        }
    },
    getElementAtMouse:function(event){
        var self = this;
        return _.filter(this.objects,function(o){
            return o.sprite && self.rectContainsPoint(o.sprite,event) && o.getName!=EditorScene.Tags.background
        })
    },
    rectContainsPoint:function(object,event){
        return cc.rectContainsPoint(object.getBoundingBoxToWorld(),cc.p(event._x,event._y))
    },
    showControlLayer:function(){
        if(!this.controlLayer){
            this.controlLayer = new ControlLayer(); this.addChild(this.controlLayer);
        }

    },
    hideControlLayer:function(){
        if(this.controlLayer){
            this.controlLayer.removeFromParent()
            this.controlLayer = null
        }
    },
    updateSelectedObject:function(objects){
        this.selectedObject = this.findSelectedObject(objects);
        this.drawSelectedNode()
        //this.reorderChild(this.selectedObject.sprite,1);
    },
    findSelectedObject:function(objects){
        if(!this.selectedObject){
            return objects[0];
        }
        var self = this
        var index = _.findIndex(objects,function(o){return o==self.selectedObject})
        if(index == -1 || index == objects.length-1) return objects[0];
        return objects[index+1];
    },
    setAllObjectsToInactive:function(){
        this.selectedObject = null
        this.removeSelectedNode()
    },
    drawSelectedNode:function(){
        this.removeSelectedNode();
        var sprite  = new BoxSprite(_.extend({},this.selectedObject.sprite.getContentSize(),{fillColor:'#4286f4'}))
        this.selectedObject.sprite.addChild(sprite)
        this.selectedNode = sprite;
    },
    removeSelectedNode:function(){
        if(this.selectedNode){
            this.selectedNode.removeFromParent()
        }
        this.selectedNode = null
    },
    addNewObject:function(type){

    }



});
var NewObjectLayer = cc.Layer.extend({
    callBack:null,
    type:null,
    _mousePressed:false,
    objectToBeAdded:null,
    startedPoint:null,
    listenEvents: function(){
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMove.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this)
        })
        cc.eventManager.addListener(listener, this);
        cc.eventManager.setPriority(listener,1);
    },
    onMouseDown:function(event){
        this._mousePressed = true;
        this.startedPoint = cc.pointFromEvent(event);
    },
    onMouseMove:function(event){

    },
    onMouseUp:function(event){
        this._mousePressed = false;
    },
    startCreating:function(type,callBack){
        this.callBack = callBack;
        this.type = type;
    },
    prepareObjectOptionsFromEvent:function(event){
        return _.extend({},this.prepareSize(event),{position:this.preparePosition(event),type:b2_dynamicBody})
    },
    preparePosition:function(event){
        var currentPos = cc.pointFromEvent(event);
        return cc.p(
            Math.min(this.startedPoint.x,currentPos.x),
            Math.min(this.startedPoint.y,currentPos.y)
        )
    },
    prepareSize:function(event){

    }

})
EditorScene.Tags = {
    background:"BACKGROUND"
}
