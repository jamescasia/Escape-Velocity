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
        trail:cc.Node,
        cameraMoving:false,
        ryt:cc.Node,
        left:cc.Node,
        rocket:cc.Node,
        prevBody:null,
        scoreAudio:cc.AudioClip,
        loseAudio:cc.AudioClip,
        errorClip:cc.AudioClip

        
    },

    // LIFE-CYCLE CALLBACKS:
    tapped(){
        var t = this
        if(!t.game.getComponent('Game').locked && !t.game.getComponent('Game').showingInfo && !t.game.getComponent('Game').quitting )t.fire();  
        if(t.game.getComponent('Game').locked && !t.game.getComponent('Game').showingInfo  ) cc.audioEngine.playEffect(this.errorClip, false,0.7)
        if(!t.touched&&!t.game.getComponent('Game').locked && !t.game.getComponent('Game').showingInfo && !t.game.getComponent('Game').quitting) t.game.getComponent('Game').firstTap(),t.touched = true 

    },
    onLoad () {
        this.trail.setLocalZOrder(-2)
        this.trail.opacity = 0
        this.height = parseInt(this.node.y /440)+1 
        globals.playerHeight = this.height 
        this.angles = 0
        // var t = this;
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE, 
        //     onTouchBegan: function(touch, event) { 
                
        //         return true
        //     },
        // }, t.node);
 
        

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
        // if(this.cameraMoving || this.firing ) this.rocket.color  = new cc.Color(100,100,100);
        // else this.rocket.color  = new cc.Color(255, 255, 255);
        // if(this.cameraMoving || this.firing ) this.rocket.opacity = 100
        // else this.rocket.opacity = 255
        // console.log("FIRING", this.firing)
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
        this.gameOver()
    }
    },

    fire(){
        if(this.firing||this.cameraMoving || this.game.getComponent('Game').over   )return
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
        if(body!= this.prevBody){
        this.curPlanet=body
        body.getComponent('planet').speed = 0.4 * body.getComponent('planet').speed
       
        this.land()  
        console.log("HIT",body)
        var action = cc.sequence(
            cc.scaleTo(0.1,2.3,2.3),
            cc.fadeTo(0.01 , 0.5),
            cc.spawn(
                cc.scaleTo(0.4,1.05,1.05 ),
                cc.fadeIn(0.4),
            ) ).easing(cc.easeCubicActionOut())
            var action2 = cc.sequence(
                cc.scaleTo(0.1,2,2),
                cc.fadeTo(0.01 , 0.5),
                cc.spawn(
                    cc.scaleTo(0.4,1  ,1   ),
                    cc.fadeIn(0.4),
                ) ).easing(cc.easeCubicActionOut())
        this.node.runAction(action2)
        body.node.runAction(action)
        body.node.getComponent('planet').landed()
        // body.node.getChildByName('eject').getComponent(cc.ParticleSystem).resetSystem()  
        this.prevBody =  body
        
        }
        
    },
    
    land(){   
        cc.audioEngine.playEffect(this.scoreAudio, false,0.7)
        
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
        cc.audioEngine.playEffect(this.loseAudio, false,0.7)
        this.node.opacity =0
        this.game.getComponent('Game').gameOver()
        
        var over = cc.sequence(cc.delayTime(0), cc.fadeOut(0))
        // this.node.runAction(over)
        // cc.director.loadScene("Game")

    }

    

    // update (dt) {},
});
