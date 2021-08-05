
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
    this.canOpen = false; // this is for doors
    this.canUse = false; // this is for entities (Generators)
    this.power = 100;
    this.lastMovedX = 0;
    this.lastMovedY = 0;
    
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
    this.moveY = function(dir){
        if (dir == "up" && checkCollision(this, walls, "up")){
            this.y -= this.ySpeed;
        } else if (dir == "down" && checkCollision(this, walls, "down")){
            this.y += this.ySpeed;
        } 
    }
    this.moveX = function(dir){
        if (dir == "left" && checkCollision(this, walls, "left")){
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
                this.x = randint(0, mapLength);
                this.y = randint(0, mapWidth);
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
        } else if (this.weaponName == "Pistol"){
            this.ammo = 8;
            this.reserveAmmo = 24;
            this.clipAmmo = 8;
            this.damage = 25;
            this.inaccuracy = 15;
            this.bulletSpeed = 18;
            this.fireRate = 200;
            this.reloadTime = 500;
            this.xSpeed = 5;
            this.ySpeed = 5;
        } else if (this.weaponName == "Shotgun"){
            this.ammo = 4;
            this.reserveAmmo = 12;
            this.clipAmmo = 4;
            this.damage = 8;
            this.inaccuracy = 50;
            this.bulletSpeed = 12;
            this.fireRate = 800;
            this.reloadTime = 1000;
            this.xSpeed = 5;
            this.ySpeed = 5;
        } else if (this.weaponName == "Tesla Rifle"){
            this.ammo = 0;
            this.reserveAmmo = 0;
            this.clipAmmo = 0;
            this.damage = 25;
            this.inaccuracy = 5;
            this.bulletSpeed = 20;
            this.fireRate = 800;
            this.reloadTime = 0;
            this.xSpeed = 5;
            this.ySpeed = 5;
        } 
        else if (this.weaponName == "Sniper"){
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
            this.inaccuracy = 20;
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
        } else if (this.weaponName == "Grenades"){
            this.ammo = 1;
            this.reserveAmmo = 5;
            this.clipAmmo = 1;
            this.damage = 0;
            this.inaccuracy = 0;
            this.bulletSpeed = 10;
            this.fireRate = 800;
            this.reloadTime = 400;
            this.xSpeed = 5;
            this.ySpeed = 5;
        } else if (this.weaponName == "Grenade Launcher"){
            this.ammo = 6;
            this.reserveAmmo = 12;
            this.clipAmmo = 6;
            this.damage = 0;
            this.inaccuracy = 0;
            this.bulletSpeed = 12;
            this.fireRate = 500;
            this.reloadTime = 1200;
            this.xSpeed = 4;
            this.ySpeed = 4;
        }
    }
}

function Wall (x, y, length, width, type){
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.type = type;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.limitX = this.x + this.length;
    this.limitY = this.y + this.width;
    this.openedTime = 0;
}

function Item (x, y, length, width, name, type){
    this.x =x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.name = name;
    this.type = type;
}

function Entity (x, y, length, width, name, colour){
    this.x =x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.colour = colour;
    this.name = name;
}

function DeadBody (x, y, radius, name){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.name = name;
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
    
    this.type = "bullet";

    this.updateBulletLocation = function(){
        this.x = this.x + this.speed*this.travel[0]/Math.sqrt(Math.pow(this.travel[0],2) + Math.pow(this.travel[1],2));
        this.y = this.y + this.speed*this.travel[1]/Math.sqrt(Math.pow(this.travel[0],2) + Math.pow(this.travel[1],2));
    }
}

var players = {};
var playerCount;
var survivorCount;
var insurgentCount;
var alienCount;
var generatorCount;
var winners = "none";
var eventActivated = false;
// var walls = [new Wall(200, 200, 100, 100), new Wall(500, 200, 20, 300)];
var walls = [];
walls.push(new Wall(-100, -100, 1400, 100));
walls.push(new Wall(1600, -100, 10000, 100));

walls.push(new Wall(1000, -500, 800, 100));
walls.push(new Wall(1800, -500, 100, 400));
walls.push(new Wall(1000, -500, 100, 400));


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
walls.push(new Wall(0, 2300, 5000, 100));
walls.push(new Wall(1000, 2100, 100, 500));
// Right side
walls.push(new Wall(1100, 200, 300, 100));
walls.push(new Wall(1500, 200, 400, 100));
walls.push(new Wall(1800, 300, 100, 300));
walls.push(new Wall(1800, 0, 100, 200));

walls.push(new Wall(1800, 800, 100, 500));
walls.push(new Wall(1800, 1500, 100, 1000));

// right curve
walls.push(new Wall(2200, 200, 100, 600));
walls.push(new Wall(2200, 200, 600, 100));
walls.push(new Wall(1900, 1150, 600, 100));
walls.push(new Wall(2700, 1150, 800, 100));
walls.push(new Wall(3400, 1000, 100, 300));
walls.push(new Wall(2200, 950, 100, 600));
walls.push(new Wall(3000, 200, 500, 100));
walls.push(new Wall(3400, 300, 100, 500));
walls.push(new Wall(3800, 0, 100, 4000));

walls.push(new Wall(2200, 1750, 100, 300));
walls.push(new Wall(2200, 2000, 1000, 100));
walls.push(new Wall(2900, 1250, 100, 750));
walls.push(new Wall(3400, 2000, 600, 100));
walls.push(new Wall(3400, 1450, 100, 650));

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
walls.push(new Wall(400, 1025, 200, 50, "door"));
walls.push(new Wall(325, 1400, 50, 100, "door"));
walls.push(new Wall(625, 1400, 50, 100, "door"));
walls.push(new Wall(400, 1725, 200, 50, "door"));
walls.push(new Wall(1025, 1900, 50, 200, "door"));
walls.push(new Wall(1025, 500, 50, 200, "door"));
walls.push(new Wall(1400, 225, 100, 50, "door"));
walls.push(new Wall(2800, 225, 200, 50, "door"));
walls.push(new Wall(2225, 800, 50, 150, "door"));
walls.push(new Wall(1825, 600, 50, 200, "door"));
walls.push(new Wall(1825, 1300, 50, 200, "door"));
walls.push(new Wall(2225, 1550, 50, 200, "door"));
walls.push(new Wall(3425, 800, 50, 200, "door"));
walls.push(new Wall(2500, 1175, 200, 50, "door"));
walls.push(new Wall(3200, 2025, 200, 50, "door"));
walls.push(new Wall(3425, 1300, 50, 150, "door"));


var items = [];
var entities = [new Entity (1350, -350, 200, 200, "RESPAWN STATION", "blue")];
var bullets = [];
var deadBodies = [];
var socketList = [];

// List of random names:
var names = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Greenwold", "Hotel", "Indigo", "Janice", "Klen",
"Lance", "Molly", "Nancy", "Octo", "Prince", "Quintus", "Reaver", "Sally", "Tango", "Vanity", "Underdog", "Wendle", "Xander",
"Youth", "Zebra", "Arman", "Beta", "Ceter", "Dovomov", "Eliot", "Fang", "Gaul", "Haven", "Io", "Jello", "Karen", "Larry",
"Maven", "North Star", "Ool", "Patterson", "Queen", "Realter", "Sanguine", "Tommy", "Vindy", "Ursula", "Wehrmacht", "X-Ray", "Youngstan",
"Zai"];

var randomEvents = ["Rescue Operation", "Aliens", "Insurgent Arrival"];
var possibleWeapons = ["Pistol", "Rifle", "Pistol", "Rifle", "Pistol", "Sniper", "Minigun", "Pistol", "Rifle", "Shotgun", "Shotgun", "Shotgun",
, "Tesla Rifle", "Grenades", "Grenades", "Grenades", "Grenade Launcher"];

var startSetup = false;
var d = new Date();
var gameTime = d.getTime();
var startTime = d.getTime();
var endGameTime = 0;
var start = false; // note
var timeSinceStart = 0;
var event = "No Event";

//map dimensions
var mapLength = 3800;
var mapWidth = 2300;

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
    io.sockets.emit('updateTime', [gameTime, walls, items, timeSinceStart, winners, playerCount, entities, deadBodies, 
        survivorCount, generatorCount, event]);
    for (bullet of bullets){
        bullet.updateBulletLocation();
    }
    checkBulletCollision();
    reloadCheck();
    pickupCheck();
    canOpenCheck();
    canUseCheck();
    spawnItems();
    updatePower();
    doorUpdate();
    checkForSurvivors();
    checkForGenerators();
    checkForEndGame();
    assignRoles();
    getSocketList();
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

    socket.on('moveX', function(dir){
        if (players[socket.id] != undefined){
            if (gameTime - players[socket.id].lastMovedX > 10){
                players[socket.id].moveX(dir);
                players[socket.id].lastMovedX = gameTime;
            }
        }
    })

    socket.on('moveY', function(dir){
        if (players[socket.id] != undefined){
            if (gameTime - players[socket.id].lastMovedY > 10){
                players[socket.id].moveY(dir);
                players[socket.id].lastMovedY = gameTime;
            }
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
                        if (player != socket.id && distance(players[player].x, players[player].y, players[socket.id].x, players[socket.id].y) < 120 && players[player].team != "Alien"){
                            players[player].health -= players[socket.id].damage;
                        }

                    }
                }
            }
            else if (players[socket.id].weaponName == "Grenades" || players[socket.id].weaponName == "Grenade Launcher") {
                if (gameTime - players[socket.id].timeLastShot > players[socket.id].fireRate && players[socket.id].ammo > 0 && players[socket.id].isReloading == false){
                    bullets.push(new Bullet(players[socket.id].x, players[socket.id].y, pos[0], pos[1], socket.id, players[socket.id].bulletSpeed, players[socket.id].damage));
                    bullets[bullets.length - 1].type = "grenade";
                    bullets[bullets.length - 1].r = 30;
                    players[socket.id].timeLastShot = gameTime;
                    players[socket.id].ammo -= 1;
                }
            }
            else if (players[socket.id].weaponName == "Shotgun") {
                if (gameTime - players[socket.id].timeLastShot > players[socket.id].fireRate && players[socket.id].ammo > 0 && players[socket.id].isReloading == false){
                    for (var i = 0; i < 10; i ++){
                        bullets.push(new Bullet(players[socket.id].x, players[socket.id].y, pos[0] + randint(-50, 50), pos[1]+ randint(-50, 50), socket.id, players[socket.id].bulletSpeed, players[socket.id].damage));
                    }
                    players[socket.id].timeLastShot = gameTime;
                    players[socket.id].ammo -= 1;
                }
            } else if (players[socket.id].weaponName == "Tesla Rifle") {
                if (gameTime - players[socket.id].timeLastShot > players[socket.id].fireRate && players[socket.id].power > 0 && players[socket.id].isReloading == false){
                    for (var i = 0; i < 3; i ++){
                        bullets.push(new Bullet(players[socket.id].x, players[socket.id].y, pos[0], pos[1], socket.id, players[socket.id].bulletSpeed + i, players[socket.id].damage));
                    }
                    players[socket.id].timeLastShot = gameTime;
                    players[socket.id].power -= 7;
                }
            }
            else{
                if (gameTime - players[socket.id].timeLastShot > players[socket.id].fireRate && players[socket.id].ammo > 0 && players[socket.id].isReloading == false){
                    bullets.push(new Bullet(players[socket.id].x, players[socket.id].y, pos[0] + randint(-players[socket.id].inaccuracy, players[socket.id].inaccuracy), pos[1] + randint(-players[socket.id].inaccuracy, players[socket.id].inaccuracy), socket.id, players[socket.id].bulletSpeed, players[socket.id].damage));
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
            } else if (players[socket.id].canOpen && walls[findClosest(players[socket.id], walls)].type == "door") {
                openDoor(findClosest(players[socket.id], walls));
            } else if (players[socket.id].canUse && entities[findClosest(players[socket.id], entities)].name == "Generator") {
                if (entities[findClosest(players[socket.id], entities)].colour == "red"){
                    entities[findClosest(players[socket.id], entities)].colour = "green";
                } else {
                    entities[findClosest(players[socket.id], entities)].colour = "red";
                }
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
                var player = new Player(names[randint(0, names.length-1)], usernameList[1], randint(0, mapLength), randint(0, mapWidth), "Undecided");
            } else {
                var player = new Player(usernameList[0], usernameList[1], randint(0, mapLength), randint(0, mapWidth), "Undecided");
            }
        } else { // DUDE CHANGE THIS BACK!
            if(usernameList[0] == ""){
                var player = new Player(names[randint(0, names.length-1)], "Ghost", randint(0, mapLength), randint(0, mapWidth), "Ghost");
            } else {
                var player = new Player(usernameList[0], "Ghost", randint(0, mapLength), randint(0, mapWidth), "Ghost");
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
    if (player.team == "Ghost"){
        return true;
    }

    // predict in future
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
                if (bullets[i].type == "bullet"){
                    bullets.splice(i, 1);
                } else if (bullets[i].type == "grenade"){
                    for (var c = 0; c < 30; c ++){
                        bullets.push(new Bullet(bullets[i].x+ randint(-10, 10), bullets[i].y+ randint(-10, 10), bullets[i].x + randint(-50, 50), bullets[i].y + randint(-50, 50), bullets[i].shooter, 10, 10));
                    }
                    bullets.splice(i, 1);
                }
            }
        }
    }

    for (player in players){
        for (var i = bullets.length - 1; i >= 0; i --){
            if (distance(players[player].x, players[player].y, bullets[i].x, bullets[i].y) < bullets[i].r/2 + players[player].r/2 && bullets[i].shooter != player && players[player].team != "Ghost"){ //players[player].team != players[bullets[i].shooter].team 
                if (bullets[i].type == "bullet"){
                    players[player].health -= bullets[i].damage;
                    bullets.splice(i, 1);
                } else if (bullets[i].type == "grenade"){
                    for (var c = 0; c < 30; c ++){
                        bullets.push(new Bullet(bullets[i].x + randint(-10, 10), bullets[i].y + randint(-10, 10), bullets[i].x + randint(-50, 50), bullets[i].y + randint(-50, 50), bullets[i].shooter, 10, 10));
                    }
                    bullets.splice(i, 1);
                }
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
            if (rectCircDetect(items[c], players[player]) && players[player].team != "Ghost" && players[player].team != "Alien"){
                players[player].canPickup = items[c].name;
            }
            if (items.length == 0){
                players[player].canPickup = "none";
            }
        }
    }
}

function canOpenCheck(){
    for (player in players){
        players[player].canOpen = false;
    }
    for (var c = 0; c < walls.length; c++){
        for (player in players){
            players[player].r = 100;
            if (rectCircDetect(walls[c], players[player]) && walls[c].type == "door" && players[player].team != "Ghost"){
                players[player].canOpen = true;
            }
            players[player].r = 50;
        }
    }
}

function canUseCheck(){
    // can use check
    for (player in players){
        players[player].canUse = false;
    }
    for (var c = 0; c < entities.length; c++){
        for (player in players){
            if (rectCircDetect(entities[c], players[player]) && entities[c].name == "Generator" && players[player].team != "Ghost"){
                players[player].canUse = true;
            }
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
    return Math.floor(Math.random() * (upperNum - lowerNum + 1)) + lowerNum;
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
            if (players[player].team != "Ghost"){
                deadBodies.push(new DeadBody(players[player].x, players[player].y, players[player].r, players[player].username));
            }
            players[player].team = "Ghost";
            players[player].weaponName = "None";
            players[player].powerUsage = "none";
            players[player].updateGun();
        } else if (players[player].health > 100){
            players[player].health = 100;
        }
    }
}

function spawnItems(){
    if (Math.round((gameTime - startTime)/1000) % 5 == 0 && items.length < 15 && startSetup == true){
        createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 40, 20, possibleWeapons[randint(0, possibleWeapons.length-1)], "weapon"));
        createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 40, 20, possibleWeapons[randint(0, possibleWeapons.length-1)], "weapon"));
        createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 40, 20, possibleWeapons[randint(0, possibleWeapons.length-1)], "weapon"));
        createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 40, 20, possibleWeapons[randint(0, possibleWeapons.length-1)], "weapon"));
        createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 20, 20, "Battery", "utility"));
        createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 20, 20, "Battery", "utility"));
        createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 30, 30, "Health Pack", "utility"));
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
            items[items.length-1].x = randint(0, mapLength);
            items[items.length-1].y = randint(0, mapWidth);
        }
    }
}

function createEntity(entity){
    entities.push(entity);
    var collision = true;
    while (collision == true){
        collision = false;
        for (i = 0; i < walls.length; i ++){
            if (rectRectDetect(walls[i], entities[entities.length -1])){
                collision = true;
            }
        }
        if (collision){
            entities[entities.length-1].x = randint(0, mapLength);
            entities[entities.length-1].y = randint(0, mapWidth);
        }
    }
}


function updatePower(){
    if (startSetup == true){
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
}

function openDoor(i){
    if (walls[i].length > walls[i].width){
        walls[i].xSpeed = 1;
    } else {
        walls[i].ySpeed = 1;
    }
    walls[i].openedTime = gameTime;
}

function checkForGenerators(){
    generatorCount = 0;
    for (i = 0; i < entities.length; i++){
        if (entities[i].name == "Generator" && entities[i].colour == "green"){
            generatorCount ++;
        }
    }

    if (generatorCount == 4){
        for (player in players){
            if (players[player].team == "Survivor"){
                players[player].power = 100;
            }
        }
    } else if (generatorCount == 0){
        for (player in players){
            if (players[player].team == "Survivor"){
                players[player].power = 0;
            }
        }
    }
}

function checkForSurvivors(){
    playerCount = 0;
    survivorCount = 0;
    insurgentCount = 0;
    alienCount = 0;

    for (player in players){
        if (players[player].team != "Ghost"){
            playerCount ++;
        }

        if (players[player].team == "Survivor"){
            survivorCount ++;
        }

        if (players[player].team == "Insurgent" || players[player].team == "Insurgent Officer"){
            insurgentCount ++;
        }
        if (players[player].team == "Alien"){
            alienCount ++;
        }
    }


    if (timeSinceStart > 15*1000 || event != "No Event"){
        if (survivorCount == 0 && endGameTime == 0 && alienCount == 0){
            endGameTime = gameTime;
            winners = "Insurgents";
        } else if (insurgentCount == 0 && endGameTime == 0 && alienCount == 0){
            endGameTime = gameTime;
            winners = "Survivors";
        } else if (insurgentCount == 0 && survivorCount == 0 && endGameTime == 0){
            endGameTime = gameTime;
            winners = "Aliens";
        }
    }

    if (playerCount < 3 && startSetup == false){
        d = new Date();
        gameTime = d.getTime();
        startTime = d.getTime();
        endGameTime = 0;
    }
}

function checkForEndGame(){
    if (gameTime - endGameTime > 10*1000 && endGameTime != 0){
        for (player in players){
            players[player].team = "Undecided";
            players[player].power = 100;
            players[player].powerUsage = "Medium";
            players[player].weaponName = "None";
            players[player].updateGun();
            players[player].health = 100;
            players[player].x = randint(0, mapLength);
            players[player].y = randint(0, mapWidth);
            players[player].checkLocation();
        }
        d = new Date();
        gameTime = d.getTime();
        startTime = d.getTime();
        endGameTime = 0;
        timeSinceStart = 0;
        items = [];
        event = "No Event";
        entities = [new Entity (1350, -350, 200, 200, "RESPAWN STATION", "blue")];
        eventActivated = false;
        deadBodies = [];
        startSetup = false;
        winners = "none";
    }
}

function assignRoles (){
    if (timeSinceStart > 10* 1000 && playerCount >= 3 && startSetup == false){
        startSetup = true;
        var random;
        for (player in players){
            players[player].team = "Survivor";
        }
        if (playerCount < 5){
            random = socketList[randint(0, socketList.length - 1)];
            players[random].team = "Insurgent";
        } else {
            random = socketList[randint(0, socketList.length - 1)];
            players[random].team = "Insurgent";
            random = socketList[randint(0, socketList.length - 1)];
            while (players[random].team == "Insurgent"){
                random = socketList[randint(0, socketList.length - 1)];
            }
            players[random].team = "Insurgent";  
        }
        spawnStartItems();
    } else if (timeSinceStart > 60*1000 && eventActivated == false){
        eventActivated = true;
        timeSinceStart = 0;
        event = randomEvents[randint(0, randomEvents.length-1)];
        d = new Date();
        gameTime = d.getTime();
        startTime = d.getTime();
        endGameTime = 0;
        timeSinceStart = 0;
        eventActivated = false;
        if (event == "Rescue Operation"){
            for (player in players){
                if (players[player].team == "Ghost"){
                    players[player].team = "Rescue Officer";
                    players[player].weaponName = "Rifle";
                    players[player].health = 100;
                    players[player].power = 100;
                    players[player].powerUsage = "Medium";
                    players[player].updateGun();
                    players[player].x = 1350 + randint(0, 200);
                    players[player].y = -350 + randint(0, 200);
                    //1350, -350, 200, 200
                }
            }
        }else if (event == "Aliens"){
            for (player in players){
                if (players[player].team == "Ghost"){
                    players[player].team = "Alien";
                    players[player].weaponName = "Melee";
                    players[player].powerUsage = "N/A";
                    players[player].power = 100;
                    players[player].health = 100;
                    players[player].updateGun();
                    players[player].x = 1350 + randint(0, 200);
                    players[player].y = -350 + randint(0, 200);
                    //1350, -350, 200, 200
                }
            }
        } else if (event == "Insurgent Arrival"){
            for (player in players){
                if (players[player].team == "Ghost"){
                    players[player].team = "Insurgent Officer";
                    players[player].weaponName = "Grenade Launcher";
                    players[player].powerUsage = "Medium";
                    players[player].power = 100;
                    players[player].health = 100;
                    players[player].updateGun();
                    players[player].x = 1350 + randint(0, 200);
                    players[player].y = -350 + randint(0, 200);
                }
            }
        }
    }
}

function doorUpdate(){
    for(i = 0; i< walls.length; i++){
        walls[i].x += walls[i].xSpeed;
        walls[i].y += walls[i].ySpeed;
        if (walls[i].x > walls[i].limitX){
            walls[i].xSpeed = -1;
        } else if (walls[i].y > walls[i].limitY){
            walls[i].ySpeed = -1;
        }

        if (walls[i].x <= walls[i].limitX - walls[i].length){
            walls[i].xSpeed = 0;
        }
        if (walls[i].y <= walls[i].limitY - walls[i].width){
            walls[i].ySpeed = 0;
        }

        for (player in players){
            if (rectCircDetect(walls[i], players[player])){
                if (walls[i].xSpeed < 0){
                    players[player].x = walls[i].x - players[player].r/2;
                } else if (walls[i].ySpeed < 0){
                    players[player].y = walls[i].y - players[player].r/2;
                }
            }
            if (rectCircDetect(walls[i], players[player]) && players[player].team != "Ghost"){
                players[player].health -= 5;
            }
        }
    }
}

function spawnStartItems(){
    createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 40, 20, possibleWeapons[randint(0, possibleWeapons.length-1)], "weapon"));
    createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 40, 20, possibleWeapons[randint(0, possibleWeapons.length-1)], "weapon"));
    createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 40, 20, possibleWeapons[randint(0, possibleWeapons.length-1)], "weapon"));
    createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 20, 20, "Battery", "utility"))
    createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 20, 20, "Battery", "utility"));
    createItem(new Item(randint(0, mapLength), randint(0, mapWidth), 30, 30, "Health Pack", "utility"));

    createEntity(new Entity (randint(0, mapLength), randint(0, mapWidth), 100, 100, "Generator", "green"));
    createEntity(new Entity (randint(0, mapLength), randint(0, mapWidth), 100, 100, "Generator", "green"));
    createEntity(new Entity (randint(0, mapLength), randint(0, mapWidth), 100, 100, "Generator", "red"));
    createEntity(new Entity (randint(0, mapLength), randint(0, mapWidth), 100, 100, "Generator", "red"));
}

function getSocketList(){
    socketList = [];
    for (player in players){
        socketList.push(player);
    }
}