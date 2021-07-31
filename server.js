
function Player(username, characterType, x, y){
    this.username = username;
    this.characterType = characterType;
    this.x = x;
    this.y = y;
    this.xSpeed = 5;
    this.ySpeed = 5;
    this.r = 50;
    this.health = 100;
    this.maxHealth = 100;
    // weapon name[0], ammo[1], reserve ammo[2], clip ammo[3], damage[4], inaccuracy[5], speed[6], fire rate[7], time last fired[8]
    if (this.characterType == "assualt"){
        this.weaponName = "rifle";
        // this.ammo = 30;
        // this.reserveAmmo = 300;
        // this.clipAmmo = 30;
        // this.damage = 10;
        // this.inaccuracy = 10;
        // this.bulletSpeed = 15;
        // this.fireRate = 100;
        // this.reloadTime = 1000;
    } else if (this.characterType == "marksman"){
        this.weaponName = "sniper";
        // this.ammo = 5;
        // this.reserveAmmo = 40;
        // this.clipAmmo = 5;
        // this.damage = 60;
        // this.inaccuracy = 0;
        // this.bulletSpeed = 30;
        // this.fireRate = 1000;
        // this.reloadTime = 2000;
    }
    this.timeLastShot = 0;
    //RELOAD TECHNIQUES
    this.playerReloadingTime = 0;
    this.isReloading = false;

    // add update function Take in WASD and update X and Y
    this.move = function(dir){
        if (dir == "up" && checkCollision(this, walls, "up")){
            this.y -= this.ySpeed;
        } else if (dir == "down" && checkCollision(this, walls, "down")){
            this.y += this.ySpeed;
        } else if (dir == "left" && checkCollision(this, walls, "left")){
            this.x -= this.xSpeed;
        } else if (dir == "right" && checkCollision(this, walls, "right")){
            this.x += this.xSpeed;
        }
    }
}

function Wall (x, y, length, width){
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
}

function Bullet(x, y, aimX, aimY, shooter, speed, damage) {
    this.x = x;
    this.y = y;
    this.aimX = aimX;
    this.aimY = aimY;
    this.r = 10;
    this.shooter = shooter;
    this.travel = [aimX - x, aimY - y];
    this.speed = speed;
    this.damage = damage;
    // this.normalVec = vector.normalize();
    // this.update = function(){
    //     this.x = this.x + normalVec.x;
    //     this.y = this.y + normalVec.y;
    // }
    this.updateBulletLocation = function(){
        this.x = this.x + this.speed*this.travel[0]/Math.sqrt(Math.pow(this.travel[0],2) + Math.pow(this.travel[1],2));
        this.y = this.y + this.speed*this.travel[1]/Math.sqrt(Math.pow(this.travel[0],2) + Math.pow(this.travel[1],2));
    }
}

var players = {};
var walls = [new Wall(200, 200, 100, 100), new Wall(500, 200, 20, 300)];
walls.push(new Wall(-100, -100, 10000, 100));
walls.push(new Wall(-100, -100, 100, 10000));
walls.push(new Wall(1000, -100, 100, 10000));
walls.push(new Wall(-100, 1000, 10000, 100));
walls.push(new Wall(200, 800, 200, 100));
walls.push(new Wall(600, 650, 150, 150));
walls.push(new Wall(750, 250, 500, 100));

var bullets = [];
var d = new Date();
var gameTime = d.getTime();
var start = false; // note

//measuring tools
var leftSide;
var rightSide;
var topSide;
var botSide;

var express = require('express');
var Victor = require('victor');

var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require("socket.io");
var io = socket(server);

io.sockets.on("connection", newConnection);

setInterval(function () {
    killPlayers();
    io.sockets.emit('update', players);
    io.sockets.emit('bulletUpdate', bullets);
    io.sockets.emit('updateTime', [gameTime, walls]);
    for (bullet of bullets){
        bullet.updateBulletLocation();
    }
    checkBulletCollision();
    reloadCheck();
}, 10);

setInterval(function () {
  d = new Date();
  gameTime = d.getTime();
}, 10);

function newConnection(socket){

    socket.on("disconnect", () => {
        delete players[socket.id];
      });

    console.log("new connection: " + socket.id);  

    socket.on('username',processUsername);

    socket.on('move', function(dir){
        if (players[socket.id] != undefined){
            players[socket.id].move(dir);
        }
    })

    socket.on('reload', function(dir){
        if (players[socket.id] != undefined){
            if (players[socket.id].isReloading == false){
                players[socket.id].isReloading = true;
                players[socket.id].playerReloadingTime = gameTime;
                if (players[socket.id].reserveAmmo + players[socket.id].ammo >= players[socket.id].clipAmmo){
                    players[socket.id].reserveAmmo += players[socket.id].ammo;
                    players[socket.id].ammo = players[socket.id].clipAmmo;
                    players[socket.id].reserveAmmo -= players[socket.id].clipAmmo;
                } else {
                    players[socket.id].ammo = players[socket.id].reserveAmmo + players[socket.id].ammo;
                    players[socket.id].reserveAmmo = 0;
                }
            }
        }
    })

    socket.on('shoot', function(pos){
        if (players[socket.id] != undefined){
            if (gameTime - players[socket.id].timeLastShot > players[socket.id].fireRate && players[socket.id].ammo > 0 && players[socket.id].isReloading == false){
                bullets.push(new Bullet(players[socket.id].x, players[socket.id].y, pos[0], pos[1], socket.id, players[socket.id].bulletSpeed, players[socket.id].damage));
                players[socket.id].timeLastShot = gameTime;
                players[socket.id].ammo -= 1;
            }
        }
    })

    function processUsername(usernameList) { //[username, class]
        if(usernameList[0] == ""){
            var player = new Player("Unnamed", usernameList[1], Math.random() * 600, Math.random()* 600);
        } else {
            var player = new Player(usernameList[0], usernameList[1], Math.random() * 600, Math.random()* 600);
        }
        players[socket.id] = player;
        socket.emit('gameStart', 1);
        start = true;// note
    }

}

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function checkCollision(player, walls, dir){
    // problem here!!!!
    if (dir == "left"){
        nextPositionX = player.x - player.xSpeed - 25;
        nextPositionY = player.y;
    } else if (dir == "right"){
        nextPositionX = player.x + player.xSpeed + 25;
        nextPositionY = player.y;
    } else if (dir == "up"){
        nextPositionY = player.y - player.ySpeed - 25;
        nextPositionX = player.x;
    } else if (dir == "down"){
        nextPositionY = player.y + player.ySpeed + 25;
        nextPositionX = player.x;
    }
    for (var i = 0; i < walls.length; i ++){
        leftSide = walls[i].x;
        rightSide = walls[i].x + walls[i].length;
        topSide = walls[i].y;
        botSide = walls[i].y + walls[i].width;
        if (dir == "down" || dir == "up"){
            if (nextPositionY > topSide && nextPositionY < botSide && (nextPositionX + 25 > leftSide && nextPositionX - 25 < rightSide)){
                return false;
            }
        } 
        if (dir == "left" || dir == "right"){
            if (nextPositionX > leftSide && nextPositionX < rightSide && (player.y + 25 > topSide && player.y - 25 < botSide)){
                return false;
            }
        }
    }
    return true;
}

function wallBulletDetect(rect, circle){
    leftSide = rect.x;
    rightSide = rect.x + rect.length;
    topSide = rect.y;
    botSide = rect.y + rect.width;
    if (circle.x > leftSide && circle.x < rightSide && circle.y > topSide && circle.y < botSide){
        return true;
    } else {
        return false;
    }
}

function checkBulletCollision (){
    for (var c = 0; c < walls.length; c++){
        for (var i = bullets.length - 1; i >= 0; i --){
            if (wallBulletDetect(walls[c], bullets[i])){
                bullets.splice(i, 1);
            }
        }
    }

    for (player in players){
        for (var i = bullets.length - 1; i >= 0; i --){
            if (distance(players[player].x, players[player].y, bullets[i].x, bullets[i].y) < bullets[i].r/2 + players[player].r/2 && bullets[i].shooter != player){
                players[player].health -= bullets[i].damage;
                bullets.splice(i, 1);
            }
        }
    }
}

function randint(upperNum, lowerNum){
    return Math.floor(Math.random() * upperNum) + lowerNum;
}

function reloadCheck(){
    for (player in players){
        if (gameTime - players[player].playerReloadingTime > players[player].reloadTime){
            players[player].isReloading = false;
        }
    }
}

function killPlayers(){
    for (player in players){
        if (players[player].health <= 0){
            for (i = bullets.length-1; i >= 0; i--){
                if (bullets[i].shooter == player){
                    bullets.splice(i, 1);
                }
            }
            delete players[player];
        }
    }
}