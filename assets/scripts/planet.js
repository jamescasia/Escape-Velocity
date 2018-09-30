// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var globals = require("globals")
cc.Class({
    extends: cc.Component,

    properties: { 
        Game:{
            default:null,
            serializable:false
        },
        posx:0,
        right:false,
        lastSpeed:0,
        tagged:false,
        rush:false,
        height:null, 
        pT:0, 
        namae:null

        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:
    setID(id){
 
    },



    onLoad () {
        
        var pos = [ 135,145,105,165, 110, 215, 255, 235]
        this.pT =  Math.floor( pos[cc.rand()%8]  )
        var dt = 1/80
        var speed = 200 + cc.random0To1()*500
           
        var t = this
        var ctr = 0
        this.height = parseInt(this.node.y )/440
 
        
        var gameTimer = this.schedule(function() { 
         //   console.log(this.height, 'my hiehgt')
        if(ctr>=2000) ctr = 0 
        //console.log(this.self, 'self')
        if(  (globals.playerHeight)-6>= this.height && globals.playerHeight!= undefined) {this.node.destroy()

            console.log("destroyed self")}

        ctr+=1

        this.node.position =  cc.v2(this.posx , this.node.position.y) 
            // if( cc.director.getWinSize().height/cc.director.getWinSize().width <= 1.34     )  
        var a =  -114.29 *(cc.director.getWinSize().height/cc.director.getWinSize().width ) + 441.43

        var b = a + 50
        console.log(a,b)
        if (this.posx >= a && this.posx <=b)  this.right = true
		if (this.posx <= -a && this.posx >=-b) this.right = false
		if (this.right) this.posx-=speed*dt 
        else if (!this.right) this.posx+=speed*dt 


        
        
        var resume = function(){
            speed = t.lastSpeed
        }

        var pauseFunc = function(){
           // console.log("paused")
            t.lastSpeed = speed
            speed = 0 
        }
        var pause = cc.sequence(cc.callFunc(pauseFunc, t), cc.delayTime( cc.random0To1()*1.2) , cc.callFunc(resume, t)  ) 
        if(ctr % this.pT== 0   ) {
            this.node.runAction(pause)
            ctr+= parseInt(cc.rand%25)}
            

        }, dt );

       
        
        
        // var movement = cc.repeatForever(
        //     cc.sequence(
        //         cc.moveTo(speed , 180, this.node.position.y),
        //         cc.moveTo(speed , -180, this.node.position.y), 
        //     ) ) 

        // this.node.runAction(movement)
    },
    landed(){
        this.tagged = true
        
        if(this.rush) this.explode()
       // console.log('tagged')
    },
    explode(){
        var exploded = function(){
            
            this.node.destroy()
        }
        var boom = cc.sequence(
            cc.delayTime(5),
            cc.spawn(
                cc.scaleTo(0.5, 0,0),
                cc.tintTo(0.5, 100,100,100)
            ),
            cc.callFunc(exploded, this))
        this.node.runAction(boom)
    },

    start () {

    },

    // update (dt) {},
});
