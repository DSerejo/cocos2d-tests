var CircleBody = PhysicsObject.extend({
    makeBody: function(radius,bodyType,density,restitution,friction,pos,angle){
        var bodyDef = new b2BodyDef();
        bodyDef.type = bodyType;
        bodyDef.position.Set(pos.x/this.PMR, pos.y/this.PMR);
        bodyDef.angle = cc.degreesToRadians(angle);
        this.body = this.world.CreateBody(bodyDef);
        this.shape = new b2CircleShape();
        this.shape.SetRadius(radius/this.PMR);
        var fixDef = new b2FixtureDef();
        fixDef.shape=this.shape;
        fixDef.density=density;
        fixDef.friction=friction;
        fixDef.restitution = restitution;
        this.body.CreateFixture(fixDef);
    }
})