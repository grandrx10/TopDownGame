var socket;
var xRange;
var yRange;
var bullets = [];
var simpleBullets = [];
var players2;
var userNameSubmitted = false;
var walls = [new Wall(200, 200, 100, 100) , new Wall(500, 200, 20, 100)];
walls.push(new Wall(-100, -100, 10000, 100));
walls.push(new Wall(-100, -100, 100, 10000));


function Bullet(x,y,vel,shooter) {
    this.pos = createVector(x,y);
    this.r = 5;
    this.vel = vel; // check this
    this.shooter = shooter;

    this.update = function() {
        this.pos.add(this.vel);
    }
}

function Wall (x, y, length, width){
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
}

function SimpleBullet (x, y, r, shooter){ 
    this.x = x;
    this.y = y;
    this.r = r;
    this.shooter = shooter;
}

function setup() {
    background(128, 128, 128);
    createCanvas(600, 600);
    frameRate(60);
    socket = io.connect('');

    socket.on('gameStart',startGame);

    socket.on('shootBullet', function(){
        var newBullet = new Bullet (players2[socket.id].x, players2[socket.id].y, 
            createVector(mouseX-width/2 + (Math.random() * 2 - 1) * players2[socket.id].weapon.inaccuracy, 
            mouseY-height/2 + (Math.random() * 2 - 1) * players2[socket.id].weapon.inaccuracy).setMag(10),socket.id)
        bullets.push(newBullet);
    });
    socket.on('removeBullets', removeBullets);

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
        
            // automatic fire
            if (mouseIsPressed){
                mouseDown = true;
            } else {
                mouseDown = false;
            }
        
            if (mouseDown){
                //pass to server
                // console.log(players2[socket.id].weapon);
                if (players2[socket.id].weapon.ammo >= 1){
                    //don't shoot right away
                    //send to server to check if you should shoot
                    socket.emit('decreaseAmmo', 1);
                    // bullets.push(newBullet);
                }
            }
        
            //console.log(bullets);
            for(bullet of bullets){
                bullet.update();
            }
        
        
            simplifyBullets();
            socket.emit('bulletUpdate', simpleBullets);
            // console.log(allBullets);
        
            //console.log(simpleBullets);
        
            for(var i =0; i <= walls.length - 1; i++ ){
                fill(105,105,105);
                rect(walls[i].x - xRange, walls[i].y- yRange, walls[i].length, walls[i].width);
            }
        }
    }
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
    line (width/2, height/2, mouseX, mouseY);
    textSize(20);
    fill(0);
    text (players2[socket.id].weapon.ammo + "/" + players2[socket.id].weapon.reserveAmmo, 500, 500);
    
}

function simplifyBullets(){
    for (var i = 0; i < bullets.length; i ++){
        var simpleBullet = new SimpleBullet(bullets[i].pos.x, bullets[i].pos.y, bullets[i].r, bullets[i].shooter);
        simpleBullets[i] = simpleBullet;
    }
}

function showAllBullets(allBullets){
    for (var player in allBullets){
        for (let bullet of allBullets[player]){
            fill(255);
            ellipse(bullet.x - xRange, bullet.y - yRange, bullet.r, bullet.r);
        }
    }
}

function removeBullets(i){
    simpleBullets.splice(i,1);
    bullets.splice(i,1);
}

function keyPressed(){
    if (keyIsDown(82)){ // reload (r)
        socket.emit('reload', 1);
    }
}

function startGame(){
    socket.on('update', showAll);
    socket.on('returnBullets', showAllBullets);

    socket.on('dead', function(){
        userNameSubmitted = false;
    })
}