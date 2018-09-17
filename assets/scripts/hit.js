// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        collider:null, 
        player:cc.Node
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

    // onLoad () {},

    start () {

    },
    onCollisionEnter: function (other, self) { 

        this.player.getComponent("player").hit(other)
        this.collider = other
    
        // Collider Manager will calculate the value in world coordinate system, and put them into the world property
        var world = self.world;
    
        // Collider Component aabb bounding box
        var aabb = world.aabb;
    
        // The position of the aabb collision frame before the node collision
        var preAabb = world.preAabb;
    
        // world transform
        var t = world.transform;
    
        // Circle Collider Component world properties
        var r = world.radius;
        var p = world.position;
    
        // Rect and Polygon Collider Component world properties
        var ps = world.points;
    },

    // update (dt) {},
});
