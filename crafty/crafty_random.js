window.onload = function() {
	//start crafty
Crafty.init();
Crafty.canvas.init();

    var tileSize = 64;
    var spriteSize = 40;
    var treeSize = 128;

    var xSize = 30;
    var ySize = 70;

    var rockDensity = 1;
    var treeDensity = 1;

	//turn the sprite map into usable components
	Crafty.sprite(tileSize, '../../../img/tiles/iso-64x64-outside.png', {
		grass1: [0, 0],
		grass2: [1, 0],
		grass3: [2, 0],
		grass4: [3, 0],
		rock: [0, 7],
		bush1: [0, 11],
		bush2: [9, 11],

        //tall trees, three tiles
        talltree0bottom: [0, 15],
        talltree0middle: [0, 14],
        talltree0top: [0, 13],
        talltree1bottom: [1, 15],
        talltree1middle: [1, 14],
        talltree1top: [1, 13],

        //trees, two tiles
        tree0bottom: [2, 13],
        tree0top: [2, 12],
        tree1bottom: [3, 13],
        tree1top: [3, 12]
	});

    Crafty.sprite(spriteSize, '../../../img/sprites/dog_sprite_sheet.png', {
        dog: [0, 0]
    });

    /*Crafty.sprit(treeSize, "images/tree_set.png", {
        tree0:[0,0]
    })*/

	//method to randomy generate the map
	function generateWorld() {
        var tree;
        iso = Crafty.isometric.size(tileSize);

		//generate the grass along the x-axis
		for (var i = 0; i < xSize; i++) {
			//generate the grass along the y-axis
			for (var j = 0; j < ySize; j++) {
				grassType = Crafty.math.randomInt(1, 4);

                var tile = Crafty.e('2D, Canvas, grass' + grassType)
					.attr({x: i * tileSize, y: j * tileSize});

                iso.place(i, j, 0, tile); //.place(x,y,z,tile)

				//Place Rocks
				if (i > 0 && i < xSize && j > 0 && j < ySize && Crafty.math.randomInt(0, 50) > (50 - rockDensity)) {
                    tile = Crafty.e('2D, DOM, rock, solid')
                        .attr({x: i * tileSize, y: j * tileSize});
                    iso.place(i, j, 0, tile);
                    continue;
                }

                //Place trees
                if (i > 0 && i < xSize && j > 0 && j < ySize && Crafty.math.randomInt(0, 50) > (50 - treeDensity)) {

                    tree = Crafty.math.randomInt(0, 1);
                    iso.place(i, j - 4, 0, Crafty.e('2D, DOM, tree' + tree + 'top, solid')
                        .attr({x:i * tileSize, y:j * tileSize}));
                    iso.place(i, j, 0, Crafty.e('2D, DOM, tree' + tree + 'bottom, solid')
                        .attr({x:i * tileSize, y:j * tileSize}));

                    continue;
                }

                //Place tall trees
                if (i > 0 && i < xSize && j > 0 && j < ySize && Crafty.math.randomInt(0, 50) > (50 - treeDensity)) {
                    tree = Crafty.math.randomInt(0, 1);
                    iso.place(i, j - 8, 0, Crafty.e('2D, DOM, talltree' + tree + 'top, solid')
                        .attr({x: i * tileSize, y: j * tileSize}));
                    iso.place(i, j - 4, 0, Crafty.e('2D, DOM, talltree' + tree + 'middle, solid')
                        .attr({x: i * tileSize, y: j * tileSize}));
                    iso.place(i, j, 0, Crafty.e('2D, DOM, talltree' + tree + 'bottom, solid')
                        .attr({x: i * tileSize, y: j * tileSize}));
                }

			}
		}
	}

	//the loading screen that will display while our assets load
	Crafty.scene('loading', function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(['../../../img/tiles/iso-64x64-outside.png'], function() {
			Crafty.scene('main'); //when everything is loaded, run the main scene
		});

		//black background with some loading text
		Crafty.background('#008055');
		Crafty.e('2D, DOM, Text').attr({w: 100, h: 20, x: 150, y: 120})
			.text('Loading')
			.css({'text-align': 'center'});
	});

	//automatically play the loading scene
	Crafty.scene('loading');

	Crafty.scene('main', function() {
		generateWorld();

		Crafty.c('Hero', {
			init: function() {
					//setup animations
					this.requires('SpriteAnimation, Collision')
                        /*.animate(string reelID, number fromX, number y, number toX
                        reelId       ID of the animation reel being created
                        fromX        Starting x position (in the unit of sprite horizontal size) on the sprite map
                        y            y position on the sprite map (in the unit of sprite vertical size). Remains constant through the animation.
                        toX          End x position on the sprite map (in the unit of sprite horizontal size)
                        */

					.animate('walk_left', 0, 1, 2) //6, 3, 8)
					.animate('walk_right', 0, 2, 2) //9, 3, 11)
					.animate('walk_up', 0, 3, 2)//3, 3, 5)
					.animate('walk_down', 0, 0, 2)//0, 3, 2)
					//change direction when a direction change event is received
					.bind('NewDirection',
						function(direction) {
							if (direction.x < 0) {
								if (!this.isPlaying('walk_left'))
									this.stop().animate('walk_left', 10, -1);
							}
							if (direction.x > 0) {
								if (!this.isPlaying('walk_right'))
									this.stop().animate('walk_right', 10, -1);
							}
							if (direction.y < 0) {
								if (!this.isPlaying('walk_up'))
									this.stop().animate('walk_up', 10, -1);
							}
							if (direction.y > 0) {
								if (!this.isPlaying('walk_down'))
									this.stop().animate('walk_down', 10, -1);
							}
							if (!direction.x && !direction.y) {
								this.stop();
							}
					})
					// A rudimentary way to prevent the user from passing solid areas
					.bind('Moved', function(from) {
						if (this.hit('solid')) {
							this.attr({x: from.x, y: from.y});
						}
					});
				return this;
			}
		});

		Crafty.c('RightControls', {
			init: function() {
				this.requires('Multiway');
			},

			rightControls: function(speed) {
				this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
				return this;
			}

		});

		//create our player entity with some premade components
		player = Crafty.e('2D, Canvas, dog, RightControls, Hero, Animate, Collision')
			.attr({x: 160, y: 144, z: 1})
			.rightControls(1);
	});
};
