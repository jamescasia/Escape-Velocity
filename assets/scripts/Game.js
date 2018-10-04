var manager = cc.director.getCollisionManager();
manager.enabled = true;
var globals = require("globals")
cc.Class({
    extends: cc.Component,

    properties: {
        line:cc.Node,
        planet: cc.Prefab,
        player: cc.Node,
        univ: cc.Node,
        planetCtr: 0,
        camera: cc.Node, 
        scoreLabel: cc.Node,
        score: 0,
        bestLabel: cc.Node,
        bestScore: 0,
        ins: cc.Node,
        storage: null,
        numOfGames: 0,
        coins: 0,
        trailFab: cc.Prefab,
        types: [],
        over: false,
        scoreBoard: cc.Node,
        gOverNode: cc.Node,
        count: 0,
        title: cc.Node,
        esc: cc.Node,
        vel: cc.Node,
        broken:false,
        startVal:0,
        newBest:false,
        moveOnce:false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        globals.playerHeight = 0
        globals.planetCount = 0
        this.screenResize()
        this.node.opacity = 0

        var blink = cc.sequence(
            cc.delayTime(0),
            cc.fadeIn(0.25),
            // cc.callFunc(this.restart, this)


        )
        this.node.runAction(blink)
        this.types = ["aberrant", "normal"]

        var t = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {

                if (t.over) t.restart()
                return true
            },
        }, t.node);
        this.scoreLabel.opacity = 0
        this.bestLabel.opacity = 0
        this.loadData()
        if(this.numOfGames>0)this.placeLine()

        this.bestLabel.getComponent(cc.Label).string = "BEST: " + this.bestScore

        cc.director.setDisplayStats(false)
        var breathing = cc.repeatForever(
            cc.sequence(
                cc.moveBy(2, 0, -12).easing(cc.easeCubicActionOut()),
                cc.moveBy(2, 0, 6).easing(cc.easeQuarticActionIn()),
                cc.moveBy(2, 0, 6).easing(cc.easeCubicActionOut())
            )
        )
        var a = cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.9)))
        this.ins.runAction(a)
        this.title.runAction(breathing)

        var dt = 1 / 80
        var t = this
        this.addPlanets()

        // var gameTimer = this.schedule(function() { 
        //     this.score = this.player.getComponent('player').height 
        //     this.scoreLabel.getComponent(cc.Label).string = this.score  
        //     if(this.score > this.bestScore) this.storage.bestScore = this.score , this.ss()
        //    if(   this.player.getComponent('player').height + 5>=  this.planetCtr   )this.addPlanet()





        // }, dt );




    },
    placeLine(){
        var rytleft = cc.repeatForever(
            cc.sequence(
                cc.moveBy(2, 300, 0 ),
                cc.moveBy(2, -300, 0 ),
            )
        )
        // this.line.getChildByName('lin').runAction(rytleft) 
        this.line.getChildByName('part').getComponent(cc.ParticleSystem).stopSystem()  
        this.line.position = cc.v2(0 ,440 * (this.bestScore-1) - 220 )
    },
    destroyLine(){
        var blink = cc.sequence(
            cc.fadeOut(0.1),
            cc.fadeIn(0.1),)
        this.node.runAction(blink)
        this.line.runAction(cc.fadeOut(0.06))

        this.line.getChildByName('part').getComponent(cc.ParticleSystem).resetSystem() 

    },
    restart() {
        cc.director.loadScene("Game")



    },
    earthCam() {
        this.player.position = cc.v2(0, -440)
        var delay = 0.6 + this.score / 16

        var camMove = cc.sequence(
            cc.delayTime(0),
            (cc.moveTo(delay, 0, this.player.position.y + 440)).easing(cc.easeQuarticActionOut()))
        this.camera.runAction(camMove)
    },
    gameOver() { 
         
        this.earthCam()
        if (this.score > this.bestScore) this.storage.bestScore = this.score, this.bestScore = this.score, this.ss(), this.newBest = true
        globals.planetCount = 0

        this.over = true
        this.numOfGames += 1
        this.storage.numOfGames = this.numOfGames
        this.scoreBoard.getChildByName('b').opacity = 0
        this.ss()

        // var move = cc.sequence(cc.moveBy(0.4, 0 , -50), cc.scaleTo(0.2, 1.4,1.4))
        // this.scoreBoard.runAction(move)
        // this.scoreLabel.scale = cc.v2(1.2,1.2)
        
        this.gOverNode.getChildByName("best").getComponent(cc.Label).string = "Your best is " + this.bestScore + "\n in " + this.numOfGames + " games"
        var show = function () {
            this.gOverNode.position = cc.v2(0, 331)
            this.gOverNode.opacity = 255
            this.scoreBoard.position = cc.v2(0, 82)
            this.incAnim(this.score)

            this.scoreBoard.getChildByName('score').getComponent(cc.Label).fontSize = 140

            var a = cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.9)))
            this.gOverNode.getChildByName('retry').runAction(a)


        }
        var blink = cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(show, this),
            cc.fadeIn(0.2), 
            



        )
        this.node.runAction(blink)

    },
    screenResize(){
        console.log('wa')
        console.log("RATIO ",  cc.director.getWinSize().height/cc.director.getWinSize().width)
        if( cc.director.getWinSize().height/cc.director.getWinSize().width <= 1.069     ) { 
            this.node.getComponent(cc.Canvas).fitHeight = true
            this.node.getComponent(cc.Canvas).fitWidth = true
        } 

    },
    incAnim(score){ 
        var proceed = function(){
            if(this.startVal <=  score && score >2) this.incAnim(score)
            else {
                //this.numAnim(this.highestCombo) 
                if(this.newBest) {
                    this.gOverNode.getChildByName('part').getComponent(cc.ParticleSystem).resetSystem()  
                    var news = cc.sequence(
                        cc.delayTime(0),
                        cc.spawn(
                            cc.scaleTo(0.1, 0.35    ,0.35),
                            cc.fadeIn(0.2)
                        )
                    )
                    this.gOverNode.getChildByName('new').runAction(news)
                
                }
                this.scoreLabel.getComponent(cc.Label).string = this.score 
                var glow= cc.sequence(    
                    cc.spawn(
                        cc.delayTime(0),
                        // cc.fadeOut(0.100),
                        cc.scaleTo(0.1,1.2,1.2)
                    ) ,
                    cc.spawn(
                        cc.delayTime(0),
                        // cc.fadeIn(0.100),
                        cc.scaleTo(0.1,1  ,1 )
                    )
                
                )
                

                this.scoreLabel.runAction(glow)
                
                }
        }
        var add =  Math.ceil( score/10)
        this.scoreLabel.getComponent(cc.Label).string = this.startVal 
        var anim = cc.sequence(cc.delayTime(0.035) , cc.callFunc(proceed, this)) 
        this.startVal+=add
        this.node.runAction(anim)
        
        
    },

    ss() {
        cc.sys.localStorage.setItem('local', JSON.stringify(this.storage))
        this.storage = JSON.parse(cc.sys.localStorage.getItem('local'))
    },
    loadData() {
        this.storage = JSON.parse(cc.sys.localStorage.getItem('local'))
        // this.storage = null
        if (this.storage == null) {
            this.storage = { bestScore: 0, numOfGames: 0, coins: 0 }
            cc.sys.localStorage.setItem('local', JSON.stringify(this.storage))
        }

        this.coins = JSON.parse(parseInt(this.storage.coins))
        this.bestScore = JSON.parse(parseInt(this.storage.bestScore))
        this.numOfGames = JSON.parse(parseInt(this.storage.numOfGames))

        this.ss()
    },
    firstTap() {
        var ins = cc.fadeIn(0.3)
        var sins = cc.fadeIn(0.3)
        var app = function () {
            this.scoreLabel.runAction(sins)
            this.bestLabel.runAction(ins)
        }
        var fade = cc.sequence(cc.fadeOut(0.3), cc.callFunc(app, this))
        this.ins.stopAllActions()
        this.ins.runAction(fade)
        this.title.stopAllActions()

        var fall = cc.sequence(cc.delayTime(0.25),
            cc.moveBy(0.1, 0, 40).easing(cc.easeQuadraticActionOut()),
            cc.spawn(
                cc.moveBy(0.3, 0, -700).easing(cc.easeQuadraticActionIn()),
                cc.fadeOut(0.25)

            )
        )
        var break1 = cc.sequence(
            cc.delayTime(0.25  + 0.1*cc.random0To1()),
            cc.spawn(
                cc.moveBy(0.2, -30 - 15*cc.random0To1(),-50 - 15*cc.random0To1()).easing(cc.easeQuadraticActionOut()), 
                cc.rotateBy(0.2, -30 - 10*cc.random0To1())
            )
            
        )
        var break2 = cc.sequence(
            cc.delayTime(0.3 + 0.1*cc.random0To1()),
            cc.spawn(
                cc.moveBy(0.3, 70 + 15*cc.random0To1(),-50 - 15*cc.random0To1()).easing(cc.easeQuadraticActionOut()), 
                cc.rotateBy(0.3, 20 + 10*cc.random0To1())
            )
            
        )
        
        this.title.runAction(fall)
        this.esc.runAction(break1)
        this.vel.runAction(break2)

    },
     

    start() {

    },
    addPlanet() {
        globals.planetCount += 1
        var otoy = cc.instantiate(this.planet)
        this.univ.addChild(otoy)
        otoy.rush = false
        otoy.getComponent('planet').type = this.types[parseInt(cc.rand()) % 2]
        var a = -114.29 * (cc.director.getWinSize().height / cc.director.getWinSize().width) + 441.43
        otoy.position = cc.v2(-a + (2 * a) * cc.random0To1(), 440 * this.planetCtr)
        otoy.getComponent('planet').height = parseInt(otoy.position.y / 440)
        // var trail = cc.instantiate(this.trailFab)
        // trail.getComponent('trailScript').leader = otoy
        // this.univ.addChild(trail)
        this.planetCtr += 1


    },
    addPlanets() {
        for (var i = 0; i < 4; i++) {
            this.addPlanet()

        }
    },
    landed() {
        
        // this.moveOnce =true
        this.moveCamera()

    },
    stopCamera() {
        this.camera.position = cc.v2(0, this.player.position.y + 440)
    },

    moveCamera() {
        // if(this.moveOnce)  return
        // this.moveOnce = false;
        console.log(globals.planetCount)
        var place = function () {
            this.player.getComponent('player').cameraMoving = false
        }
        this.player.getComponent('player').cameraMoving = true
        var camMove = cc.sequence(
            cc.delayTime(0),
            (cc.moveTo(0.4, 0, this.player.position.y + 440)).easing(cc.easeCircleActionOut())
            , cc.callFunc(place, this)
        )
        this.camera.runAction(camMove)
        // this.camera.position  =cc.v2(0, this.player.y+500) 
    },


    update(dt) { 
        var pos = this.player.getChildByName('head').position
        var pos2 = this.line.position    
        if( pos.y + this.player.position.y>= pos2.y && !this.broken) this.broken = true, this.destroyLine()
        

        
        if(!this.over)this.score = this.player.getComponent('player').height,this.scoreLabel.getComponent(cc.Label).string = this.score
        if(this.score == 1) this.esc.stopAllActions(), this.vel.stopAllActions()
        if (this.player.getComponent('player').height + 3 >= this.planetCtr) this.addPlanet()


    },
});
