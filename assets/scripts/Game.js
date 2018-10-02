var manager = cc.director.getCollisionManager();
manager.enabled = true;
var globals = require("globals")
cc.Class({
    extends: cc.Component,

    properties: {
        planet:cc.Prefab,
        player:cc.Node,
        univ:cc.Node, 
        planetCtr:0,
        camera:cc.Node, 
        pla1:cc.Node,
        pla2:cc.Node,
        pla3:cc.Node,
        pla4:cc.Node,
        pla5:cc.Node,
        pla6:cc.Node,  
        scoreLabel:cc.Node,
        score:0,
        bestLabel:cc.Node,
        bestScore:0,
        ins:cc.Node,
        storage:null,
        numOfGames:0,
        coins:0,
        trailFab:cc.Prefab,
        types:[],
        over:false,
        scoreBoard:cc.Node,
        gOverNode:cc.Node,
        count:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        this.node.opacity = 0

        var blink =cc.sequence ( 
            cc.delayTime(0),
            cc.fadeIn(0.25), 
            // cc.callFunc(this.restart, this)
    
    
    )
        this.node.runAction(blink)
        this.types = ["aberrant", "normal"]

        var t = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE, 
            onTouchBegan: function(touch, event) { 
                
                if(t.over) t.restart()
                return true
            },
        }, t.node);
        this.scoreLabel.opacity = 0
        this.bestLabel.opacity = 0
        this.loadData()

        this.bestLabel.getComponent(cc.Label).string = "BEST: " + this.bestScore
        
        cc.director.setDisplayStats ( false )
        var breathing = cc.repeatForever(
            cc.sequence(
                cc.moveBy(2, 0, -12).easing(cc.easeCubicActionOut()),
                cc.moveBy(2, 0, 6).easing(cc.easeQuarticActionIn()),
                cc.moveBy(2 , 0, 6).easing(cc.easeCubicActionOut())
            ) 
        )
        this.ins.runAction(breathing)

        var dt = 1/80 
        var t = this 
        this.addPlanets()
        
        // var gameTimer = this.schedule(function() { 
        //     this.score = this.player.getComponent('player').height 
        //     this.scoreLabel.getComponent(cc.Label).string = this.score  
        //     if(this.score > this.bestScore) this.storage.bestScore = this.score , this.ss()
        //    if(   this.player.getComponent('player').height + 5>=  this.planetCtr   )this.addPlanet()

           
           
            
        
        // }, dt );

        
        
        
    },
    restart(){
        cc.director.loadScene("Game")
        
        
        
    },
    earthCam(){
        this.player.position= cc.v2(0,-440)

        var camMove = cc.sequence( 
            cc.delayTime(0),
            (cc.moveTo(0.6, 0 ,  this.player.position.y +440)).easing(cc.easeQuarticActionOut()))
        this.camera.runAction(camMove)
    },
    gameOver(){
        this.earthCam()
        if(this.score > this.bestScore) this.storage.bestScore = this.score , this.bestScore = this.score, this.ss()
        globals.planetCount = 0

        this.over = true
        this.numOfGames +=1
        this.storage.numOfGames = this.numOfGames 
        this.scoreBoard.getChildByName('b').opacity = 0
        this.ss()
        
        // var move = cc.sequence(cc.moveBy(0.4, 0 , -50), cc.scaleTo(0.2, 1.4,1.4))
        // this.scoreBoard.runAction(move)
        this.gOverNode.getChildByName("best").getComponent(cc.Label).string = "Your best is "+ this.bestScore+"\n in " + this.numOfGames +" games"
        var show = function(){
            this.gOverNode.position =cc.v2(0,331)
            this.gOverNode.opacity =255
            this.scoreBoard.position = cc.v2( 0 , 82)

            this.scoreBoard.scale = cc.v2(1.4,1.4)

            var a = cc.repeatForever(cc.sequence(cc.fadeIn(0.5),cc.fadeOut(0.9)))
            this.gOverNode.getChildByName('retry').runAction(a)

        }
        var blink =cc.sequence (
            cc.fadeOut(0.2),
            cc.callFunc(show, this),
            cc.fadeIn(0.2),
            
    
    
    )
        this.node.runAction(blink)

    },

    ss(){ 
        cc.sys.localStorage.setItem('local', JSON.stringify (this.storage) )
        this.storage =  JSON.parse(cc.sys.localStorage.getItem('local'))
    },
    loadData(){
        this.storage = JSON.parse (cc.sys.localStorage.getItem('local'))   
        if(  this.storage == null  ){ 
            this.storage = {bestScore:0, numOfGames :0, coins:0}  
        cc.sys.localStorage.setItem('local',JSON.stringify( this.storage)) 
        } 
        
        this.coins =  JSON.parse(parseInt( this.storage.coins) )
        this.bestScore =  JSON.parse(parseInt( this.storage.bestScore) )
        this.numOfGames =  JSON.parse(parseInt( this.storage.numOfGames) )
         
        this.ss()
    },
    firstTap(){ 
        var ins = cc.fadeIn(0.3)
        var sins = cc.fadeIn(0.3)
        var app = function(){
        this.scoreLabel.runAction(sins)
        this.bestLabel.runAction(ins)}
        var fade =cc.sequence( cc.fadeOut(0.3),cc.callFunc(app, this))
        this.ins.runAction(fade)
        
    },
    screenResize(){
        if( cc.director.getWinSize().height/cc.director.getWinSize().width <= 1.34     ) { 
        } 

    },

    start () { 

    },
    addPlanet( ){ 
        globals.planetCount+=1
        var otoy = cc.instantiate(this.planet)
        this.univ.addChild(otoy) 
        otoy.rush = false
        otoy.getComponent('planet').type =this.types [parseInt(cc.rand())%2 ]
        var a =  -114.29 *(cc.director.getWinSize().height/cc.director.getWinSize().width ) + 441.43 
        otoy.position = cc.v2( -a + (2*a)* cc.random0To1(),440*this.planetCtr) 
        otoy.getComponent('planet').height =  parseInt(otoy.position.y /440) 
        // var trail = cc.instantiate(this.trailFab)
        // trail.getComponent('trailScript').leader = otoy
        // this.univ.addChild(trail)
        this.planetCtr+=1  
        
        
    }, 
    addPlanets(){
        for(var i = 0; i<4; i++) { 
            this.addPlanet( )
        
        } 
    },
    landed(){
        this.moveCamera() 
        
    },
    
    moveCamera(){ 
        var camMove = cc.sequence( 
            cc.delayTime(0),
            (cc.moveTo(0.5, 0 , this.player.position.y +440)).easing(cc.easeCircleActionOut()))
        this.camera.runAction(camMove)
        // this.camera.position  =cc.v2(0, this.player.y+500) 
    },


    update (dt) { 

        this.score = this.player.getComponent('player').height 
        this.scoreLabel.getComponent(cc.Label).string = this.score  
        
       if(   this.player.getComponent('player').height + 3>=  this.planetCtr   )this.addPlanet()

       
    },
});
