import * as PIXI from 'pixi.js';
import { config } from './config';
import cloudPic from '../src/assets/cloud.png';
import airplane from '../src/assets/flight.png';
import lanetxt from '../src/assets/lanetxt.png';
import mashroomPic from '../src/assets/mashroom.png';
import './main.css';
import { isWhiteSpaceLike, updateMappedTypeNode } from 'typescript';

const {
    gameWidth,
    gameHeight,
} = config;

let planeSpeed = 50;
let bullets = [];
let clouds = [];
let bulletSpeed = 10;
let obj;
let mashroomSheet = {};
function createApplication(): PIXI.Application {
  const app = new PIXI.Application({
    // backgroundColor: 0x000000,
    width: gameWidth,
    height: gameHeight
  });
  app.renderer.resize(window.innerWidth, window.innerHeight);
  app.stage.scale.x = window.innerWidth / gameWidth;
  app.stage.scale.y = window.innerHeight / gameHeight;
  app.loader.add('mashroom', '../src/assets/mashroom.png');
  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.stage.scale.x = window.innerWidth / gameWidth;
    app.stage.scale.y = window.innerHeight / gameHeight;
  });
  return app;
}

function loadAssets(onComplete: () => void): void {
  const loader = PIXI.Loader.shared;
  loader.onComplete.once(onComplete);
  loader.load();
}

function render(app: PIXI.Application) {
  document.body.appendChild(app.view);
}

window.onload = () =>
  loadAssets(() => {
    const app = createApplication();
    const stage = app.stage;
    stage.interactive = true;
    stage.sortableChildren = true;
    var plane = new PIXI.TilingSprite(PIXI.Texture.from(airplane), 490, 350);
    plane.scale.x = 0.5;
    plane.scale.y = 0.5;
    // plane.hitArea = new PIXI.Rectangle(plane.x, plane.y, 200, 200);
    plane.zIndex = 101;
    plane.interactive = true;
    obj = plane;
    window.addEventListener('keydown', keysDown);
    

    var firePlane = new PIXI.TilingSprite(PIXI.Texture.from(lanetxt), 490, 370);
    firePlane.scale.x = 0.5;
    firePlane.scale.y = 0.5;
    firePlane.zIndex = 101;
    firePlane.interactive = true;
    // firePlane.hitArea = new PIXI.Rectangle(firePlane.x, firePlane.y, 200, 200);
    firePlane.tilePosition.x = 580;
    firePlane.tilePosition.y = -30;
    plane.on('mousedown', () => { 
      firePlane.y = obj.y;
      firePlane.x = obj.x;
      obj = firePlane;
      planeSpeed = 100;
      bulletSpeed = 50;
      stage.addChild(firePlane);
      stage.removeChild(plane);
    })
    firePlane.on('mousedown', () => { 
      plane.y = obj.y;
      plane.x = obj.x;
      planeSpeed = 10;
      bulletSpeed = 10;
      obj = plane;
      stage.addChild(plane);
      stage.removeChild(firePlane);
    })

    function updateCloud() {
      for (let i = 0; i < clouds.length; i++) { 
        clouds[i].x -= 1
        if (clouds[i].x < -500) { 
          stage.removeChild(clouds[i]);
          clouds.splice(i, 1);
        }
      }
    }

    function createCloud() {
      if (clouds.length<3) { 
        var cloudOne = new PIXI.TilingSprite(PIXI.Texture.from(cloudPic), 260, 180);
        cloudOne.tilePosition.y = 0;
        cloudOne.zIndex = 1;
        cloudOne.y = Math.floor(Math.random() * window.innerHeight) + 1;
        cloudOne.x = Math.floor(Math.random() * window.innerWidth) + 1;
        clouds.push(cloudOne);
        stage.addChild(cloudOne);
      } 
      updateCloud();
    }

    function createBullet() { 
      var bullet = new PIXI.TilingSprite(PIXI.Texture.from(airplane), 210, 80);
      bullet.anchor.set(0.5);
      bullet.tilePosition.y = 140;
      bullet.tilePosition.x = -160;
      bullet.zIndex = 100;
      bullet.speed = bulletSpeed;
      bullet.y = obj.y + 140;
      bullet.x = obj.x;
      stage.addChild(bullet);
      return bullet;
    }

    function fireBullet() {
      var bulletShoot = createBullet();
      bullets.push(bulletShoot)
    };
      
    function keysDown(e: any) { 
      if (e.keyCode == 32) {
        fireBullet();
      }
      if (e.keyCode == 40) {
        if (obj.y > window.innerHeight-250) { 
          obj.y = window.innerHeight-200;
          return
        }
        obj.y += planeSpeed;
      }
      if (e.keyCode == 38) {
        if (obj.y < 10) { 
          obj.y = 0;
          return
        }
        obj.y -= planeSpeed;
      }
      if (e.keyCode == 39) {
        if (obj.x > window.innerWidth) { 
          obj.x = window.innerWidth;
          return
        }
        obj.x += planeSpeed;
      }
      if (e.keyCode == 37) {
        if (plane.x <= 0) { 
          obj.x = 0;
          return
        }
        obj.x -= planeSpeed;
      }
    }
    function updateBullet() {
      for (let i = 0; i < bullets.length; i++) { 
        bullets[i].position.x += bullets[i].speed;
        if (bullets[i].position.x > window.innerWidth) { 
          app.stage.removeChild(bullets[i]);
          bullets.splice(i, 1);
        }
      }
    }

   
    let mashroomNumber = [];
    let mashSheet = new PIXI.BaseTexture.from(mashroomPic);
    var mashOne = new PIXI.Texture(mashSheet, new PIXI.Rectangle(390, 70, 150, 190));
    var mashTwo = new PIXI.Texture(mashSheet, new PIXI.Rectangle(270, 70, 140, 190));
    var mashThree = new PIXI.Texture(mashSheet, new PIXI.Rectangle(550, 70, 160, 190));
    let arrOne = [
      mashOne,
      mashTwo,
      mashThree
    ]

    
    function updateM() {
      for (let i = 0; i < mashroomNumber.length; i++) { 
        mashroomNumber[i].x -= 1;
        if (mashroomNumber[i].x < 0) { 
          mashroomNumber[i].x = window.innerWidth;
          mashroomNumber[i].y = Math.floor(Math.random() * window.innerHeight) + 1;
        }
      }
    }

    function createMonster() { 
      if (mashroomNumber.length <= 2) {
        var mashroomM = new PIXI.AnimatedSprite(arrOne);
        mashroomM.anchor.set(0.5);
        mashroomM.animationSpeed = 0.1;
        mashroomM.x = window.innerWidth;
        mashroomM.y = Math.floor(Math.random() * window.innerHeight) + 1;
        // mashroomM.hitArea = new PIXI.Rectangle(mashroomM.x, mashroomM.y, 200, 200);
        mashroomM.zIndex = 101;
        mashroomM.turnWalk = mashroomNumber.length%2==0? true : false;
        stage.addChild(mashroomM);
        mashroomNumber.push(mashroomM);
        mashroomM.play();
      }
    }

    function checkBullet() { 
      if (mashroomNumber.length > 0 && bullets.length > 0) { 
        for (let i = 0; i < bullets.length; i++) {
          for (let j = 0; j < mashroomNumber.length; j++) { 
            if (bullets.length>0) { 
              if (
                bullets[i].x > mashroomNumber[j].x &&
                bullets[i].y + bullets[i].height > mashroomNumber[j].y &&
                bullets[i].y < mashroomNumber[j].y + mashroomNumber[j].height
              ) { 
                stage.removeChild(mashroomNumber[j]);
                stage.removeChild(bullets[i]);
                mashroomNumber.splice(j, 1);
              }
            }
          }
        }
      }

      for (let j = 0; j < mashroomNumber.length; j++) {
        console.log('1', (mashroomNumber[j].x + mashroomNumber[j].width));
        console.log('2', (mashroomNumber[j].x - mashroomNumber[j].width));
        console.log('3', (obj.x + obj.width));
        if (
          (obj.x + obj.width) >= ((mashroomNumber[j].x + mashroomNumber[j].width)) &&
           (obj.x + obj.width) <= ((mashroomNumber[j].x - mashroomNumber[j].width))
        )
        {
          app.stop();
          alert('dead');
        }
      } 
    } 

    function gameLoop() { 
      updateBullet();
      createCloud();
      updateM();
      createMonster();
      checkBullet();
    }
    stage.addChild(plane);
    app.ticker.add(gameLoop);

    render(app);
  });


  