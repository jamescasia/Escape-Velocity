var vertShader =
`
attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;
varying vec2 v_texCoord;
varying vec4 v_fragmentColor;
void main()
{
    gl_Position = ( CC_PMatrix ) * a_position;
    v_fragmentColor = a_color;
    v_texCoord = a_texCoord;
}
`

var fragShader =
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float widthStep;
uniform float heightStep;
uniform float strength;
const float blurRadius = 3.0;
const float blurPixels = (blurRadius * 2.0 + 1.0) * (blurRadius * 2.0 + 1.0);
void main()
{
	vec4 texColor = texture2D(CC_Texture0, v_texCoord);
	float outlineAlpha = 0.0;
	for(float fy = -blurRadius; fy <= blurRadius; ++fy)
    {
        for(float fx = -blurRadius; fx <= blurRadius; ++fx)
        {
            vec2 coord = vec2(fx * widthStep, fy * heightStep);
            vec4 sample = texture2D(CC_Texture0, v_texCoord + coord);  
			outlineAlpha += sample.a;
        }
    }
	outlineAlpha = 1.0 - pow(1.0 - outlineAlpha * 2.0 / blurPixels, strength);
	outlineAlpha -= texColor.a * 2.0;
	outlineAlpha = clamp(outlineAlpha, 0.0, 1.0);
	vec4 outlineColor = vec4(0.4, 0.9, 0.4, 1.0);
	vec4 res = mix(texColor, outlineColor, outlineAlpha);
	if(texColor.a <= 0.0) {
		res = vec4(outlineColor.rgb, outlineAlpha);
	}
	gl_FragColor = res;
}
`

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
		if(!cc.webglContext) {
			console.log('Canvas mode: no shaders!;');
			return;
		}

		var program = new cc.GLProgram();
 		program.initWithVertexShaderByteArray(vertShader, fragShader);
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
		program.link();
		program.updateUniforms();
		this._program = program;

		this._uniWidthStep = this._program.getUniformLocationForName( "widthStep" );
        this._uniHeightStep = this._program.getUniformLocationForName( "heightStep" );
        this._uniStrength = this._program.getUniformLocationForName( "strength" );
        console.log( this.node.getComponent(cc.Sprite).spriteFrame._texture)
		var textureSize = this.node.getComponent(cc.Sprite).spriteFrame._texture 
		this._program.setUniformLocationWith1f( this._uniWidthStep, ( 1.0 / textureSize.width ) );
    	this._program.setUniformLocationWith1f( this._uniHeightStep, ( 1.0 / textureSize.height ) );
		this._program.setUniformLocationWith1f( this._uniStrength, 1.0 );

		this.setProgram(this.node._sgNode, this._program);

		this.strength = 9.0;
		this.ds = 9;
		cc.sh = this;
    },

	setProgram : function (node, program) {
		if (cc.sys.isNative) {
			var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
			node.setGLProgramState(glProgram_state);
		}else{
			node.setShaderProgram(program);    
		}        

		var children = node.children;
		if (!children)
			return;

		for (var i = 0; i < children.length; i++)
			this.setProgram(children[i], program);
	},    

	update : function(dt) {
		if(this._program) {			
			this._program.use();
			this.strength += this.ds * dt;
			if(this.strength > 9 || this.strength < 0) {
				this.ds *= -1;
			}
			this._program.setUniformLocationWith1f(this._uniStrength, Math.min(9, Math.max(0, this.strength)));
			this._program.updateUniforms();
		}
	}
});