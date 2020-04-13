var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');
var bird = new Image();
var background = new Image();
var frontground = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();
var gameOverImage = new Image();
var flySound = new Audio();
var scoreSound = new Audio();
var soundGame = new Audio();

bird.src='./assets/img/flappy_bird_bird.png';
background.src='./assets/img/flappy_bird_bg.png';
frontground.src='./assets/img/flappy_bird_fg.png';
pipeUp.src='./assets/img/flappy_bird_pipeUp.png';
pipeBottom.src='./assets/img/flappy_bird_pipeBottom.png';
gameOverImage.src='./assets/img/flappy_bird_bg_game_over.png';
flySound.src='./assets/audio/fly.mp3';
scoreSound.src='./assets/audio/score.mp3';
soundGame.src='./assets/audio/game.mp3';

var gap = 100;
var birdXPosition=10;
var birdYPosition=150;
var gravityValue = 1.5  ;
var flyValue = 35;
var score = 0;
var gameOver = false;
var pipe =[];
pipe[0] = {
  x : cvs.width,
  y : 0
}

function draw(){
  if(gameOver===true){
    soundGame.pause();
    ctx.clearRect(10, 10, 100, 100);  
    ctx.drawImage(gameOverImage, 0, 0);
    return;
  }

  ctx.drawImage(background, 0, 0);
  soundGame.play();  

  //draw blocks
  for(var i = 0; i < pipe.length; i++){
    ctx.drawImage(pipeUp, pipe[i].x,  pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
    pipe[i].x--;

    //create new block
    if(pipe[i].x==125){
      pipe.push({
        x : cvs.width,
        y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
      });
    }

    //collision tracking
    if(birdXPosition + bird.width >= pipe[i].x 
      && birdXPosition <= pipe[i].x + pipeUp.width 
      && (birdYPosition <= pipe[i].y + pipeUp.height
      || birdYPosition + bird.height >= pipe[i].y + pipeUp.height + gap)
      || birdYPosition + bird.height >= cvs.height - frontground.height){
        restartGameSound();
        gameOver = true;
    }
    if(pipe[i].x==5){
      score++;
      scoreSound.play(); 
    }
  }

  ctx.drawImage(frontground, 0, cvs.height - frontground.height);
  ctx.drawImage(bird, birdXPosition, birdYPosition);
  ctx.fillStyle = '#000';
  ctx.font = '24px Verdana';
  ctx.fillText ("Score:" + score, 10, cvs.height-50  );

  birdGravity();  
  requestAnimationFrame(draw);     
}

function birdGravity(){
  birdYPosition+=gravityValue;
}

function birdFly(event){
  console.log(event);
  if(gameOver===true){
    gameOver=false;
    location.reload();
  }
  birdYPosition-=flyValue;
  flySound.play();
}

//sound -game over
function restartGameSound(){
  var restartGame = new Audio();
  restartGame.src='./assets/audio/restartGame.mp3';
  restartGame.play();
}

//pause 1000, because speed hosting not wery fast 
setTimeout(draw, 1000);

document.addEventListener('keydown',birdFly)
document.addEventListener('click',birdFly)
document.addEventListener('touchstart', birdFly)
