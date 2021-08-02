var socket;
var xRange;
var yRange;
var bullets = [];
var items = [];
var players2;
var userNameSubmitted = false;
var gameTime;
var timeSinceStart = 0;

var walls = []

function Wall (x, y, length, width){
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
}

function setup() {
    background(128, 128, 128);
    createCanvas(1200, 600);
    frameRate(144);
    socket = io.connect('');

    socket.on('gameStart',startGame);

    $(document).ready(function() {
        //username modal start     
        $('#myModal').appendTo('body').modal('show');
        $('#myModal').on('hidden.bs.modal',function(){
            socket.emit('username',[$('#userName').val(), $("input[type='radio'][name='class']:checked").val()]);
            userNameSubmitted = true;
        });
        $('#theButton').click(function() {
            socket.emit('username',[$('#userName').val(), $("input[type='radio'][name='class']:checked").val()]);
            userNameSubmitted = true;
        });
        //username modal end
    
        //focus on the textbox
        $("#myModal").on('shown.bs.modal', function(){
            $(this).find('#userName').focus();
        });
    
        //when you press enter, closes the modal
        $(document).keypress(function(e) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                if($('#myModal').is(':visible')){
                    socket.emit('username',[$('#userName').val(), $("input[type='radio'][name='class']:checked").val()]);
                    $("#myModal").removeClass("in");
                    $(".modal-backdrop").remove();
                    $("#myModal").hide();
                    userNameSubmitted = true;
                }  
            }
        });
    });
}


function draw() {
    if(userNameSubmitted){
        for (var i = 0; i < bullets.length; i++){
            fill(255);
            ellipse(bullets[i].x - xRange, bullets[i].y - yRange, bullets[i].r);
        }
    
        for(var i =0; i < walls.length; i++ ){
            fill(105,105,105);
            rect(walls[i].x - xRange, walls[i].y- yRange, walls[i].length, walls[i].width);
        }

        for(var i =0; i < items.length; i++ ){
            if (items[i].type == "weapon"){
                fill(252, 36, 3);
            } else if (items[i].type == "utility"){
                fill(32,178,170);
            }
            rect(items[i].x - xRange, items[i].y- yRange, items[i].length, items[i].width);
        }

        if(players2 != null){
            if (keyIsDown(87)){ // up (w)
                socket.emit('move', 'up');
            }
            if (keyIsDown(83)){ // down (s)
                socket.emit('move', 'down');
            }
            if (keyIsDown(65)){ // left (a)
                socket.emit('move', 'left');
            }
            if (keyIsDown(68)){ // right (d)
                socket.emit('move', 'right');
            }

            if (mouseIsPressed){
                if (players2[socket.id] != undefined){
                    socket.emit('shoot', [mouseX - 600 + players2[socket.id].x, mouseY - 300 + players2[socket.id].y]);
                }
            }
            // players
            for (let player in players2){
                if (player != socket.id){
                    fill(0);
                    textAlign(CENTER);
                    text(players2[player].username, players2[player].x - xRange, players2[player].y - yRange - 50);
                    textAlign(LEFT);
                    if (players2[player].team == "human"){
                        fill(173,216,230);
                    } else {
                        fill(152,251,152);
                    }
                    ellipse(players2[player].x - xRange, players2[player].y - yRange, players2[player].r, players2[player].r);
                    fill(0);
                    rect(players2[player].x - xRange - 25, players2[player].y - yRange - 40, 50, 10);
                    fill(50,205,50);
                    rect(players2[player].x - xRange - 25, players2[player].y - yRange - 40, 50*players2[player].health/players2[player].maxHealth, 10);
                }
                if (players2[player].isReloading){
                    fill(0);
                    textAlign(CENTER);
                    text("RELOADING", players2[player].x - xRange, players2[player].y - yRange - 80); 
                    rect(players2[player].x - xRange - 25, players2[player].y - yRange - 75, 50, 10);
                    fill(255);
                    rect(players2[player].x - xRange - 25, players2[player].y - yRange - 75, 50*(gameTime - players2[player].playerReloadingTime)/players2[player].reloadTime, 10);
                }
            }

            if (players2[socket.id] != undefined){
                // power and lighting here:
                if (players2[socket.id].powerUsage == "Off"){
                    fill(0);
                    rect(0, 0, 1200, 200);
                    rect(0, 0, 400, 600);
                    rect(800, 0, 400, 600);
                    rect(0, 400, 1200, 200);
                } else if (players2[socket.id].powerUsage == "Low") {
                    fill(0);
                    rect(0, 0, 1200, 150);
                    rect(0, 0, 300, 600);
                    rect(900, 0, 300, 600);
                    rect(0, 450, 1200, 150);
                }
                else if (players2[socket.id].powerUsage == "Medium") {
                    fill(0);
                    rect(0, 0, 1200, 100);
                    rect(0, 0, 200, 600);
                    rect(1000, 0, 200, 600);
                    rect(0, 500, 1200, 100);
                } else if (players2[socket.id].powerUsage == "High") {
                    fill(0);
                    rect(0, 0, 1200, 50);
                    rect(0, 0, 100, 600);
                    rect(1100, 0, 100, 600);
                    rect(0, 550, 1200, 50);
                }

                // more hud
                textAlign(CENTER);
                fill(255);
                textSize(20);
                text("Battery: " + Math.round(players2[socket.id].power) + "%", 200, 500);
                textSize(20);
                text("Usage: " + players2[socket.id].powerUsage, 200, 530);

                // draw player
                fill(0);
                textAlign(CENTER);
                textSize(12);
                text(players2[socket.id].username, width/2, height/2 - 50);
                textAlign(LEFT);
                if (players2[socket.id].team == "human"){
                    fill(0,206,209);
                } else {
                    fill(0,128,0);
                }
                ellipse(width/2, height/2, 50, 50);
                fill(0);
                rect(players2[socket.id].x - xRange - 25, players2[socket.id].y - yRange - 40, 50, 10);
                fill(50,205,50);
                rect(players2[socket.id].x - xRange - 25, players2[socket.id].y - yRange - 40, 50*players2[socket.id].health/players2[socket.id].maxHealth, 10);
            
                //HUD
                fill(255);
                textAlign(CENTER);
                textSize(25);
                text(players2[socket.id].weaponName, 1000, 470);
                textSize(20);
                text(players2[socket.id].ammo+ "/" + players2[socket.id].reserveAmmo, 1000, 500);

                if (players2[socket.id].canPickup != "none" && players2[socket.id].team != "alien"){
                    text("Press E to pick up " + players2[socket.id].canPickup, 600, 500);
                } else if (players2[socket.id].canOpen == true){
                    text("Press F to open", 600, 520);
                }

                // INSTRUCTIONS FOR HUMANS AND ALIENS
                fill(255);
                textAlign(CENTER);
                textSize(20);
                if (players2[socket.id].team == "human"){
                    text("You are Human", 600, 30);
                    textSize(15);
                    text("Survive until extraction", 600, 50);
                } else if (players2[socket.id].team == "alien"){
                    fill(128, 0, 0);
                    text("You are Alien", 600, 30);
                    textSize(15);
                    text("Hunt the Humans", 600, 50);
                }

                textSize(20);
                text("Extraction: " + Math.round(300 - timeSinceStart/1000) + "s", 200, 50);
                
                textSize(12);
            }
        }
    }
}

function showAll(players){
    background(128, 128, 128);
    players2 = players;
    if (players[socket.id] != undefined){
        xRange = players[socket.id].x - width/2;
        yRange = players[socket.id].y - height/2;
    }
}

function showAllBullets(allBullets){
    bullets = allBullets;
}

function trackTime(time){
    gameTime = time[0];
    walls = time[1];
    items = time[2];
    timeSinceStart = time[3];
}

function keyPressed(){
    if (userNameSubmitted){
        if (keyIsDown(82)){ // reload (r)
            socket.emit('reload', 1);
        } else if (keyIsDown(69) && players2[socket.id].team != "alien"){ // pickup (e)
            socket.emit('pickup', 1);
        } else if (keyIsDown(67)){ // switch power usage (c)
            socket.emit('switchPower', 1);
        } else if (keyIsDown(70)){ // open doors (f)
            socket.emit('openDoor', 1);
        }
    }
}

function startGame(){
    socket.on('update', showAll);
    socket.on('updateTime', trackTime);
    socket.on('bulletUpdate', showAllBullets);
    socket.on('dead', function(){
        userNameSubmitted = false;
    })
}