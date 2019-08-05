var numParticles = 25;
var particles = [];
var gravity = 0.1;

function setup(){
  var canvas = createCanvas(windowWidth,windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');
  canvas.parent('backgroundcanvas');

  for(let i = 0; i < numParticles; i++){
    particles[i] = new Particle()
  }


}

function draw(){
  background(255);
  for(let i = 0; i < numParticles; i++){
    particles[i].update();
    particles[i].show();
    if(particles[i].y > height && particles[i].vy > 0){
      particles[i] = new Particle();
    }
  }

}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

class Particle{
  constructor(){
    this.mass = random(10,100);
    this.size = Math.cbrt(this.mass * 3/(4*PI))*10;
    this.x = random(width);
    this.y = random(height, height * 1.2);
    this.vy = random(-height/200, -height/50);
    this.vx = random(-this.vy * .2, this.vy * .2);
    this.color = color(random(255),random(255),random(255));
    this.gravity = gravity;
    this.fleeRadius = 100;
  }

  update(){
    if(dist(this.x,this.y, mouseX, mouseY) < this.fleeRadius){
      let dx = mouseX - this.x;
      let dy = mouseY - this.y;
      let v = createVector(dx,dy).normalize();
      this.vx -= v.x;
      this.vy -= v.y;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
  }

  show(){
    noStroke();
    fill(this.color);
    circle(this.x,this.y,this.size);
  }


}
