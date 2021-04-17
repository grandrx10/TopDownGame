
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
    this.weapon = new Weapon("rifle", 30, 90, 30, 20, 5, 30); // weapon name, ammo, reserve ammo, clip ammo, damage, inaccuracy, fire rate
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


function Weapon(name, ammo, reserveAmmo, clipAmmo, damage, inaccuracy, fireRate){
    this.name = name;
    this.ammo = ammo;
    this.reserveAmmo = reserveAmmo;
    this.clipAmmo = clipAmmo;
    this.damage = damage;
    this.inaccuracy = inaccuracy;
    this.fireRate = fireRate;
    this.lastShot = 0;
    this.canFire = function(){
        if (gameTime - this.lastShot > this.fireRate){
            this.lastShot = gameTime;
            return true;
        } else {
            return false;
        }
    }
}

function Wall (x, y, length, width){
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
}

// function Bullet(x, y, angle, xSpeed, ySpeed, shooter) {
//     this.x = x;
//     this.y = y;
//     this.width = 10;
//     this.height = 10;
//     this.angle = angle;
//     this.xSpeed = xSpeed;
//     this.ySpeed = ySpeed;
//     this.shooter = shooter;
// }

var players = {};
var walls = [new Wall(200, 200, 100, 100), new Wall(500, 200, 20, 100)];
walls.push(new Wall(-100, -100, 10000, 100));
walls.push(new Wall(-100, -100, 100, 10000));

var allBullets = {};
var gameTime = 0;

//measuring tools
var leftSide;
var rightSide;
var topSide;
var botSide;

var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require("socket.io");
var io = socket(server);

io.sockets.on("connection", newConnection);

setInterval(function () {
    io.sockets.emit('update', players);
    io.sockets.emit('returnBullets', allBullets);
  }, 10);

setInterval(function () {
  gameTime ++;
}, 1);

function newConnection(socket){

    socket.on("disconnect", () => {
        delete players[socket.id];
      });

    console.log("new connection: " + socket.id);  

    socket.on('username',processUsername);

    socket.on('move', function(dir){
        players[socket.id].move(dir);
    })
    socket.on('bulletUpdate', function(bullets){
        allBullets[socket.id] = bullets;
        // detect bullet collision with edge of map
        //if collision, delete bullet and emit message for client to delete bullet
        for (var c = 0; c < walls.length; c++){
            for (var player in allBullets){
                //for (let bullet of allBullets[player]){ 
                for (var i = allBullets[player].length -1;  i>= 0; i--){
                    leftSide = walls[c].x;
                    rightSide = walls[c].x + walls[c].length;
                    topSide = walls[c].y;
                    botSide = walls[c].y + walls[c].width;
                    if (allBullets[player][i].x > leftSide && allBullets[player][i].x < rightSide && allBullets[player][i].y > topSide && allBullets[player][i].y < botSide){
                        allBullets[player].splice(i, 1);
                        io.to(socket.id).emit('removeBullets', i);
                    }
                }
            }
        }
        for (var person in players){
            for (var player in allBullets){
                //for (let bullet of allBullets[player]){ 
                if (allBullets[player] != []){
                    for (var i = allBullets[player].length -1;  i>= 0; i--){
                        // about to add enemy bullet detection
                            // players[person].x
                        if (distance(allBullets[player][i].x, allBullets[player][i].y, players[person].x, players[person].y) < players[person].r/2 && person != socket.id){
                            players[person].health -= players[allBullets[player][i].shooter].weapon.damage;
                            allBullets[player].splice(i, 1);
                            io.to(socket.id).emit('removeBullets', i);
                        }
                    }
                }
            }
            if (players[person].health <= 0){
                io.to(person).emit('dead', 1);
                delete allBullets[person];
                delete players[person];
            }
        }
    })

    //catch ammo decrease
    socket.on('decreaseAmmo', function(decreaseAmount){
        if(players[socket.id].weapon.canFire()){
            players[socket.id].weapon.ammo -= decreaseAmount;
            //emit something telling the client to add bullet
            socket.emit('shootBullet', 1);
        }
    })
    // reload
    socket.on('reload', function(){
        if (players[socket.id].weapon.reserveAmmo > players[socket.id].weapon.clipAmmo){
            players[socket.id].weapon.reserveAmmo -= players[socket.id].weapon.clipAmmo - players[socket.id].weapon.ammo;
            players[socket.id].weapon.ammo = players[socket.id].weapon.clipAmmo;
        } else if (players[socket.id].weapon.reserveAmmo != 0){
            players[socket.id].weapon.ammo = players[socket.id].weapon.reserveAmmo;
            players[socket.id].weapon.reserveAmmo = 0;
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

