
var socket;
var xRange;
var yRange;
var bullets = [];
var players2;
var userNameSubmitted = false;
var gameTime;

var walls = [];

function Wall (x, y, length, width){
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
}

function setup() {
    background(128, 128, 128);
    createCanvas(600, 600);
    frameRate(60);
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
                socket.emit('shoot', [mouseX - 300 + players2[socket.id].x, mouseY - 300 + players2[socket.id].y]);
            }
        }
    }

    for (var i = 0; i < bullets.length; i++){
        fill(255);
        ellipse(bullets[i].x - xRange, bullets[i].y - yRange, bullets[i].r);
    }

    for(var i =0; i <= walls.length - 1; i++ ){
        fill(105,105,105);
        rect(walls[i].x - xRange, walls[i].y- yRange, walls[i].length, walls[i].width);
    }

    line(width/2, height/2, mouseX, mouseY);
}

function showAll(players){
    background(128, 128, 128);
    xRange = players[socket.id].x - width/2;
    yRange = players[socket.id].y - height/2;
    players2 = players;


    for (let player in players){
        if (player != socket.id){
            fill(0);
            textAlign(CENTER);
            text(players[player].username, players[player].x - xRange, players[player].y - yRange - 50);
            textAlign(LEFT);
            fill(255);
            ellipse(players[player].x - xRange, players[player].y - yRange, 50, 50);
            fill(0);
            rect(players[player].x - xRange - 25, players[player].y - yRange - 40, 50, 10);
            fill(50,205,50);
            rect(players[player].x - xRange - 25, players[player].y - yRange - 40, 50*players[player].health/players[player].maxHealth, 10);
        }
        if (players[player].isReloading){
            fill(0);
            textAlign(CENTER);
            text("RELOADING", players[player].x - xRange, players[player].y - yRange - 80); 
            rect(players[player].x - xRange - 25, players[player].y - yRange - 75, 50, 10);
            fill(255);
            rect(players[player].x - xRange - 25, players[player].y - yRange - 75, 50*(gameTime - players[player].playerReloadingTime)/players[player].reloadTime, 10);
        }

    }
    fill(0);
    textAlign(CENTER);
    text(players[socket.id].username, width/2, height/2 - 50);
    textAlign(LEFT);
    fill(0,206,209);
    ellipse(width/2, height/2, 50, 50);
    fill(0);
    rect(width/2 - 100,  550 , 200, 20);
    fill(50,205,50);
    rect(width/2 - 100,  550, 200*players[socket.id].health/players[socket.id].maxHealth, 20);

    fill(0);
    textAlign(CENTER);
    textSize(20);
    text(players[socket.id].ammo+ "/" + players[socket.id].reserveAmmo, 500, 500);
    textSize(12);
    
}

// function simplifyBullets(){
//     for (var i = 0; i < bullets.length; i ++){
//         var simpleBullet = new SimpleBullet(bullets[i].pos.x, bullets[i].pos.y, bullets[i].r, bullets[i].shooter);
//         simpleBullets[i] = simpleBullet;
//     }
// }

function showAllBullets(allBullets){
    bullets = allBullets;
}

function trackTime(time){
    gameTime = time[0];
    walls = time[1];
}

function keyPressed(){
    if (userNameSubmitted){
        if (keyIsDown(82)){ // reload (r)
            socket.emit('reload', 1);
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

// function mousePressed(){
//     socket.emit('shoot', [mouseX - xRange, mouseY - yRange]);
// }