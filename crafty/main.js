/**
 * User: Michael
 * Date: 5/7/12
 * Time: 5:21 PM
 */

window.onload = function() {
    //start crafty
    Crafty.init();
    Crafty.canvas.init();
    Crafty.background("white");

    Crafty.sprite(40, '../../images/dog_sprite_sheet.png', {
        dog: [0, 0]
    });

    Crafty.modules({ TiledLevel: 'dev-uncompressed', MoveTo: "dev-uncompressed"}, function(){

        Crafty.scene("main", function (){
            Craft.e("TiledLevel").tiledLevel("../maps/map.json", "Canvas");
        })


    });



    Crafty.scene('main');

};