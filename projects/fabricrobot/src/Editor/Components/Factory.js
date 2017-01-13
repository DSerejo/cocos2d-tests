Factory = cc.Class.extend({})
Factory.wheel = function(world,options){
    return new Wheel(world,options)
}
Factory.box = function(world,options){
    return new Box(world,options)
}
Factory.rod = function(world,options){
    return new Rod(world,options)
}