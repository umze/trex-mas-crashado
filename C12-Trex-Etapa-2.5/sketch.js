var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var piclesGroup, picles1, picles2, picles3, picles4, picles5, picles6;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var jumpsound,checkpoint,die

var pontospontados = 0;

var newImage;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
 
  picles1 = loadImage("obstacle1.png");
  picles2 = loadImage("obstacle2.png");
  picles3 = loadImage("obstacle3.png");
  picles4 = loadImage("obstacle4.png");
  picles5 = loadImage("obstacle5.png");
  picles6 = loadImage("obstacle6.png");

  gameOver = loadImage("gameOver.png");
  resetBtn = loadImage("restart.png");

  jumpsound = loadSound("jump.mp3")
  checkpoint = loadSound("checkpoint.mp3")
  die = loadSound("die.mp3")
}

function setup() {
  createCanvas(600, 200);
  Over = createSprite(300,100)
  Over.addImage(gameOver)
  Over.scale = 0.5
  Over.visible = false
  reset = createSprite(300,150)
  reset.addImage(resetBtn)
  reset.scale = 0.5
  reset.visible = false
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  piclesGroup = new Group();
  cloudsGroup = new Group();

  trex.setCollider("rectangle", 0, 0, 45, trex.height)
}

function draw() {
  background("white");

  if(gameState === PLAY) {
    //pulo
    if(keyDown("space") && trex.y>=150) {
      trex.velocityY = -10;
      jumpsound.play()
    }
    ground.velocityX = -(4 + (3 * pontospontados) / 100)
    if(pontospontados > 0 && pontospontados % 100 === 0){
      checkpoint.play();
    }
    //chao
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //gerar nuvens
    spawnClouds();

    //PICLESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
    geradorPicles();
    ground.velocityX = -4;

    text("Pontos legais: " + pontospontados, 10,50)
    pontospontados = pontospontados + Math.round(frameCount / 60);
    

    if(trex.isTouching(piclesGroup)) {
      //gameState = END
      //die.play();
      trex.velocityY = -12;
      jumpsound.play();
    }
  }else if(gameState === END){ 
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    piclesGroup.setVelocityXEach(0);
    Over.visible = true
    reset.visible = true
    trex.changeAnimation("collided")
    piclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    if(mousePressedOver(reset)){
      piclesGroup.destroyEach()
      gameState = PLAY
      Over.visible = false
      reset.visible = false
      pontospontados = 0
      cloudsGroup.destroyEach()
      trex.changeAnimation("running")
    }
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  trex.collide(invisibleGround);



  drawSprites();
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;

    cloud.lifetime = 200;

    //ajustar a profundidade
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
    }
}

function geradorPicles() {
  if (frameCount % 60 === 0) {
    var picles = createSprite(600,165,10,40);
    picles.scale = 0.5
    picles.velocityX = -5;
    picles.velocityX = -(-5 + pontospontados / 100);
    var randomPicles = Math.round(random(1,6))
    console.log("picles" + randomPicles)
    picles.lifetime = 200;
    switch(randomPicles) {
      case 1: 
      picles.addImage(picles1);
      break;
      case 2: 
      picles.addImage(picles2);
      break;
      case 3: 
      picles.addImage(picles3);
      break;
      case 4: 
      picles.addImage(picles4);
      break;
      case 5: 
      picles.addImage(picles5);
      break;
      case 6: 
      picles.addImage(picles6);
      break;
    }
    piclesGroup.add(picles)
  }
}