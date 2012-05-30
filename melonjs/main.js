/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources = [
	// map tileset
    {name: "iso-64x64-outside", type:"image",   src:"../img/tiles/iso-64x64-outside.png"},
    {name: "collision",         type:"image",   src:"../img/tiles/collision.png"},
	// map
    {name: "map",               type: "tmx",    src: "../scr/maps/map.tmx"},
	// the main player spritesheet
	{name: "dog",               type: "image",	src: "../img/sprites/dog_sprite_horizontal.png"}
];


var jsApp	=
{
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		// init the video
		if (!me.video.init('jsapp', 800, 480))
		{
			alert("Sorry but your browser does not support HTML5 canvas. Please try with another one!");
			return;
		}

		// initialize the "audio"
        //me.audio.init("mp3,ogg");

		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},

	loaded: function ()
	{
      
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());

		// add our player entity in the entity pool
		me.entityPool.add("mainPlayer", PlayerEntity);

		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,		"left");
		me.input.bindKey(me.input.KEY.RIGHT,	"right");
        me.input.bindKey(me.input.KEY.UP,       "up");
        me.input.bindKey(me.input.KEY.DOWN,     "down");

        //me.debug.renderHitBox = true;
      
		// start the game 
        me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

	onResetEvent: function()
	{	
		// load a level
		me.levelDirector.loadLevel("map");

	},

	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{  

   }

});

var PlayerEntity = me.ObjectEntity.extend(
{
    /* -----

     constructor

     ------			*/
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);

        // set the walking speed
        this.setVelocity(2, 2);

        this.setFriction(0.2, 0.2);

        // disable gravity
        this.gravity = 0;

        this.firstUpdates = 2;
        this.direction = 'down';
        this.destinationX = x;
        this.destinationY = y;

        this.addAnimation("stand-down", [1]);
        this.addAnimation("stand-left", [4]);
        this.addAnimation("stand-up", [10]);
        this.addAnimation("stand-right", [7]);
        this.addAnimation("down", [0,1,2]);
        this.addAnimation("left", [3,4,5]);
        this.addAnimation("up", [9,10,11]);
        this.addAnimation("right", [6,7,8]);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },

    update: function() {
        hadSpeed = this.vel.y !== 0 || this.vel.x !== 0;

        this.handleInput();

        // check & update player movement
        updated = this.updateMovement();

        if (this.vel.y === 0 && this.vel.x === 0)
        {
            this.setCurrentAnimation('stand-' + this.direction)
            if (hadSpeed) {
                updated = true;
            }
        }

        // update animation
        if (updated)
        {
            // update object animation
            this.parent(this);
        }
        return updated;
    },

    handleInput: function()
    {
        if (me.input.isKeyPressed('left'))
        {
            this.updateColRect(5,30, 17, 20);
            this.vel.x -= this.accel.x * me.timer.tick;
            this.setCurrentAnimation('left');
            this.direction = 'left';
        }
        else if (me.input.isKeyPressed('right'))
        {
            this.updateColRect(5,30, 17, 20);
            this.vel.x += this.accel.x * me.timer.tick;
            this.setCurrentAnimation('right');
            this.direction = 'right';

        }

        if (me.input.isKeyPressed('up'))
        {
            this.updateColRect(13,15, 17, 20);
            this.vel.y = -this.accel.y * me.timer.tick;
            this.setCurrentAnimation('up');
            this.direction = 'up';
        }
        else if (me.input.isKeyPressed('down'))
        {
            this.updateColRect(13,15, 17, 20);
            this.vel.y = this.accel.y * me.timer.tick;
            this.setCurrentAnimation('down');
            this.direction = 'down';
        }

    }
});

//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
