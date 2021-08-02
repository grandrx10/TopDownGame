
function Player(username, characterType, x, y, team){
    this.username = username;
    this.characterType = characterType;
    this.x = x;
    this.y = y;
    this.xSpeed = 5;
    this.ySpeed = 5;
    this.r = 50;
    this.health = 100;
    this.maxHealth = 100;
    this.canPickup = "none";
    this.canOpen = false;
    this.power = 100;
    this.team = team;
    if (this.characterType == "assualt"){
        this.weaponName = "None";
        this.powerUsage = "Medium";
    } else if (this.characterType == "alien"){
        this.weaponName = "Melee";
        this.powerUsage = "None";
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

    this.checkLocation = function(){
        var collision = true;
        while (collision == true){
            collision = false;
            for (i = 0; i < walls.length; i++){
                if (rectCircDetect(walls[i], this)){
                    collision = true;
                }
            }
            if (collision){
                this.x = randint(0, 1800);
                this.y = randint(0, 2300);
            }
        }
    }

    this.updateGun = function(){
        if (this.weaponName == "Rifle"){
            this.ammo = 30;
            this.reserveAmmo = 90;
            this.clipAmmo = 30;
            this.damage = 15;
            this.inaccuracy = 10;
            this.bulletSpeed = 20;
            this.fireRate = 100;
            this.reloadTime = 1000;
            this.xSpeed = 5;
            this.ySpeed = 5;
        } else if (this.weaponName == "Sniper"){
            this.ammo = 5;
            this.reserveAmmo = 10;
            this.clipAmmo = 5;
            this.damage = 60;
            this.inaccuracy = 0;
            this.bulletSpeed = 30;
            this.fireRate = 1000;
            this.reloadTime = 2000;
            this.xSpeed = 5;
            this.ySpeed = 5;
        } else if (this.weaponName == "Minigun"){
            this.ammo = 100;
            this.reserveAmmo = 100;
            this.clipAmmo = 100;
            this.damage = 10;
            this.inaccuracy = 0;
            this.bulletSpeed = 15;
            this.fireRate = 30;
            this.reloadTime = 2000;
            this.xSpeed = 4;
            this.ySpeed = 4;
        } else if (this.weaponName == "Melee"){
            this.ammo = 0;
            this.reserveAmmo = 0;
            this.clipAmmo = 0;
            this.damage = 12;
            this.inaccuracy = 0;
            this.bulletSpeed = 0;
            this.fireRate = 100;
            this.reloadTime = 0;
            this.xSpeed = 7;
            this.ySpeed = 7;
        } else if (this.weaponName == "None"){
            this.ammo = 0;
            this.reserveAmmo = 0;
            this.clipAmmo = 0;
            this.damage = 0;
            this.inaccuracy = 0;
            this.bulletSpeed = 0;
            this.fireRate = 0;
            this.reloadTime = 0;
            this.xSpeed = 6;
            this.ySpeed = 6;
        }
    }
}

function Wall (x, y, length, width, type){
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.type = type;
}

function Item (x, y, length, width, name, type){
    this.x =x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.name = name;
    this.type = type;
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
// var walls = [new Wall(200, 200, 100, 100), new Wall(500, 200, 20, 300)];
var walls = [];
walls.push(new Wall(-100, -100, 10000, 100));
walls.push(new Wall(-100, -100, 100, 10000));
walls.push(new Wall(1000, 0, 100, 500));
walls.push(new Wall(1000, 700, 100, 1200));
walls.push(new Wall(0, 1000, 400, 100));
walls.push(new Wall(600, 1000, 400, 100));
walls.push(new Wall(300, 1100, 100, 300));
walls.push(new Wall(600, 1100, 100, 300));
walls.push(new Wall(300, 1500, 100, 200));
walls.push(new Wall(600, 1500, 100, 200));
walls.push(new Wall(0, 1700, 400, 100));
walls.push(new Wall(600, 1700, 400, 100));
walls.push(new Wall(0, 2300, 2200, 100));
walls.push(new Wall(1000, 2100, 100, 500));
// Right side
walls.push(new Wall(1100, 200, 300, 100));
walls.push(new Wall(1500, 200, 400, 100));
walls.push(new Wall(1800, 300, 100, 2600));
walls.push(new Wall(1800, 0, 100, 200));


//top left boxes
walls.push(new Wall(200, 100, 100, 200));
walls.push(new Wall(700, 100, 100, 200));
walls.push(new Wall(200, 700, 100, 200));
walls.push(new Wall(700, 700, 100, 200));
// right boxes
walls.push(new Wall(1600, 900, 100, 100));
walls.push(new Wall(1200, 1300, 100, 100));
walls.push(new Wall(150, 1950, 100, 200));
walls.push(new Wall(1500, 1650, 100, 100));

// door
//walls.push(new Wall(400, 1025, 200, 50, "door"));
// (400, 1025, 200, 50, 0)


var items = [];
createItem(new Item(randint(0, 1800), randint(0, 2300), 40, 20, "Sniper", "weapon"));
createItem(new Item(randint(0, 1800), randint(0, 2300), 40, 20, "Minigun", "weapon"));
createItem(new Item(randint(0, 1800), randint(0, 2300), 20, 20, "Battery", "utility"))
createItem(new Item(randint(0, 1800), randint(0, 2300), 20, 20, "Battery", "utility"));
createItem(new Item(randint(0, 1800), randint(0, 2300), 30, 30, "Health Pack", "utility"));
// x 1800 y 2300

var bullets = [];

var d = new Date();
var gameTime = d.getTime();
var startTime = d.getTime();
var start = false; // note
var timeSinceStart = 0;

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
    io.sockets.emit('updateTime', [gameTime, walls, items, timeSinceStart]);
    for (bullet of bullets){
        bullet.updateBulletLocation();
    }
    checkBulletCollision();
    reloadCheck();
    pickupCheck();
    canOpenCheck();
    spawnItems();
    updatePower();
}, 10);

setInterval(function () {
  d = new Date();
  gameTime = d.getTime();
  timeSinceStart= gameTime - startTime;
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

    socket.on('reload', function(){
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
            if (players[socket.id].weaponName == "Melee"){
                if (gameTime - players[socket.id].timeLastShot > players[socket.id].fireRate){
                    players[socket.id].timeLastShot = gameTime;
                    for (player in players){
                        if (player != socket.id && distance(players[player].x, players[player].y, players[socket.id].x, players[socket.id].y) < 120){
                            players[player].health -= players[socket.id].damage;
                        }
                    }
                }
            } else{
                if (gameTime - players[socket.id].timeLastShot > players[socket.id].fireRate && players[socket.id].ammo > 0 && players[socket.id].isReloading == false){
                    bullets.push(new Bullet(players[socket.id].x, players[socket.id].y, pos[0], pos[1], socket.id, players[socket.id].bulletSpeed, players[socket.id].damage));
                    players[socket.id].timeLastShot = gameTime;
                    players[socket.id].ammo -= 1;
                }
            }
        }
    })

    socket.on('pickup', function(){
        if (players[socket.id] != undefined){
            if (players[socket.id].canPickup != "none"){
                if (items[findClosest(players[socket.id], items)].name == "Battery"){
                    items.splice(findClosest(players[socket.id], items), 1);
                    players[socket.id].power += 40;
                } else if (items[findClosest(players[socket.id], items)].name == "Health Pack"){
                    items.splice(findClosest(players[socket.id], items), 1);
                    players[socket.id].health += 40;
                }
                else {
                    players[socket.id].weaponName = players[socket.id].canPickup;
                    players[socket.id].updateGun();
                    if (findClosest(players[socket.id], items) != -1){
                        items.splice(findClosest(players[socket.id], items), 1);
                    }
                }
            }
        }
    })

    socket.on('openDoor', function(){
        if (players[socket.id] != undefined){
            if (players[socket.id].canOpen && walls[findClosest(players[socket.id], walls)].type == "door") {
                console.log("BINGO!");
            }
        }
    })

    socket.on('switchPower', function(){
        if (players[socket.id] != undefined){
            if (players[socket.id].powerUsage == "Off"){
                players[socket.id].powerUsage = "Low";
            } else if (players[socket.id].powerUsage == "Low"){
                players[socket.id].powerUsage = "Medium";
            } else if (players[socket.id].powerUsage == "Medium"){
                players[socket.id].powerUsage = "High";
            } else if (players[socket.id].powerUsage == "High"){
                players[socket.id].powerUsage = "Off";
            }
        }
    })

    function processUsername(usernameList) { //[username, class]
        if (timeSinceStart< 10 * 1000) { // 10 seconds before game starts
            if(usernameList[0] == ""){
                var player = new Player("Unnamed", usernameList[1], randint(0, 1800), randint(0, 2300), "human");
            } else {
                var player = new Player(usernameList[0], usernameList[1], randint(0, 1800), randint(0, 2300), "human");
            }
        } else { // DUDE CHANGE THIS BACK!
            if(usernameList[0] == ""){
                var player = new Player("Unnamed", usernameList[1], randint(0, 1800), randint(0, 2300), "human");
            } else {
                var player = new Player(usernameList[0], usernameList[1], randint(0, 1800), randint(0, 2300), "human");
            } 
        }
        players[socket.id] = player;
        players[socket.id].updateGun();
        players[socket.id].checkLocation();
        socket.emit('gameStart', 1);
        start = true; // note
    }

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

function rectCircDetect(rect, circle){
    leftSide = rect.x;
    rightSide = rect.x + rect.length;
    topSide = rect.y;
    botSide = rect.y + rect.width;
    if (circle.x + circle.r/2 > leftSide && circle.x - circle.r/2 < rightSide && circle.y + circle.r/2> topSide && circle.y - circle.r/2< botSide){
        return true;
    } else {
        return false;
    }
}

function rectRectDetect(rect, rect2){
    leftSide = rect.x;
    rightSide = rect.x + rect.length;
    topSide = rect.y;
    botSide = rect.y + rect.width;
    if (rect2.x + rect2.length > leftSide && rect2.x < rightSide && rect2.y + rect2.width> topSide && rect2.y < botSide){
        return true;
    } else {
        return false;
    }
}

function checkBulletCollision (){
    for (var c = 0; c < walls.length; c++){
        for (var i = bullets.length - 1; i >= 0; i --){
            if (rectCircDetect(walls[c], bullets[i])){
                bullets.splice(i, 1);
            }
        }
    }

    for (player in players){
        for (var i = bullets.length - 1; i >= 0; i --){
            if (distance(players[player].x, players[player].y, bullets[i].x, bullets[i].y) < bullets[i].r/2 + players[player].r/2 && bullets[i].shooter != player && players[player].team != players[bullets[i].shooter].team){
                players[player].health -= bullets[i].damage;
                bullets.splice(i, 1);
            }
        }
    }
}

function pickupCheck(){
    for (player in players){
            players[player].canPickup = "none";
    }
    for (var c = 0; c < items.length; c++){
        for (player in players){
            if (rectCircDetect(items[c], players[player])){
                players[player].canPickup = items[c].name;
            }
        }
    }
    if (items.length == 0){
        players[player].canPickup = "none";
    }
}

function canOpenCheck(){
    for (player in players){
        players[player].canOpen = false;
    }
    for (var c = 0; c < walls.length; c++){
        for (player in players){
            players[player].r = 100;
            if (rectCircDetect(walls[c], players[player]) && walls[c].type == "door"){
                players[player].canOpen = true;
            }
            players[player].r = 50;
        }
    }
}

function findClosest(location, list){
    var closest = -1;
    var closestDistance = 10000000;
    for (i = 0; i < list.length; i++){
        if (distance(location.x, location.y, list[i].x, list[i].y) < closestDistance){
            closest = i;
            closestDistance = distance(location.x, location.y, list[i].x + list[i].length/2, list[i].y + list[i].width/2);
        }
    }
    return closest;
}

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function randint(lowerNum, upperNum){
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
        } else if (players[player].health > 100){
            players[player].health = 100;
        }
    }
}

function spawnItems(){
    if (Math.round(gameTime - startTime) % 2000 == 0 && items.length < 6){
        createItem(new Item(randint(0, 1800), randint(0, 2300), 40, 20, "Sniper", "weapon"));
        createItem(new Item(randint(0, 1800), randint(0, 2300), 40, 20, "Rifle", "weapon"));
        createItem(new Item(randint(0, 1800), randint(0, 2300), 40, 20, "Rifle", "weapon"));
        createItem(new Item(randint(0, 1800), randint(0, 2300), 40, 20, "Minigun", "weapon"));
        createItem(new Item(randint(0, 1800), randint(0, 2300), 20, 20, "Battery", "utility"));
        createItem(new Item(randint(0, 1800), randint(0, 2300), 20, 20, "Battery", "utility"));
        createItem(new Item(randint(0, 1800), randint(0, 2300), 30, 30, "Health Pack", "utility"));
    }
}

function createItem(item){
    items.push(item);
    var collision = true;
    while (collision == true){
        collision = false;
        for (i = 0; i < walls.length; i ++){
            if (rectRectDetect(walls[i], items[items.length -1])){
                collision = true;
            }
        }
        if (collision){
            items[items.length-1].x = randint(0, 1800);
            items[items.length-1].y = randint(0, 2300);
        }
    }
}


function updatePower(){
    for (player in players){
        if (players[player].powerUsage == "Low"){
            players[player].power -= 0.005;
        } else if (players[player].powerUsage == "Medium"){
            players[player].power -= 0.01;
        } else if (players[player].powerUsage == "High"){
            players[player].power -= 0.02;
        }
        
        if (players[player].power < 0){
            players[player].powerUsage = "Off";
            players[player].power = 0;
        } else if (players[player].power > 100){
            players[player].power = 100;
        }
    }
}