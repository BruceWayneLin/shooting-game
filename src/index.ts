import * as PIXI from 'pixi.js';
import { config } from './config';
import cloud from '../src/assets/cloud.png';
import airplane from '../src/assets/flight.png'
import './main.css';

const {
    gameWidth,
    gameHeight,
} = config;

let planeSpeed = 50;

function createApplication(): PIXI.Application {
    const app = new PIXI.Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight
  });
  app.renderer.resize(window.innerWidth, window.innerHeight);
  app.stage.scale.x = window.innerWidth / gameWidth;
  app.stage.scale.y = window.innerHeight / gameHeight;
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

let bullets = [];
let bulletSpeed = 10;
window.onload = () =>
  loadAssets(() => {
    const app = createApplication();
    const stage = app.stage;
    stage.interactive = true;
    var cloudOne = new PIXI.TilingSprite(PIXI.Texture.from(cloud), 260, 180);
    cloudOne.tilePosition.y = 0;
    cloudOne.y = 10
    var plane = new PIXI.TilingSprite(PIXI.Texture.from(airplane), 490, 350);
    plane.scale.x = 0.5;
    plane.scale.y = 0.5;
    
    window.addEventListener('keydown', keysDown)
    
    stage.addChild(cloudOne, plane);

    function createBullet() { 
      var bullet = new PIXI.TilingSprite(PIXI.Texture.from(airplane), 210, 80);
      bullet.anchor.set(0.5);
      bullet.tilePosition.y = 140;
      bullet.tilePosition.x = -160;
      bullet.speed = bulletSpeed;
      bullet.y = plane.y + 140;
      bullet.x = plane.x;
      stage.addChild(bullet);
      return bullet;
    }
    // bg.on('click', function (e) {
    //     console.log('hi');
    // });}
    function fireBullet() {
      var bulletShoot = createBullet();
      bullets.push(bulletShoot)
    };
      
    function keysDown(e: any) { 
        if (e.keyCode == 32) {
          fireBullet();
        }
        if (e.keyCode == 40) {
            console.log('down');
            plane.y += planeSpeed;
        }
        if (e.keyCode == 38) {
            console.log('up');
          plane.y -= planeSpeed;
        }
      if (e.keyCode == 39) {
            if (plane.x > window.innerWidth / 2) { 
              plane.x = window.innerWidth / 2;
              return
            }
        plane.x += planeSpeed;
        }
      if (e.keyCode == 37) {
        if (plane.x <= 0) { 
          plane.x = 0;
          return
        }
        plane.x -= planeSpeed;
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

    function gameLoop() { 
      cloudOne.x -= 1
      if (cloudOne.x < - 500) { 
        cloudOne.x = window.innerWidth;
      }
      updateBullet();
    }

    app.ticker.add(gameLoop);

    render(app);
  });


  