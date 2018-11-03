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
        moveOnce:false,
        ryt:cc.Node,
        left:cc.Node,
        skins:cc.Node,
        rocketSkin:cc.Sprite,
        style1:cc.SpriteFrame,
        style2:cc.SpriteFrame,
        style3:cc.SpriteFrame,
        style4:cc.SpriteFrame,
        style5:cc.SpriteFrame,
        skinsArray:[],
        req:cc.Label,
        lock:cc.Node,
        lctr:0,
        locked:false,
        infoNode:cc.Node,
        showingInfo:false,
        infBtn:cc.Node,
        status:cc.Node, 
        bar:cc.Node, 
        parallax:cc.Node,
        planetFab:cc.Prefab,
        starFab:cc.Prefab,
        laxCt:0,
        newBestClip:cc.AudioClip,
        tapCtrOver:0,
        quitNode:cc.Node,
        quitting:false,
        howNode:cc.Node,
        howBtn:cc.Button,
        shipBtn:cc.Button,
        godBtn:cc.Node
        
    },

    // LIFE-CYCLE CALLBACKS:
    tapped(){
        var t = this;
        if (t.over)  t.tapCtrOver+=1
        if (t.over && t.tapCtrOver >=2)t.restart()
        if(t.showingInfo) t.hideInfo(), t.hideHow()
        
    },

    onLoad() {   

        // if (cc.sys.os == cc.sys.OS_ANDROID)jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "dismissLoader", "()V");
        

        // y = -0.5x + 1.75
        var scale = -0.5* (cc.director.getWinSize().height/cc.director.getWinSize().width) + 1.75
        if (cc.sys.os != cc.sys.OS_WINDOWS || cc.sys.os != cc.sys.OS_OSX )
        {this.infoNode.scale = cc.v2(scale, scale)
        this.quitNode.scale  = cc.v2(1.2*scale, 1.2*scale)
        this.howNode.scale = cc.v2(0.9*scale, 0.9*scale)
        this.gOverNode.getChildByName('over').scale = cc.v2(1.2*scale, 1.2*scale)}

        var t = this
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                if (keyCode === cc.KEY.back) {  
                    if( !t.player.getComponent('player').touched ||t.over) t.quitPrompt()
                }
                else if (keyCode === cc.KEY.backspace) {
                    // the backspace of PC/Mac is pressed
                }
                else if (keyCode === cc.KEY.escape) {
                    // the escape of PC/Mac is pressed
                }
            }
        }, this.node);
        this.lock.opacity = 0
        this.skinsArray = [this.style1, this.style2, this.style3, this.style4, this.style5]
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

        
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     onTouchBegan: function (touch, event) {

                
        //         return true
        //     },
        // }, t.node);
        this.scoreLabel.opacity = 0
        this.bestLabel.opacity = 0
        this.loadData()
        this.setSkin()
        
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
 
        var t = this
        
        this.addPlanets()
        this.skins.opacity = 0
        if(this.numOfGames<=2) this.showHowFirst()
        if(this.numOfGames %10== 0) {

        var samuk = cc.repeatForever(cc.sequence(
            cc.spawn(
            cc.scaleTo(0.3,0.16,0.16 ),
            cc.fadeTo(0.3, 255 )
            ),
            cc.spawn(
            cc.fadeTo(0.3, 150 ),
            cc.scaleTo(0.3, 0.14, 0.14 ),)
        ))
        this.skins.runAction(samuk)}
        
        
        

     

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
        var playbest = function(){
            if(this.newBest) cc.audioEngine.playEffect(this.newBestClip, false,0.7)
        }
        var camMove = cc.sequence( 
            cc.moveTo(delay, 0, this.player.position.y + 440),
            cc.callFunc(playbest, this)).easing(cc.easeQuarticActionOut())
            
        this.camera.runAction(camMove)
    },
    gameOver() { 
        this.skins.position = cc.v2(0,-900)
        this.ryt.position = cc.v2(0,-900)
        this.left.position = cc.v2(0,-900)
        this.earthCam()
        if (this.score > this.bestScore) this.storage.bestScore = this.score, this.bestScore = this.score, this.ss(), this.newBest = true, 
        globals.planetCount = 0

        this.over = true
        this.numOfGames += 1
        this.storage.numOfGames = this.numOfGames
        this.scoreBoard.getChildByName('b').opacity = 0
        this.ss()
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

        this.postBoard()

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
            this.storage = { bestScore: 0, numOfGames: 0, coins: 0 , lctr:0}
            cc.sys.localStorage.setItem('local', JSON.stringify(this.storage))
        }

        this.lctr =  JSON.parse(parseInt(this.storage.lctr))

        this.coins = JSON.parse(parseInt(this.storage.coins))
        this.bestScore = JSON.parse(parseInt(this.storage.bestScore))
        this.numOfGames = JSON.parse(parseInt(this.storage.numOfGames))
        console.log(this.lctr)

        // this.ss()
    },
    firstTap() {
        this.infBtn.getComponent(cc.Button).interactable = false 
        this.skins.stopAllActions()
        this.skins.runAction(cc.fadeOut(0.3))
        this.ryt.runAction(cc.fadeOut(0.3))
        this.ryt.getComponent(cc.Button).interactable = false
        this.left.getComponent(cc.Button).interactable= false
        this.left.runAction(cc.fadeOut(0.3))
        this.howBtn.interactable = false
        this.howBtn.node.runAction(cc.fadeOut(0.3))
        
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
        // otoy.getChildByName('particlesystem').getComponent(cc.ParticleSystem).resetSystem()
        // var trail = cc.instantiate(this.trailFab)
        // trail.getComponent('trailScript').leader = otoy
        // this.univ.addChild(trail)
        this.planetCtr += 1


    },
    addPlanets() {
        for (var i = 0; i < 4; i++) {
            this.addPlanet()

        }
        console.log("UNIV", this.univ.children) 
        
    },
    landed() {
        
        // this.moveOnce =true
        if((this.score%24 == 0 || this.score%25 == 0|| this.score%26 == 0|| this.score%27 == 0) && this.score >=24) this.addBgPlanet(), this.addBgStar(), console.log("added bg")
        
        this.moveCamera()
        

    },
    stopCamera() {
        this.camera.position = cc.v2(0, this.player.position.y + 440)
    },
    addBgPlanet(){
        var plabg = cc.instantiate(this.planetFab)
        plabg.position = cc.v2(0, 1000+ this.laxCt*3000)
        this.parallax.getChildByName('planets').addChild(plabg)
        
    },
    addBgStar(){
        var starbg = cc.instantiate(this.starFab)
        starbg.position = cc.v2(0, 1000+ this.laxCt*3000)
        this.parallax.getChildByName('stars').addChild(starbg)
        this.laxCt+=1
    },

    moveCamera() {
        console.log("moving camera")
       // if(this.moveOnce)  return
        // this.moveOnce = false;
        console.log(globals.planetCount)
        var place = function () {
            this.player.getComponent('player').cameraMoving = false
        }
        this.player.getComponent('player').cameraMoving = true
        var camMove = cc.sequence(
            cc.delayTime(0),
            (cc.moveTo(0.3, 0, this.player.position.y + 440)).easing(cc.easeCircleActionOut())
            , cc.callFunc(place, this)
        )
        var parMove = cc.moveTo(0.3, 0, -(this.player.position.y + 440)*0.2).easing(cc.easeCircleActionOut()) 
        var starMove = cc.moveTo(0.3, 0, -(this.player.position.y + 440)*0.1).easing(cc.easeCircleActionOut()) 
        this.camera.runAction(camMove)
        this.parallax.getChildByName('planets').runAction(parMove)
        this.parallax.getChildByName('stars').runAction(starMove)
        // this.univ.position = cc.v2( 0 ,  0.4*(this.player.position.y ))
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
    panRight(){
        this.lctr+=1
        this.bar.stopAllActions()
        this.bar.runAction(cc.fadeIn(0.2))
        if(this.lctr >4) this.lctr = 0
        var ryte = cc.sequence(
            cc.spawn(
                cc.rotateBy(0.4, 360),
                cc.fadeOut(0.2)
            ),
            cc.callFunc(this.setSkin, this), cc.rotateTo(0, 0), cc.fadeIn(0))
        // this.player.runAction(ryte)
        this.setSkin()
        

        // this.setSkin()

    },
    // panLeft(){
        
    //     this.bar.opacity =255
    //     this.lctr-=1
    //     if(this.lctr <0) this.lctr = 3
    //     var ryte = cc.sequence(cc.rotateBy(0.4, -360),cc.callFunc(this.setSkin, this), cc.rotateTo(0, 0))
    //     this.player.runAction(ryte)
    //     // this.setSkin()
    // },
    setSkin(){
        console.log('sysudfoiaf')
        let poss = [-526.5, -260.4,2.5,263.8,529.9]
        this.status.position  = cc.v2(poss[this.lctr] , 0)
        let reqs = [0,10 ,20,40, 60]
        // let reqs = [0, 2,3,4, 5]
        if(this.bestScore < reqs[this.lctr]) this.lock.opacity = 255,this.req.string = "score " + reqs[this.lctr], this.locked = true
        else this.lock.opacity = 0,this.req.string = "",this.locked = false
        
        this.rocketSkin.spriteFrame = this.skinsArray[this.lctr]
        this.bar.runAction(cc.sequence(cc.delayTime(2), cc.fadeOut(1) ))
        if(this.bestScore >= reqs[this.lctr]){this.storage.lctr = this.lctr
            this.ss()}
    },
    showInfo(){
        this.howBtn.interactable = false
        this.shipBtn.interactable = false
        this.infBtn.getComponent(cc.Button).interactable = false 
        this.godBtn.setLocalZOrder(11)
        // this.howBtn.node.setGlobalZOrder(-5)
        // this.shipBtn.node.setGlobalZOrder(-5)
        // this.infBtn.setGlobalZOrder(-5)
        this.infoNode.position = cc.v2(0,0)
        // this.infBtn.position = cc.v2(-900,0)
        this.showingInfo = true
        this.ins.stopAllActions()
        this.ins.runAction(cc.fadeOut(0.3))
        this.title.runAction(cc.fadeOut(0.3))
        this.univ.runAction(cc.fadeOut(0.3)) 
        this.infoNode.runAction(cc.fadeIn(0.3))

        this.univ.children[9].getChildByName('particlesystem').getComponent(cc.ParticleSystem).stopSystem()
        this.univ.children[10].getChildByName('particlesystem').getComponent(cc.ParticleSystem).stopSystem() 
    },
    hideInfo(){
        this.howBtn.interactable = true
        this.shipBtn.interactable = true 
        this.infBtn.getComponent(cc.Button).interactable = true
        this.godBtn.setLocalZOrder(-11)
        // this.howBtn.node.getComponent(cc.Widget).bottom = 2
        // this.shipBtn.node.getComponent(cc.Widget).bottom = 2
        // this.infBtn.setGlobalZOrder(5)
        this.showingInfo = false
        this.infoNode.runAction(cc.fadeOut(0.3))
        this.univ.children[9].getChildByName('particlesystem').getComponent(cc.ParticleSystem).resetSystem()
        this.univ.children[10].getChildByName('particlesystem').getComponent(cc.ParticleSystem).resetSystem() 
        if(!this.player.getComponent('player').touched)  this.title.runAction( cc.fadeIn(0.3)) ,this.univ.runAction(cc.fadeIn(0.3)) 
        var a = cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.9)))
        this.ins.runAction(a)
        
        this.infoNode.position = cc.v2(-900,0)
        // this.infBtn.position = cc.v2(0,217) 
    },
    showHow(){
        this.howBtn.interactable = false
        this.shipBtn.interactable = false
        // this.howBtn.node.getComponent(cc.Widget).bottom = -300
        // this.shipBtn.node.getComponent(cc.Widget).bottom = -300
        // this.infBtn.setGlobalZOrder(-15)
        this.godBtn.setLocalZOrder(11)
        this.infBtn.getComponent(cc.Button).interactable = false
        this.howNode.position = cc.v2(0,0)
        
        // this.infBtn.position = cc.v2(-900,0)
        this.showingInfo = true
        this.ins.stopAllActions()
        this.ins.runAction(cc.fadeOut(0.3))
        this.title.runAction(cc.fadeOut(0.3))
        this.univ.runAction(cc.fadeOut(0.3)) 
        this.howNode.runAction(cc.fadeIn(0.3))

       if(this.univ.children[9] != null) this.univ.children[9].children[0] .getComponent(cc.ParticleSystem).stopSystem()
       if(this.univ.children[10]!= null)this.univ.children[10].children[0].getComponent(cc.ParticleSystem).stopSystem() 
        
    },
    showHowFirst(){
        this.howBtn.interactable = false
        this.shipBtn.interactable = false
        this.godBtn.setLocalZOrder(11)
        // this.howBtn.node.getComponent(cc.Widget).bottom = -300
        // this.shipBtn.node.getComponent(cc.Widget).bottom = -300
        // this.infBtn.setGlobalZOrder(-15)
        this.infBtn.getComponent(cc.Button).interactable = false
        this.howNode.position = cc.v2(0,0)
        
        // this.infBtn.position = cc.v2(-900,0)
        this.showingInfo = true
        this.ins.stopAllActions()
        this.ins.runAction(cc.fadeOut(0.3))
        this.title.runAction(cc.fadeOut(0.3))
        this.univ.runAction(cc.fadeOut(0.3)) 
        this.howNode.runAction(cc.fadeIn(0.3))
        if(this.univ.children[11].children[0] != null) this.univ.children[11].children[0] .getComponent(cc.ParticleSystem).stopSystem()
       if(this.univ.children[10].children[0]!= null)this.univ.children[10].children[0].getComponent(cc.ParticleSystem).stopSystem() 
 
        
    },
    hideHow(){
        this.howBtn.interactable = true
        this.shipBtn.interactable = true 
        this.infBtn.interactable = true
        this.godBtn.setLocalZOrder(-11)
        // this.howBtn.node.getComponent(cc.Widget).bottom = 2
        // this.shipBtn.node.getComponent(cc.Widget).bottom = 2
        // this.infBtn.setGlobalZOrder(5)
        this.showingInfo = false
        this.howNode.runAction(cc.fadeOut(0.3))
        this.univ.children[9].getChildByName('particlesystem').getComponent(cc.ParticleSystem).resetSystem()
        this.univ.children[10].getChildByName('particlesystem').getComponent(cc.ParticleSystem).resetSystem() 
        if(!this.player.getComponent('player').touched)  this.title.runAction( cc.fadeIn(0.3)) ,this.univ.runAction(cc.fadeIn(0.3)) 
        var a = cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.9)))
        this.ins.runAction(a)
        
        this.howNode.position = cc.v2(-900,0)
        // this.infBtn.position = cc.v2(0,217) 
    },
    goPage(){
        cc.sys.openURL("https://www.facebook.com/aetherapps/")
    },
    CCBY(){
        cc.sys.openURL("https://creativecommons.org/licenses/by-nc/4.0/deed.en_US")
    },
    YingYin(){
        cc.sys.openURL("https://www.behance.net/yingyin")
    },
    SpaceUp(){
        cc.sys.openURL("https://www.behance.net/gallery/28195863/Space-Up")
    },
    ofl(){
        cc.sys.openURL("https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL")
    },
    quitPrompt(){
        this.gOverNode.runAction(cc.fadeOut(0.3))
        this.quitting = true
        this.quitNode.position = cc.v2(0,100) 
        this.ins.stopAllActions()
        this.ins.runAction(cc.fadeOut(0.3))
        this.title.runAction(cc.fadeOut(0.3))
        this.univ.runAction(cc.fadeOut(0.3)) 
        this.quitNode.runAction(cc.fadeIn(0.3))
        this.scoreLabel.runAction(cc.fadeOut(0.3))
        this.univ.children[9].getChildByName('particlesystem').getComponent(cc.ParticleSystem).stopSystem()
        this.univ.children[10].getChildByName('particlesystem').getComponent(cc.ParticleSystem).stopSystem() 

    },
    
    yesQuit(){cc.game.end()},
    noQuit(){
        this.quitting = false
        this.gOverNode.runAction(cc.fadeIn(0.3))
 
        this.quitNode.runAction(cc.fadeOut(0.3))
        this.univ.children[9].getChildByName('particlesystem').getComponent(cc.ParticleSystem).resetSystem()
        this.univ.children[10].getChildByName('particlesystem').getComponent(cc.ParticleSystem).resetSystem() 
        this.univ.runAction(cc.fadeIn(0.3))
        if(this.over)this.scoreLabel.runAction(cc.fadeIn(0.3))
        if(!this.player.getComponent('player').touched)  this.title.runAction( cc.fadeIn(0.3)) ,this.univ.runAction(cc.fadeIn(0.3)) 
        var a = cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.9)))
        if(!this.over) this.ins.runAction(a)
        
        this.quitNode.position = cc.v2(-900,-900) 
    },

    addScoretoBoard( ){ //worked for global contexts
        if (typeof FBInstant === 'undefined') return; 
        var awa = this
        FBInstant
            .getLeaderboardAsync('high.'+ FBInstant.context.getID())
            .then(leaderboard => {
                console.log(leaderboard.getName());
                return leaderboard.setScoreAsync(   awa.bestScore);
                                })
            .then(() => console.log('Score saveds'))
            .catch(error => console.error(error));
    },

    postBoard(){ //worked
        if (typeof FBInstant === 'undefined') return;
        var shit = this
        shit.addScoretoBoard();
        FBInstant.updateAsync({
            action: 'LEADERBOARD',
            name: 'high.' + FBInstant.context.getID()
          })
            .then(() => console.log('Update Posted'))
            .catch(error => console.error(error));
    },

});
