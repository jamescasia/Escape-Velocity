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
        types:[]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        this.types = ["aberrant", "normal"]


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
    ss(){ 
        cc.sys.localStorage.setItem('local', JSON.stringify (this.storage) )
        this.storage =  JSON.parse(cc.sys.localStorage.getItem('local'))
    },
    loadData(){
        this.storage = JSON.parse (cc.sys.localStorage.getItem('local'))  
        console.log('fiiirst ' , this.storage)  
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
        console.log("widht", cc.director.getWinSize().height/cc.director.getWinSize().width)

    },
    addPlanet( ){
        var otoy = cc.instantiate(this.planet)
        this.univ.addChild(otoy) 
        otoy.rush = false
        otoy.getComponent('planet').type =this.types [parseInt(cc.rand())%2 ]
        otoy.position = cc.v2( -270 + (540)* cc.random0To1(),440*this.planetCtr) 
        otoy.getComponent('planet').height =  parseInt(otoy.position.y /440) 
        this.planetCtr+=1  
        
        
    }, 
    addPlanets(){
        for(var i = 0; i<6; i++) {
            console.log('loop') 
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
        if(this.score > this.bestScore) this.storage.bestScore = this.score , this.ss()
       if(   this.player.getComponent('player').height + 5>=  this.planetCtr   )this.addPlanet()

       
    },
});
