var Hero = Dot.extend({
    _className:"dgHero",

    elasticity:0,
    dx:0,
    dy:0,
    event:null,
    vel:100,
    pressed:{},
    ctor:function(space,startPosition){
        this._super(space,startPosition);
        this.scheduleUpdate();
    }
    ,
    onKeyPressed: function(keyCode, event){
        var self = event.getCurrentTarget().hero;
        var old={
            dx:self.dx,
            dy:self.dy
        };
        var curVel = self.body.getVel();
        var force;
        var weight;
        switch(keyCode){
            case 37:
                if(!self.pressed.left){
                    weight = old.dx>0?Math.abs(curVel.x/self.vel) + 1:1;
                    self.dx=-weight*self.vel;
                    force = {
                        dx:self.dx,
                        dy:0
                    }
                    self.pressed.left=true;
                }


                break;
            case 38:
                if(!self.pressed.up) {
                    weight = old.dy < 0 ? Math.abs(curVel.y/self.vel) + 1 : 1;
                    self.dy = weight * self.vel;
                    force = {
                        dy: self.dy,
                        dx: 0
                    }
                    self.pressed.up=true;
                }
                break;
            case 39:
                if(!self.pressed.right) {
                    weight = old.dx < 0 ? Math.abs(curVel.x/self.vel) + 1 : 1;
                    self.dx = weight * self.vel;
                    force = {
                        dx: self.dx,
                        dy: 0
                    }
                    self.pressed.right=true;
                }
                break;
            case 40:
                if(!self.pressed.down) {
                    weight = old.dy > 0 ? Math.abs(curVel.y/self.vel) + 1 : 1;
                    self.dy = -weight * self.vel;
                    force = {
                        dy: self.dy,
                        dx: 0
                    }
                    self.pressed.down=true;
                }
                break;
            default:
                break
        }
        self.body.applyImpulse(cp.v(force.dx,force.dy),cp.v(0,0));


    },
    onKeyReleased: function(keyCode, event){
        var self = event.getCurrentTarget().hero;
        var curVel = self.body.getVel();
        switch(keyCode){
            case 37:
                if(self.dx<0){
                    //self.dx=0;
                    self.body.setVel(cp.v(0,curVel.y));
                }
                self.pressed.left=false;
                break;
            case 38:
                if(self.dy>0){
                    //self.dy=0;
                    self.body.setVel(cp.v(curVel.x,0));
                }
                self.pressed.up=false;
                break;
            case 39:
                if(self.dx>0){
                    //self.dx=0;
                    self.body.setVel(cp.v(0,curVel.y));
                }
                self.pressed.right=false;
                break;
            case 40:
                if(self.dy<0){
                    //self.dy=0;
                    self.body.setVel(cp.v(curVel.x,0));
                }
                self.pressed.down=false;
                break;
            default:
                break
        }
    }

})