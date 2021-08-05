
var socket;
var xRange;
var yRange;
var bullets = [];
var items = [];
var entities = [];
var deadBodies = [];
var players2;
var userNameSubmitted = false;
var gameTime;
var timeSinceStart = 0;
var winners;
var playerCount;
var survivorCount;
var generatorCount;
var currentEvent = "";


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
    
        for(var i =0; i < walls.length; i++ ){
            if (walls[i].type == "door"){
                fill(139,0,0);
            } else {    
                fill(105,105,105);
            }
            rect(walls[i].x - xRange, walls[i].y- yRange, walls[i].length, walls[i].width);
        }

        // fill(0);
        // rect(-500, -500, 5000, 400);
        // rect(-500, -500, 400, 500);
        // rect(-500, 2400, 5000, 400);
        // rect(3900, -500, 400, 5000);
        

        for(var i =0; i < items.length; i++ ){
            if (items[i].type == "weapon"){
                fill(252, 36, 3);
            } else if (items[i].type == "utility"){
                fill(32,178,170);
            }
            rect(items[i].x - xRange, items[i].y- yRange, items[i].length, items[i].width);
        }

        for(var i =0; i < entities.length; i++ ){
            if (entities[i].colour == "blue"){
                fill(65,105,225);
            } else if (entities[i].colour == "green"){
                fill(50,205,50);
            } else if (entities[i].colour == "red"){
                fill(128, 0 ,0);
            }
            rect(entities[i].x - xRange, entities[i].y- yRange, entities[i].length, entities[i].width);
            fill (0);
            textSize(20);
            textAlign(CENTER);
            text(entities[i].name, entities[i].x - xRange + entities[i].length/2, entities[i].y- yRange - 30);
            textSize(12);
        }

        for(var i =0; i < deadBodies.length; i++ ){
            fill(128, 0, 0);
            ellipse(deadBodies[i].x - xRange, deadBodies[i].y- yRange, deadBodies[i].radius, deadBodies[i].radius);
            textSize(12);
            text(deadBodies[i].name, deadBodies[i].x - xRange, deadBodies[i].y - 50- yRange);
        }

        for (var i = 0; i < bullets.length; i++){
            fill(255);
            ellipse(bullets[i].x - xRange, bullets[i].y - yRange, bullets[i].r);
        }

        if(players2 != null){
            if (keyIsDown(87)){ // up (w)
                socket.emit('moveY', 'up');
            }
            if (keyIsDown(83)){ // down (s)
                socket.emit('moveY', 'down');
            }
            if (keyIsDown(65)){ // left (a)
                socket.emit('moveX', 'left');
            }
            if (keyIsDown(68)){ // right (d)
                socket.emit('moveX', 'right');
            }

            if (mouseIsPressed){
                if (players2[socket.id] != undefined){
                    socket.emit('shoot', [mouseX - 600 + players2[socket.id].x, mouseY - 300 + players2[socket.id].y]);
                    console.log(mouseX - 600 + players2[socket.id].x, mouseY - 300 + players2[socket.id].y);
                }
            }
            // players
            for (let player in players2){
                if (player != socket.id && players2[player].team != "Ghost"){
                    fill(0);
                    textAlign(CENTER);
                    //text(players2[player].username, players2[player].x - xRange, players2[player].y - yRange - 50);
                    textAlign(LEFT);
                    // fill colour of players
                    if (players2[player].team == "Rescue Officer"){
                        fill(0,0,139);
                    } 
                    else if (players2[player].team == "Alien"){
                        fill (0, 100, 0);
                    } else if (players2[player].team == "Insurgent" && (players2[socket.id].team == "Insurgent" || players2[socket.id].team == "Insurgent Officer")){
                        fill (200, 20, 20)
                    } else if (players2[player].team == "Insurgent Officer"){
                        fill (250, 20, 20)
                    }
                    else {
                        fill(173,216,230);
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
                //text(players2[socket.id].username, width/2, height/2 - 50);
                textAlign(LEFT);
                // Fill the player colour
                if (players2[socket.id].team == "Ghost"){
                    fill(255);
                } else if (players2[socket.id].team == "Rescue Officer"){
                    fill(25,25,112);
                } else if (players2[socket.id].team == "Alien"){
                    fill(0,128,0);
                } else if (players2[socket.id].team == "Insurgent" ||players2[socket.id].team == "Insurgent Officer"){
                    fill(200, 20, 20);
                }
                else {
                    fill(0,206,209);
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

                if (players2[socket.id].canPickup != "none"){
                    text("Press E to pick up " + players2[socket.id].canPickup, 600, 500);
                } else if (players2[socket.id].canOpen == true){
                    text("Press E to open", 600, 500);
                } else if (players2[socket.id].canUse == true){
                    text("Press E to use", 600, 500);
                }

                // INSTRUCTIONS FOR HUMANS AND ALIENS
                fill(255);
                textAlign(CENTER);
                textSize(20);
                text("Team: " + players2[socket.id].team, 600, 30);
                textSize(15);
                if (players2[socket.id].team == "Undecided"){
                    text("Awaiting more players", 600, 50);
                } else if (players2[socket.id].team == "Survivor"){
                    text("Survive", 600, 50);
                } else if (players2[socket.id].team == "Insurgent"){
                    text("Kill all Survivors", 600, 50);
                } else if (players2[socket.id].team == "Insurgent Officer"){
                    text("Kill all Survivors", 600, 50);
                } else if (players2[socket.id].team == "Rescue Officer"){
                    text("Kill all Insurgents", 600, 50);
                } else if (players2[socket.id].team == "Alien"){
                    text("Convert all Humans", 600, 50);
                }
                textSize(15);
                text("Players Alive: " + playerCount, 200, 70);
                text("Survivors Alive: " + survivorCount, 200, 90);

                textSize(20);
                text("Generators: " + generatorCount + "/4", 1000, 70);
                


                textSize(20);
                if (timeSinceStart < 10*1000 && currentEvent == "No Event"){
                    text("Game will start in: " + Math.round(10 - timeSinceStart/1000) + "s", 200, 50);
                } else if (Math.round(timeSinceStart/1000) < 80){
                    text("Time Until Event: " + Math.round(60 - timeSinceStart/1000) + "s", 200, 50);
                }
                
                text("Event: " + currentEvent, 200, 25);

                fill(0);
                if (winners == "Survivors"){
                    text("Game Over. Survivors Win", 600, 300);
                } else if (winners == "Insurgents"){
                    text("Game Over. Insurgents Win", 600, 300);
                }

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
    winners = time[4];
    playerCount = time[5];
    entities = time[6];
    deadBodies = time[7];
    survivorCount = time[8];
    generatorCount = time[9];
    currentEvent = time[10];
}

function keyPressed(){
    if (userNameSubmitted){
        if (keyIsDown(82)){ // reload (r)
            socket.emit('reload', 1);
        } else if (keyIsDown(69)){ // pickup (e)
            socket.emit('pickup', 1);
        } else if (keyIsDown(67)){ // switch power usage (c)
            socket.emit('switchPower', 1);
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