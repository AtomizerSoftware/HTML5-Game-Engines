window.onload = function () {
//start crafty
    Crafty.init(960, 640);
    Crafty.canvas.init();

    Crafty.sprite(32, "images/units/redArcherRunning.png", {
        redrunE: [0, 0],
        redrunN: [1, 0],
        redrunNE: [2, 0],
        redrunNW: [3, 0],
        redrunS: [4, 0],
        redrunSE: [5, 0],
        redrunSW: [6, 0],
        redrunW: [7, 0]
    });

    Crafty.sprite(500, "images/radius200.png", {
        radius: [0, 0]
    });


    Crafty.modules({ TiledLevel: 'dev-uncompressed', MoveTo: "dev-uncompressed" }, function () {
//modules ready

        Crafty.scene("Game", function () {
            Crafty.e("TiledLevel").tiledLevel("map.json");

            Crafty.e("redrunE, Unit, MoveTo").attr({ x: 32 - 16, y: 232 - 16 })

            Crafty.e("redrunE, Unit, MoveTo").attr({ x: 320, y: 20 })
            Crafty.e("redrunE, Unit, MoveTo").attr({ x: 320, y: 120 })
            Crafty.e("redrunE, Unit, MoveTo").attr({ x: 320, y: 220 })
            Crafty.e("redrunE, Unit, MoveTo").attr({ x: 320, y: 320 })
            Crafty.e("redrunE, Unit, MoveTo").attr({ x: 220, y: 20 })

            Crafty.e("EndRound").attr({ x: 850, y: 10 });

        });

//
// Components
//
        Crafty.c("Unit", {
            init: function () {
                this.requires("SpriteAnimation, 2D, DOM, Solid, AttackRange, Mouse, Collision")
// .collision()
                    .bind('Moved', function (from) {
                        if (this.hit('Solid')) {
                            this.attr({ x: from.x, y: from.y });
                        }
                        this.updateRangeVisual();
                    })
                    .bind("Click", function () {
                        Crafty.trigger("Selected", false);
                        this.trigger("Selected", true);
                    })
                    .bind("EndRound", function () {
                        this.disableControls = false;
                    })
                    .bind("StartRound", function () {
                        this.disableControls = true;
                    })
                    .animate("walk_left", 0, 7, 7)
                    .animate("walk_right", 0, 0, 7)
                    .animate("walk_up", 0, 1, 7)
                    .animate("walk_down", 0, 4, 7)
//change direction when a direction change event is received
                    .bind("NewDirection",
                    function (direction) {
                        if (direction.x < 0) {
                            if (!this.isPlaying("walk_left"))
                                this.stop().animate("walk_left", 10, -1);
                        }
                        if (direction.x > 0) {
                            if (!this.isPlaying("walk_right"))
                                this.stop().animate("walk_right", 10, -1);
                        }
                        if (direction.y < 0) {
                            if (!this.isPlaying("walk_up"))
                                this.stop().animate("walk_up", 10, -1);
                        }
                        if (direction.y > 0) {
                            if (!this.isPlaying("walk_down"))
                                this.stop().animate("walk_down", 10, -1);
                        }
                        if (!direction.x && !direction.y) {
                            this.stop();
                        }
                    })
                    .bind("Selected", function (selected) {
                        this.disregardMouseInput = !selected;
                    })
// Note: Needed to pass through narow passages. For this to work, this component (Unit) must be added after the sprite.
                    .attr({ w: 28, h: 28 })
                    .attr({ disableControls: true, disregardMouseInput: true });

            }
        });


        Crafty.c("AttackRange", {
            rangeVisualiser: null,

            _updateRotation: function () {
                this.rangeVisualiser.origin("bottom left");
                this.rangeVisualiser.attr({ rotation: Crafty.math.radToDeg(Math.atan2(-200 - this.rangeVisualiser.y + Crafty.mousePos.y, -this.rangeVisualiser.x + Crafty.mousePos.x)) + 45 });
            },

            init: function () {
                this.rangeVisualiser = Crafty.e("2D, DOM, radius")
                    .origin("bottom left")
                    .attr({ w: 200, h: 200, visible: false });
                this.updateRangeVisual();

                this.bind("Selected", function (selected) {
                    this.rangeVisualiser.attr({ visible: selected || this._target });
                    if (selected) {
                        this.updateRangeVisual();
                        this.bind("EnterFrame", this._updateRotation);
                    } else {
                        this.unbind("EnterFrame", this._updateRotation);
                    }
                })
                    .bind("NewDirection", function () {
                        this.trigger("Selected", false);
                    })
            },

            updateRangeVisual: function () {
                this.rangeVisualiser.attr({ x: this.x + this.w / 2, y: this.y - 200 + this.w / 2 });
            }
        })

        Crafty.c("Solid", {
            init: function () {
                if (!this.has("Unit")) {
                    this.requires("Color").color("red");
                }
            }
        });

        Crafty.c("EndRound", {
            init: function () {
                this.requires("2D, DOM, Mouse, Color")
                    .color("blue")
                    .attr({ w: 100, h: 40 })
                    .bind("Click", function () {
                        Crafty.trigger("EndRound");
                        this.attr({ visible: false });
                        this.delay(function () { Crafty.trigger("StartRound"); this.attr({ visible: true}); }, 2000);

                    });
            }
        })


        Crafty.scene("Game");
    });
};
