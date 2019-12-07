let line1, line2, ball;
let point1 = 0;
let point2 = 0;
let diffSpeed = 1;
let diffSize = 1;

function startGame(difficulty) {
    gameCanvas.start();
    if (difficulty == 'easy') {
        diffSize = 50;
        diffSpeed = 5;
    }
    if (difficulty == 'normal') {
        diffSize = 40;
        diffSpeed = 6;
    }
    if (difficulty == 'hard') {
        diffSize = 30;
        diffSpeed = 10;
    }
    document.getElementById('diff').style.display = 'none';

    line1 = new canvasComponent(8, diffSize, "white", 20, 150);
    line2 = new canvasComponent(8, diffSize, "white", 670, 150);
    ball = new canvasComponent(7, 7, 'red', 350, 170);
    scoreUser1 = new canvasComponent("16px", "Consolas", "white", 200, 25, "text");
    scoreUser2 = new canvasComponent("16px", "Consolas", "white", 410, 25, "text");
}
let gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 700;
        this.canvas.height = 390;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 30);
        window.addEventListener('keydown', function (e) {
            gameCanvas.keys = (gameCanvas.keys || []);
            gameCanvas.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            gameCanvas.keys[e.keyCode] = false;
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function canvasComponent(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = gameCanvas.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.isGoingToCrash = function (otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    // # Hockey Control
    if (line1.y <= 0) {
        line1.y = 0;
    }
    if (line1.y >= 350) {
        line1.y = 350;
    }
    if (line2.y <= 0) {
        line2.y = 0;
    }
    if (line2.y >= 350) {
        line2.y = 350;
    }
    // # Keyboard Checker
    if (gameCanvas.keys && gameCanvas.keys[87]) {
        line1.y -= diffSpeed;
        if (ball.isGoingToCrash(line1)) {
            ball.speedY = -4;
            ball.speedX = 14;
        }
    }
    if (gameCanvas.keys && gameCanvas.keys[83]) {
        line1.y += diffSpeed;
        if (ball.isGoingToCrash(line1)) {
            ball.speedY = 4;
            ball.speedX = 14;
        }
    }
    if (gameCanvas.keys && gameCanvas.keys[38]) {
        line2.y -= diffSpeed;
        if (ball.isGoingToCrash(line2)) {
            ball.speedY = -4;
            ball.speedX = -8;
        }
    }
    if (gameCanvas.keys && gameCanvas.keys[40]) {
        line2.y += diffSpeed;
        if (ball.isGoingToCrash(line2)) {
            ball.speedY = 4;
            ball.speedX = -8;
        }
    }
    // # Ball Movement
    ball.newPos();
    if (ball.isGoingToCrash(line1)) {
        ball.speedY = 0;
        ball.speedX = diffSpeed;
    } else if (ball.isGoingToCrash(line2)) {
        ball.speedY = 0;
        ball.speedX = -diffSpeed;
    } else {
        ball.x += -4;
    }
    if (ball.y <= 0) {
        ball.speedY = 4;
    }
    if (ball.y >= 390) {
        ball.speedY = -4;
    }
    if (ball.x <= 2) {
        ball.x = 690;
        point2 += 1;
    }
    if (ball.x >= 700) {
        ball.x = 0;
        point1 += 1;
    }
    gameCanvas.clear();
    line1.update();
    line2.update();
    ball.update();
    scoreUser1.text = "Score: " + point1;
    scoreUser2.text = "Score: " + point2;
    scoreUser1.update();
    scoreUser2.update();
}