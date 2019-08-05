var timeScale = 5;

var graph;
var canvas;
var button;


function setup() {
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');
  canvas.parent('backgroundcanvas');

  button = createButton('Reset');
  button.parent('button-holder');
  button.mousePressed(reset);

  let cx = floor(width/8);
  let cy = floor(height/8);

  timeScale = (cx*cy)/450;

  graph = new GridGraph(cx,cy, true);
  //graph.JPDsetup(0,0);
  graph.JPDsetup(floor((cx-1)/2)-1,floor((cy-1)/2));

  background(0)

}

function draw() {
  for(let i = 0; i < timeScale; i++){
    if(graph.F.length != 0){
      graph.JPD();
      if(graph.F.length == 0){
        graph.show();
      }
    }
  }
  if(graph.F.length != 0){
    graph.show();
  }
}


function reset(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.position(0,0);
    canvas.style('z-index','-1');
    canvas.parent('backgroundcanvas');

    let cx = floor(width/8);
    let cy = floor(height/8);

    timeScale = (cx*cy)/450;

    graph = new GridGraph(cx,cy, true);
    //graph.JPDsetup(0,0);
    graph.JPDsetup(floor((cx-1)/2)-1,floor((cy-1)/2));

    background(0)
}
