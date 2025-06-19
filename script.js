// board
let board = document.querySelector("#board");
let boardWidth = 900;
let boardHeight = 600;
let context;

// spaceship
let shipWidth = 90;
let shipHeight = 95;
let shipX = (boardWidth/2) - 45;
let shipY = boardHeight - shipHeight;
let shipImg;

let ship = {
    x: shipX,
    y: shipY,
    height: shipHeight,
    width: shipWidth
}

// meteors
let meteorWidth = 60;
let meteorHeight = 60;
let meteorY = 0;

let meteorArray = [];

let meteorImg;

// bullets
let bulletWidth = 10;
let bulletHeight = 10;
let bulletX;
let bulletY = shipY;

let bulletArray = [];

let bulletVelocity = 8;




// physics
let velocityY = 5;
let velocityX = 0;

let gameOver = false;
let score = 0;

// when the page loads
function main(){
    window.onload = () => {
        
        board.height = boardHeight;
        board.width = boardWidth;
    
        context = board.getContext("2d"); // this is use for drawing on the board
    
        // drawing ship
        shipImg = new Image();
        shipImg.src = "./images/spaceship.svg"
        
        shipImg.onload = () => {
            context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
        }
    
        meteorImg = new Image();
        meteorImg.src = "./images/meteor.svg";
        
    
        requestAnimationFrame(update);
    
        setInterval(placeMeteors, 1000);
    
        document.addEventListener("keydown", (e) => {
            moveShip(e);
            shoot(e);
            restart(e);
        })
        // document.addEventListener("keydown", moveShip)
        // document.addEventListener("keydown", shoot)
    
        // document.addEventListener("keydown", restart)
    }
}

const update = () => {
    requestAnimationFrame(update);

    if(gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height)

    // ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    // meteor
    meteorArray.forEach((meteor) => {
        meteor.y += velocityY;
        context.drawImage(meteor.img, meteor.x, meteor.y, meteor.width, meteor.height);

        if(detectCollision(ship, meteor)){
            gameOver= true;

            let audio = new Audio("./audio/gameover.wav");
            audio.play();

            document.querySelector("h1").innerHTML = "Game Over! Press Space to Restart"
        }
    })

    // bullets
    bulletArray.forEach((bullet) => {
        bullet.y += -bulletVelocity;
        context.fillStyle = "#00ff22";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)

        for(let i = 0; i < meteorArray.length; i++){
            if(detectCollision(bullet, meteorArray[i])){
                destroyMeteor(i);
                let audio = new Audio("./audio/hit.wav");
                audio.play();
                score++;
                document.querySelector("#score").innerHTML = `Score: ${score}`;
            }
        }
    })
}

const moveShip = (e) => {
    if(gameOver){
        return;
    }

    if(e.key === "ArrowRight" && ship.x < boardWidth-shipWidth){
        velocityX = 4;
        ship.x += velocityX;
    }
    else if(e.key === "ArrowLeft" && ship.x > 0){
        velocityX = -4;
        ship.x += velocityX;
    }
}

const placeMeteors = () => {
    if(gameOver){
        return;
    }

    let meteor = {
        img: meteorImg,
        x: null,
        y: meteorY,
        height: meteorHeight,
        width: meteorWidth
    }

    let meteorX = Math.random()*boardWidth - meteorWidth;

    if(meteorX > 50){
        meteor.x = meteorX;
        meteorArray.push(meteor);
    }

    if(meteorArray.length === 5){
        meteorArray.shift(); // remove last item from array
    }
}

const detectCollision = (a,b) => {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

const restart = (e) => {
    if(e.key === " " && gameOver){
        gameOver = false;
        meteorArray = []
        document.querySelector("h1").innerHTML = "Space Shooter"
        bulletArray = []
        score = 0
        document.querySelector("#score").innerHTML = `Score: ${score}`;
    }
}

const shoot = (e) => {
    if(gameOver){
        return;
    }

    let bullet = {
        x: null,
        y: bulletY,
        height: bulletHeight,
        width: bulletWidth
    }

    bulletX = ship.x + (ship.width/2);
    bullet.x = bulletX

    if(e.key === "ArrowUp"){
        bulletArray.push(bullet)
        let audio = new Audio("./audio/shoot.wav");
        audio.play();
    }

    if(bulletArray.length === 35){
        bulletArray.shift()
    }
}

const destroyMeteor = (index) => {
    meteorArray = meteorArray.filter((meteor) => {
        if(meteor !== meteorArray[index]){
            return meteor;
        }
    })
    
}

main()