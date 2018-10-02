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
        part:cc.Node

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
        this.part.setLocalZOrder(-4)
         
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

        if(  (globals.playerHeight)-6>= this.height && globals.playerHeight!= undefined) {this.node.destroy()

            console.log("destroyed self")}
 

        this.node.position =  cc.v2(this.posx , this.node.position.y) 
            // if( cc.director.getWinSize().height/cc.director.getWinSize().width <= 1.34     )  
        var a =  -114.29 *(cc.director.getWinSize().height/cc.director.getWinSize().width ) + 441.43

        var b = a + 200
        if (this.posx >= a && this.posx <=b)  this.right = true
        if (this.posx <= -a && this.posx >=-b) this.right = false
        if(this.canCall&& this.type == "aberrant")this.stopTimer(0.5 + cc.random0To1()*2 )
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
            },0,0 , 0.7 + cc.random0To1()*1.5);
    },
     



});
