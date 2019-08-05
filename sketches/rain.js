var drops = [];
var numDrops = 50;
var angle;

function setup(){
  var canvas = createCanvas(windowWidth,windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');
  canvas.parent('backgroundcanvas');

  angle = random(80,100);

  for(let i = 0; i < numDrops; i++){
    drops[i] = new Drop();
  }
  background(20,20,200);

}

function draw(){
  background(255, 20);
  for(let i = 0; i < numDrops; i++){
    if(drops[i].state == State.DEAD){
      drops[i] = new Drop();
    }
    drops[i].update();
    drops[i].show();
  }

  if(random(100) < 5){
    angle += random(-1,1);
    if(angle > 90){
      angle = min(angle, 110);
    } else {
      angle = max(angle, 70);
    }
  }

}


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

const State = {
  FALLING : 'falling',
  PUDDLE : 'puddle',
  DEAD : 'dead',
}

class Drop{
  constructor(){
    this.color = color(20,20,200); //nice looking blue
    this.size = 2; //side length of square
    this.x = random(-width * .2, width * 1.2);
    this.y = 0;
    this.z = random(.1, 1);
    this.endpoint = height - this.z * height / 4;
    let a = p5.Vector.fromAngle(radians(angle), (1.1-this.z) * 10);
    this.vy = a.y;
    this.vx = a.x;
    this.state = State.FALLING;
    this.maxPuddle = (1.5-this.z)* 10;
    this.puddle = 0;
  }

  update(){
    switch (this.state){
      case State.FALLING:
      this.y += this.vy;
      this.x += this.vx;
      if(this.y > this.endpoint){
        this.state = State.PUDDLE;
      }
      break;
      case State.PUDDLE:
      if(this.puddle > this.maxPuddle){
        this.state = State.DEAD;
      }
      this.puddle += 0.25;
      default:
      break;
    }
  }

  show(){
    switch (this.state){
      case State.FALLING:
      noStroke();
      rectMode(RADIUS);
      fill(this.color);
      square(this.x, this.y, this.size);
      break;
      case State.PUDDLE:
      noStroke();
      rectMode(RADIUS);
      fill(this.color);
      push();
      translate(this.x,this.y);
      rect(0,0, this.puddle, this.puddle * (1-this.z));
      pop();
      default:
      break;
    }

  }


}
