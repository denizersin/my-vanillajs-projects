let aud = document.querySelector('audio');
let allLoads = {
    loads: 60,
    check: function () {
        this.loads -= 1;
        if (this.loads == 0) {
            //We are ready;
        }
    }
}

let CANVAS_WIDTH = 390;
const CANVAS_HEIGHT = 700;

const FPS = 50;

let ultiContainer = document.getElementById('skillContainer');

const canvas = document.getElementById('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');


var canvasXY = canvas.getBoundingClientRect();


let backImage = new Image();
backImage.src = `./back.jpg`;
backImage.onload = () => {
    //ctx.drawImage(backImage, 0, 0, 423, 757, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}


function setNewLevelAnim(level, animTime = 2) {
    let spanEL = document.querySelector('span');
    spanEL.style.display = "inline-block";
    spanEL.innerHTML = `${'LEVEL ' + level}`;
    spanEL.classList.add('levelAnim');
    setTimeout(() => {
        spanEL.classList.remove('levelAnim');
        spanEL.style.display = "none";
    }, animTime * 1000);
}

setNewLevelAnim(1);

let startButton = document.querySelector('.start-btn');

let LEVEL;
startButton.addEventListener('click', () => {
    GAME.LEVEL = new Level(GAME, 1);
    setTimeout(() => {
        GAME.LEVEL.start();
        fire();
    }, 1000);
    startButton.style.display = 'none';
});

class Game {

    constructor(src) {
        this.json;
        this.LEVEL;
        this.requestGameJson();
        this.burstsAssets = undefined;//will be arr(gettin json)
        this.enmMovementMethods = undefined;
        this.gameAssets = undefined;
    }
    requestGameJson() {
        fetch(`${`./src/items/game.json`}`)
            .then(response => {
                return response.json();
            })
            .then(jsondata => {
                setJsonObjNumber(jsondata);
                this.setProps(jsondata);
            });
    }
    setProps(jsondata) {
        //setBursts

        setSameProps(this, jsondata);

        for (const key in this.enmMovementMethods) {
            this.enmMovementMethods[key] = new Function(this.enmMovementMethods[key]);
        }

        //get burstsImages
        for (const key in this.burstsAssets) {
            this.burstsAssets[key].image = new Image();
            this.burstsAssets[key].image.src = './src/items/bursts/' + this.burstsAssets[key].imageName;
            this.burstsAssets[key].image.onload = () => { console.log(this.burstsAssets[key].imageName, 'alinidi') }
        }
        let i = 0;
        for (const key in this.gameAssets) {
            let img = new Image();
            img.src = `${`./src/items/gameAssets/` + key}`;
            console.log(`${`./src/items/gameAssets/` + key}`);
            this.gameAssets[key] = img;
            i++;
        }



    }
}
const GAME = new Game();
setTimeout(() => {
    console.log(GAME.gameAssets);
}, 2000);

class Level {
    constructor(GAME, level) {
        this.GAME = GAME;
        this.level = 1;
        this.mainCharacter;
        this.enemies = [];
        this.existEnemies = [];
        this.enemyBullets = [[], []]; //rectArr and circleArr
        this.characterBullets = [[], []];//rectArr and circleArr
        this.anims = [];
        this.infoJson;
        this.bursts = [];
        this.init(level);
    }
    init() {
        //init this level item
    }
    collision() {
        //enemB?character rectBUllets
        let enmB = this.enemyBullets[0];
        let bool = false;
        for (let i = 0; i < enmB.length; i++) {
            if (enmB[i].x < -50 || enmB[i].x > CANVAS_WIDTH + 50 || enmB[i].y > CANVAS_HEIGHT + 50 || enmB[i].y < -50) {
                popping(enmB, i);
                break;
            }
            for (const rects of this.mainCharacter.collisionRects) {
                if (isRectsColl(enmB[i].x, enmB[i].y, enmB[i].w, enmB[i].h, rects[0] + this.mainCharacter.x, rects[1] + this.mainCharacter.y, rects[2], rects[3])) {
                    if (!this.mainCharacter.protect) {
                        this.mainCharacter.hitting();
                        this.mainCharacter.currentHealth -= enmB[i].power;
                        if (this.mainCharacter.currentHealth <= 0) { //character is dead
                            this.bursts.push(new BurstAnim(this.GAME, this, 'squareBombAnim', this.mainCharacter.x, this.mainCharacter.y, this.mainCharacter.w, this.mainCharacter.w));
                        }
                    }
                    popping(enmB, i); //remove enmB
                    break;
                }

            }
            if (bool) break;
        }


        //chb?enemies rectBullets
        let chB = this.characterBullets[0];
        let exEnms = this.existEnemies;
        bool = false;
        let bool2 = false;
        for (let i = 0; i < chB.length; i++) {
            if (chB[i].x < -50 || chB[i].x > CANVAS_WIDTH + 50 || chB[i].y > CANVAS_HEIGHT + 50 || chB[i].y < -50) {
                popping(chB, i);
                break;
            }
            for (let j = 0; j < exEnms.length; j++) {
                for (const rects of exEnms[j].collisionRects) {
                    if (isRectsColl(chB[i].x, chB[i].y, chB[i].w, chB[i].h, rects[0] + exEnms[j].x, rects[1] + exEnms[j].y, rects[2], rects[3])) {
                        exEnms[j].hitting();
                        if (chB[i].type == 'rect-rocket') {
                            this.bursts.push(new BurstAnim(this.GAME, this, 'squareBombAnim', chB[i].x + chB[i].h, chB[i].y + chB[i].h, chB[i].h, chB[i].h));
                            exEnms[j].Vy *= 0.7;
                        }
                        exEnms[j].currentHealth -= chB[i].power;
                        if (exEnms[j].currentHealth <= 0) {
                            //enemy is dead
                            this.bursts.push(new BurstAnim(this.GAME, this, 'squareBombAnim', exEnms[j].x, exEnms[j].y, exEnms[j].w, exEnms[j].w));
                            if (this.existEnemies[j].repeat != 0) {
                                this.existEnemies[j].setRepeatState();
                                this.existEnemies[j].repeat -= 1;
                            }
                            else {
                                exEnms[j].draw = () => { }
                                setTimeout(() => {
                                    popping(exEnms, j);
                                }, 0);
                            }
                            bool = true;
                        }
                        popping(chB, i); //remove 
                        bool2 = true;
                        break;
                    }
                }
                if (bool2 || bool) break;
            }
            if (bool) break;
        }


        //collision circle bullets...


    }


    update() {
        this.collision();
        this.mainCharacter.update();
        for (const iterator of this.existEnemies) {
            iterator.update();
        }
        for (let i = 0; i < 2; i++) { //we have 2 bullet type


            for (const iterator of this.characterBullets[i]) {
                iterator.update();
            }
            for (const iterator of this.enemyBullets[i]) {
                iterator.update();
            }
        }

    }
    draw() {
        //bullets
        for (let i = 0; i < 2; i++) { //we have 2 bullet type

            for (const iterator of this.characterBullets[i]) {
                iterator.draw();
            }
            for (const iterator of this.enemyBullets[i]) {
                iterator.draw();
            }
        }
        this.mainCharacter.draw();
        for (const iterator of this.existEnemies) {
            iterator.draw();
        }



        for (const iterator of this.bursts) {
            iterator.draw();
        }
        if (this.mainCharacter.protect) {
            //boyuta ve kordinat yeterince goreceli degil....
            ctx.drawImage(this.GAME.gameAssets['protect.png'], 0, 0, 100, 100, this.mainCharacter.x, this.mainCharacter.y - (100 - this.mainCharacter.h) / 2, this.mainCharacter.w, this.mainCharacter.w);
        }
    }


    setEnemies() {
        //when we get enemiesAssets set enemiesStart for existEnemis (startx,y startDelay vss)
        for (let i = 0; i < this.enemies.length; i++) {
            setTimeout(() => {
                this.existEnemies.push(this.enemies[i]);
                this.enemies[i].setMovement();
            }, this.enemies[i].delay * 1000);
        }

    }
    start() {
        let self = this;
        this.mainCharacter.x = 100;
        this.mainCharacter.y = 500;

        //detect mobıle or broser and set move event
        if (detectMob()) {
            document.documentElement.addEventListener('touchmove', (e) => {
                self.mainCharacter.x = e.touches[0].clientX - canvasXY.left - self.mainCharacter.w / 2;
                self.mainCharacter.y = e.touches[0].clientY - canvasXY.top - self.mainCharacter.h / 2;
            });
        }
        else {
            canvas.addEventListener('mousemove', (event) => {
                this.mainCharacter.x = event.clientX - canvasXY.left - this.mainCharacter.w / 2;
                this.mainCharacter.y = event.clientY - canvasXY.top - this.mainCharacter.h / 2;
            });
        }






        this.setEnemies();

        setInterval(() => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            // ctx.drawImage(backImage, 0, 0, 423, 757, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            ctx.beginPath();
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.stroke();
            this.update();
            this.draw();
        }, 1000 / FPS);

        //setTiimer,events vb..

        //set ultiBullets burdasin
        this.mainCharacter.fireUlti = function () {
            let box = this.infoJson.ultiRocketProps, pieces = 10;
            for (let i = 0; i < pieces; i++) {
                this.LEVEL.characterBullets[0].push(new Bullet(this.LEVEL, this, this.GAME.gameAssets['rocket1.png'], box.isEnemy, box.direction, 40 * i, CANVAS_HEIGHT - box.h, box.w, box.h, box.aw, box.ah, box.Vx, box.Vy, box.dVx, box.dVy, box.power, box.type));
            }
        }
        console.log(ultiContainer);
        ultiContainer.children[0].style.display = "block";
        ultiContainer.children[1].style.display = "block";
    }

}
Level.prototype.init = function (level) {
    //set main character and eneimes
    this.mainCharacter = new Aircraft(GAME, this, `${`./src/items/main-aircraft`}`);
    this.characterBullets = this.mainCharacter.bullets;

    //set level enemies
    fetch(`${`./src/items/level` + level + `/level` + level + `.json`}`)
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
            setJsonObjNumber(jsondata);
            this.infoJson = jsondata;
            let prices = jsondata.enemy_prices;
            for (let i = 1; i < prices + 1; i++) {
                this.enemies.push(new Aircraft(GAME, this, `${`./src/items/level` + this.level + `/enemy` + i}`));
            }
        });

    //get burstAssets


}
class Aircraft {
    constructor(GAME, LEVEL, src) {
        this.GAME = GAME;
        this.bulletsProps = undefined; //json.bullets
        this.bullets = [[], []];
        this.collisionRects = [];
        this.movementName = undefined;
        this.setMovement = undefined; // method  will may be taken from json.(query movement name and set setMovement method)
        this.isEnemy = undefined;
        this.image = undefined;
        this.hitImage = undefined;
        this.currenImage = undefined;
        this.delay = undefined;
        this.w = undefined;
        this.h = undefined;
        this.currentHealth = undefined;
        this.startHealth = undefined;
        this.x = undefined;
        this.y = undefined;
        this.Vx = undefined;
        this.Vy = undefined;
        this.dVx = undefined;
        this.dVy = undefined;
        this.infoJson = undefined;
        this.LEVEL = LEVEL;
        this.repeat = undefined;
        this.protect = false;
        this.requestLevelJson(src);
    }
    update() {

        this.x += this.Vx;
        this.y += this.Vy;
        this.Vx += this.dVx;
        this.Vy += this.dVy;
        if (this.y > CANVAS_HEIGHT) {
            if (this.repeat != 0) {
                this.setRepeatState();
                this.repeat -= 1;
            }
        }
    }

    draw() {
        ctx.drawImage(this.currenImage, 0, 0, this.w, this.h, this.x, this.y, this.w, this.h);
    }
    fire() {
        if (this.y + this.h < 0) return;
        //this.bulletProps.index==bulletImage
        let box = this.bulletsProps;
        let pushThat = this.isEnemy ? this.LEVEL.enemyBullets : this.LEVEL.characterBullets;

        for (const box of this.bulletsProps) {
            let pushIndex = box.type == 'rect' ? 0 : box.type == 'circle' ? 1 : null;
            pushIndex = 0;// aircharf.bullets=[[],[]], 1. index kare mermiler idi. 2.index circle simdilik circle de kare gibi davransin...
            if (pushIndex == null) {
                alert('bulletsProps.type okunamadi');
            }
            pushThat[pushIndex].push(new Bullet(this.LEVEL, this, this.GAME.gameAssets[box.image], box.isEnemy, box.direction, box.x + this.x, box.y + this.y, box.w, box.h, box.aw, box.ah, box.Vx, box.Vy, box.dVx, box.dVy, box.power, box.type));
        }
    }

    hitting() {
        this.currenImage = this.hitImage;
        setTimeout(() => {
            this.currenImage = this.image;
        }, 200);
    }
    requestLevelJson(src) {
        fetch(`${src + `/this.json`}`)
            .then(response => {
                return response.json();
            })
            .then(jsondata => {
                setJsonObjNumber(jsondata);
                this.setCharacterProps(src, jsondata);
            });
    }
    setCharacterProps(src, jsondata) {
        allLoads.check(1);//for json
        this.infoJson = jsondata;
        console.log(jsondata)
        setSameProps(this, jsondata.objProps);
        this.bulletsProps = jsondata.bulletsProps;


        this.collisionRects = jsondata.collisionRects;
        //set image and hitImage
        this.currenImage = this.GAME.gameAssets[this.image];
        this.image = this.GAME.gameAssets[this.image];
        this.hitImage = this.GAME.gameAssets[this.hitImage];
        console.log(this.image, this.hitImage);

        //setBUlletImage
        /*        console.log(this.bulletsProps);
            for (const iterator of this.bulletsProps) {
                iterator.image = this.GAME.gameAssets[iterator.image];
            }*/
        console.log(this.bulletsProps);
        //set setMovement method;
        if (this.movementName != "none") {
            this.setMovement = this.GAME.enmMovementMethods[this.movementName];
        }
        console.log(this);
        if (this.setMovement == undefined && this.movementName != "none") {
            console.log(jsondata);
        }
        //set random START

        this.x = random(0, CANVAS_WIDTH - this.w);
        this.y = random(-100, -250);
        //set random delay if it's 0
        this.delay = this.delay == 0 ? this.delay = random(4, 10) : this.delay;
    }
    setRepeatState() {
        this.Vx = 0;
        this.Vy = this.dVy == 0 ? this.Vy : 0;
        this.currentHealth = this.startHealth;
        this.x = random(0, CANVAS_WIDTH - this.w);
        this.y = random(-100, -200);
    }
}

class Bullet {
    constructor(LEVEL, aircraft, image, isEnemy, direction, x, y, w, h, aw, ah, Vx, Vy, dVx = 0, dVy = 0, power, type) {
        this.LEVEL = LEVEL;
        this.aircraft = aircraft;
        this.isEnemy = isEnemy;
        this.target; //for guided bullets
        this.direction = direction;
        this.image = image;
        this.aw = aw;
        this.ah = ah;
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.Vx = Vx;
        this.Vy = Vy;
        this.Vy *= isEnemy ? 1 : -1;
        this.dVx = dVx || 0;
        this.dVy = dVy || 0;
        this.power = power;
        this.type = type;
        this.setDirection();
    }
    update() {
        this.x += this.Vx;
        this.y += this.Vy;
        this.Vx += this.dVx;
        this.Vy += this.dVy;
    }
    draw() {
        ctx.drawImage(this.image, 0, 0, this.aw, this.ah, this.x, this.y, this.w, this.h);
    }
    setDirection() {
        if (this.direction == `constant-linear`) {
            return;
        }
        let rnd = random(0, this.LEVEL.existEnemies.length - 1);

        if (this.isEnemy) this.target = this.LEVEL.mainCharacter;
        else if (this.LEVEL.existEnemies.length != 0) {
            this.target = this.LEVEL.existEnemies[rnd];
            while (this.target == undefined) {
                rnd = random(0, this.LEVEL.existEnemies.length - 1);
                this.target = this.LEVEL.existEnemies[rnd];
            }
        }
        if (this.target == undefined) return;
        let yd = this.y - this.target.y;
        let xd = this.x - (this.target.x + this.target.w / 2);
        if (yd < 0) {
            this.Vy *= -1;
            xd *= 1.15;
        }
        else xd *= 0.85;

        if (this.direction == 'guided-parabolic') {
            let yarrt = Math.abs(yd / this.Vy);
            this.Vx = -1 * xd / yarrt;
        }
        else {
            this.Vy = this.isEnemy ? 8 : -8;
            this.dVx = 0;
            this.dVy = 0;
            this.Vx = 0;
        }

    }
}


//will be a square

class BurstAnim {

    constructor(GAME, LEVEL, requestedAnimName, x, y, w2, h2) {
        this.GAME = GAME;
        this.LEVEL = LEVEL;
        this.ft = 0; //frame Time
        this.i = 0;
        this.brustObj = undefined;
        this.x = x + (w2 / 2); //x and y will be center point
        this.y = y + (h2 / 2);
        this.w;
        this.h;
        this.w2 = w2;
        this.h2 = h2;
        this.setProps(requestedAnimName);
        if (this.LEVEL.bursts.length != 0) //imha et
            setTimeout(() => { this.LEVEL.bursts.pop(); }, ((1000 / FPS) * this.LEVEL.bursts[0].ft) + 50);
    }

    setProps(requestedAnimName) {
        let bA = findKeyReturnValue(this.GAME.burstsAssets, requestedAnimName);
        this.brustObj = bA;
        this.ft = bA.pieces * bA.pieces;
        this.w = bA.w / bA.pieces;
        this.h = bA.h / bA.pieces;
        return;
    }

    draw() {
        if (this.i <= 25) {
            ctx.drawImage(this.brustObj.image, (this.i % 5) * this.w, Math.floor((this.i / 5)) * this.h, this.w, this.h, this.x - this.w / 2, this.y - this.h / 2, this.w2, this.h2);
            this.i += 1;
        }
    }
}



function fire() {
    setTimeout(() => {
        setInterval(() => {
            GAME.LEVEL.mainCharacter.fire();

        }, 500);
        setInterval(() => {
            aud.play();
            
        }, 150);

    }, 3000);
    setInterval(() => {
        for (const iterator of GAME.LEVEL.existEnemies) {
            iterator.fire();

        }
    }, 1000);
}

function isRectsColl(x1, y1, w1, h1, x2, y2, w2, h2) {

    if (x1 + w1 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
        return true;
    }
    return false;
}


function setJsonObjNumber(jsondata) {
    for (const key in jsondata) {
        if (typeof jsondata[key] == 'object') {
            setJsonObjNumber(jsondata[key]);
        }
        else {
            if (!isNaN(jsondata[key])) jsondata[key] = Number(jsondata[key]);
        }
    }
}

function setSameProps(obj1, obj2) {
    for (const key1 in obj1) {
        for (const key2 in obj2) {
            if (key1 == key2) {
                obj1[key1] = obj2[key2];
                break;
            }
        }
    }
}

function popping(arr, index) {
    let temp = arr[index];
    arr[index] = arr[arr.length - 1];
    arr[arr.length - 1] = temp;
    arr.pop();
}
function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function findKeyReturnValue(obj, skey) {
    for (const key in obj) {
        if (key == skey) {
            return obj[key];
        }
    }
}

setTimeout(() => {

}, 5000);

ultiContainer.children[0].addEventListener('click', () => {
    GAME.LEVEL.mainCharacter.fireUlti();
    ultiContainer.children[0].style.display = "none";
    setTimeout(() => {
        ultiContainer.children[0].style.display = "block";
    }, 30);
});

ultiContainer.children[1].addEventListener('click', () => {
    GAME.LEVEL.mainCharacter.protect = true;
    ultiContainer.children[1].style.display = "none";
    setTimeout(() => {
        ultiContainer.children[1].style.display = "block";
    }, 15000);
    setTimeout(() => {
        GAME.LEVEL.mainCharacter.protect = false;
    }, 7000);
});

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}