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
        type:"",
        posx:0,
        right:false,
        lastSpeed:0,
        tagged:false,
        rush:false,
        height:null, 
        pT:0, 
        namae:null,
        stop:false,
        canCall:true, 
        part:cc.Node,
        pla1: cc.SpriteFrame,
        pla2: cc.SpriteFrame,
        pla3: cc.SpriteFrame,
        pla4: cc.SpriteFrame,
        pla5: cc.SpriteFrame,
        pla6: cc.SpriteFrame,
        pla7: cc.SpriteFrame,
        pla8: cc.SpriteFrame,
        planetDb:[],
        a:0,
        b:0


    
    },

    // LIFE-CYCLE CALLBACKS:
    setID(id){
 
    },



    onLoad () {
        this.a = -114.29 *(cc.director.getWinSize().height/cc.director.getWinSize().width ) + 435
        this.b = this.a + 200
        console.log(globals.planetCount , "um of planets")
        this.planetDb = [this.pla1, this.pla2, this.pla3,this.pla4,this.pla5, this.pla6, this.pla7, this.pla8] 
        var pool =0
        console.log("height",globals.planetCount)
        if(globals.planetCount <=20 ) {pool =    ((0.35* globals.planetCount) + 1 )
        if(pool - Math.floor(pool) >= 0.5) pool = Math.ceil(pool)
        else pool = Math.floor(pool)

        }
        else pool = 8
        
        var pla = parseInt(cc.rand())%pool
        console.log("Random max",pool,"resultant planet", pla)
        this.node.getComponent(cc.Sprite).spriteFrame =  this.planetDb[pla]

        this.part.setLocalZOrder(-4)
        var a =  -114.29 *(cc.director.getWinSize().height/cc.director.getWinSize().width ) + 441.43 
        
         
        var dt = 1/80
        this. speed = 200 + cc.random0To1()*500
           
        var t = this
        var ctr = 0
        this.height = parseInt(this.node.y )/440
 
       
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

    update (dt) { 
        

        if(  (globals.playerHeight)-8>= this.height && globals.playerHeight!= undefined&& this.height >1) {
            globals.planetCount-=1
            this.node.destroy()
             }
 

        this.node.position =  cc.v2(this.posx , this.node.position.y) 
            // if( cc.director.getWinSize().height/cc.director.getWinSize().width <= 1.34     )  
        
        if (this.posx >= this.a  )  this.right = true
        if (this.posx <= -this.a  ) this.right = false
        if(this.canCall&& this.type == "aberrant")this.stopTimer(1 + cc.random0To1()*1.3 )
        if(!this.stop) {
		if (this.right) this.posx-=this.speed*dt 
        else if (!this.right) this.posx+=this.speed*dt }

    },
    stopTimer(dur){
        this.stop = true
        this.canCall = false

        var time = this.schedule(function() {  
                 
            this.stop = false
            this.callTime()
        
            },0,0 , dur);
    },
    callTime(){

        var time = this.schedule(function() {   
            this.canCall = true
            },0,0 , 1 + cc.random0To1() );
    },
     



});
