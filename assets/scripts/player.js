var globals = require("globals")
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Node,
        game:cc.Node,
        rotateAction:null,
        fireAction:null, 
        angles:0,
        anglesplus:false, 
        firing:false,
        landed:false,
        curPlanet:cc.CircleCollider,
        lose:false,
        height:0,
        touched:false,
        trail:cc.Node

        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.trail.setLocalZOrder(-2)
        this.trail.opacity = 0
        this.height = parseInt(this.node.y /440)+1 
        globals.playerHeight = this.height 
        this.angles = 0
        var t = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE, 
            onTouchBegan: function(touch, event) { 
                t.fire(); 
                if(!t.touched) t.game.getComponent('Game').firstTap(),t.touched = true 
                return true
            },
        }, t.node);
 
        

            var dt = 1/80
            this. speed = 200 + cc.random0To1()*800 
            var t = this
            var ctr = 0

            // var gameTimer = this.schedule(function() {  
            //     this.height = parseInt(this.node.y /440)+1 
            //     globals.playerHeight = this.height 
            //     if(!this.firing)this.rotate(dt)
            //     if(this.landed) this.node.position = cc.v2 (this.curPlanet.node.position.x, this.curPlanet.node.position.y)
         
                    
        
            // }, dt );

        
    },

    start () {
        this.node.setLocalZOrder(5)
      //  this.rotate()

    },

    update(dt){
        if(this.touched){
        this.height = parseInt(this.node.y /440)+1 
        globals.playerHeight = this.height 
        if(!this.firing)this.rotate(dt)
        if(this.landed) this.node.position = cc.v2 (this.curPlanet.node.position.x, this.curPlanet.node.position.y)
        }
      //  console.log( 400* Math.sin(  0.0174533*this.head.rotation ) )
        
    },

    rotate(dt){
        //console.log("angles" + this.angles)
        this.head.rotation =this.angles 

        if (this.angles >= 80 && this.angles <=120)  this.anglesplus = true
		if (this.angles <= -80 && this.angles >=-120) this.anglesplus = false
		if (this.anglesplus) this.angles-=100*dt 
        else if (!this.anglesplus) this.angles+=100*dt 
        
 
 
    },
    stopFire(){
        this.firing = false
        this.trail.opacity = 0
        if(!this.landed) { this.lose = true
        this.gameOver()}
    },

    fire(){
        if(this.firing)return
        this.trail.getComponent(cc.ParticleSystem).resetSystem()  
        this.trail.opacity = 255
        this.landed =false
        this.firing = true
        this.fireAction =  cc.sequence(
            cc.moveBy(1.54,  920* Math.sin(  0.0174533*this.head.rotation ), 920* Math.cos(  0.0174533*this.head.rotation ) ).easing(cc.easeCubicActionOut()), 
            cc.moveTo(0, 0,0), 
            cc.callFunc(this.stopFire, this)
        
        )
        this.head.runAction(this.fireAction)
    },

    hit(body){ 
        this.curPlanet=body
        this.land() 
        body.node.getComponent('planet').landed()
    },
    
    land(){ 
        

        this.firing = false
        this.head.stopAction(this.fireAction)
        this.head.position = cc.v2(0, 0)
        this.landed = true 
        if(this.landed) this.node.position = cc.v2 (this.curPlanet.node.position.x, this.curPlanet.node.position.y)
        this.trail.getComponent(cc.ParticleSystem).stopSystem()  
       this.game.getComponent('Game').landed()
        
        //
        //
        //  


    }, 
    gameOver(){ 
        this.node.opacity =0
        this.game.getComponent('Game').gameOver()
        
        var over = cc.sequence(cc.delayTime(0), cc.fadeOut(0))
        // this.node.runAction(over)
        // cc.director.loadScene("Game")

    }

    

    // update (dt) {},
});
