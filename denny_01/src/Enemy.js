var Enemy = Dot.extend({
    _className:"dgEnemy",
    elasticity:1,
    texture:s_enemy,
    ctor:function(space,startPosition,velocity){
        this._super(space,startPosition);
        this.body.applyImpulse(cp.v.mult(cp.v(Math.random(),Math.random()),velocity),cp.v(0,0))

    }
})