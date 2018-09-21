var manager = cc.director.getCollisionManager();
manager.enabled = true;
 
cc.Class({
    extends: cc.Component,

    properties: {
        planet:cc.Prefab,
        player:cc.Node,
        univ:cc.Node, 
        planetCtr:0,
        camera:cc.Node, 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var dt = 1/80 
        var t = this 
        this.addPlanets()
        
        var gameTimer = this.schedule(function() {    
           // this.moveCamera()
            
        
        }, dt );


        
        
    },

    start () {

    },
    addPlanet(){
        var pla = cc.instantiate(this.planet)
        var a = 
        this.univ.addChild(pla) 
        pla.rush = false
        pla.position = cc.v2(cc.randomMinus1To1()*193,340*this.planetCtr)
        this.planetCtr+=1
        
        
    }, 
    addPlanets(){
        this.addPlanet()
        this.addPlanet()
        this.addPlanet()
        this.addPlanet()
    },
    moveCamera(){
        console.log("MOVEIT")
        var camMove = (cc.moveTo(0.3, 0 , this.player.position.y +400)).easing(cc.easeCubicActionIn())
        this.camera.runAction(camMove)
        // this.camera.position  =cc.v2(0, this.player.y) 
    },


    // update (dt) {},
});
