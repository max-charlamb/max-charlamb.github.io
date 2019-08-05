class GridGraph{

  constructor(cols, rows, rainbow){
    this.rainbow = rainbow;

    this.width = cols;
    this.height = rows;


    //Create Node grid
    this.nodes = [];
    for(let i = 0; i < this.width; i++){
      this.nodes.push([]);
    }
    for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        this.nodes[i].push(NodeType.O);
      }
    }

    this.F = [];
    //Drawing parameters

    this.drawWidth =  floor(width/this.width);
    this.drawHeight =  floor(height/this.height);
    this.paddingLeftRight = floor(this.drawWidth/8);
    this.paddingTopBottom = floor(this.drawHeight/8);
  }

  _drawRect(x1,y1,x2,y2){
    rect(x1,y1,x2-x1,y2-y1);
  }

  //Draws node at position (x,y)
  drawNode(x,y, nodeType){
    let left = x * this.drawWidth + this.paddingLeftRight;
    let right = (x + 1) * this.drawWidth - this.paddingLeftRight;
    let top = y * this.drawHeight + this.paddingTopBottom;
    let bottom = (y + 1) * this.drawHeight - this.paddingTopBottom;

    switch(nodeType){
      case NodeType.NODRAW:
        break;
      case NodeType.O:
        break;
      case NodeType.F:
        if(this.rainbow) fill(random(0,256),random(0,256),random(0,256));
        else fill(180, 180, 20);
        rect(left,top, right-left, bottom-top);
        fill(255);
        break;
      default:
        rect(left,top, right-left, bottom-top);
        this.nodes[x][y] = NodeType.NODRAW;
    }
  }

  drawEdge(x, y, nodeType){
    let left = x * this.drawWidth;
    let right = (x + 1) * this.drawWidth;
    let top = y * this.drawHeight;
    let bottom = (y + 1) * this.drawHeight;

    let innerleft = x * this.drawWidth + this.paddingLeftRight;
    let innerright = (x + 1) * this.drawWidth - this.paddingLeftRight;
    let innertop = y * this.drawHeight + this.paddingTopBottom;
    let innerbottom = (y + 1) * this.drawHeight - this.paddingTopBottom;

    switch(nodeType){
      case NodeType.NORTH:
        this._drawRect(innerleft,top - this.paddingTopBottom ,innerright, innertop);
        break;
      case NodeType.EAST:
        this._drawRect(right + this.paddingLeftRight, innertop, innerright, innerbottom);
        break;
      case NodeType.SOUTH:
        this._drawRect(innerleft, innerbottom, innerright, bottom + this.paddingTopBottom);
        break;
      case NodeType.WEST:
        this._drawRect(left - this.paddingLeftRight, innertop, innerleft, innerbottom);
        break;
      default:
        break;

    }
  }

  show(){

    //Set background to black
    //background(0);
    fill(255);
    noStroke();
    //Draw Nodes
    for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        this.drawEdge(i,j,this.nodes[i][j]);
        this.drawNode(i,j,this.nodes[i][j]);
      }
    }

  }

  //Removes from array in constant time
  _removeFromArray(array, index){
    let tmp = array[index];
    array[index] = array[array.length - 1];
    array[array.length - 1] = tmp;
    return array.pop();
  }

  //Returns list of points that are neighbors to point p and in the spanning tree
  _neighbors(p){
    let x = p.x;
    let y = p.y;
    let ns = [];
    if (0 < y && this.nodes[x][y - 1] != NodeType.F && this.nodes[x][y - 1] != NodeType.O){
	  ns.push(new Point(x, y - 1)); // North
    }
	if (x + 1 < this.nodes.length && this.nodes[x + 1][y] != NodeType.F && this.nodes[x + 1][y] != NodeType.O){
	  ns.push(new Point(x + 1, y)); // East
    }
	if (0 < x && this.nodes[x - 1][y] != NodeType.F && this.nodes[x - 1][y] != NodeType.O){
	  ns.push(new Point(x - 1, y)); // West
    }
	if (y + 1 < this.nodes[x].length && this.nodes[x][y + 1] != NodeType.F && this.nodes[x][y + 1] != NodeType.O){
	  ns.push(new Point(x, y + 1)); // South
    }
	return ns;
  }

  _addAdjecentToF(p){
    let x = p.x;
    let y = p.y;

    this._addToF(x, y - 1, this.nodes, this.F); //North
    this._addToF(x, y + 1, this.nodes, this.F); //South
    this._addToF(x + 1, y, this.nodes, this.F); //East
    this._addToF(x - 1, y, this.nodes, this.F); //West
  }

  _addToF(x, y, nodes, F){
    if( x >= 0 &&
        x < nodes.length &&
        y >= 0 &&
        y < nodes[0].length &&
        (nodes[x][y] == NodeType.O || nodes[x][y] == NodeType.END)){
      nodes[x][y] = NodeType.F;
      F.push(new Point(x,y));
    }
  }

  //Returns direction u is in reference to v
  _direction(v, u){
    if(v.x == u.x){
      if(v.y + 1 == u.y) return NodeType.SOUTH;
      if(v.y - 1 == u.y) return NodeType.NORTH;
    }
    if(v.y == u.y){
      if(v.x + 1 == u.x) return NodeType.EAST
      if(v.x - 1 == u.x) return NodeType.WEST;
    }
    return null;
  }

  JPDsetup(x1,y1){
    this.nodes[x1][y1] = NodeType.START;
    this._addAdjecentToF(new Point(x1,y1));
  }

  /** Make one step of the JPD algorithm:<br>
	 * Choose a random node v in F and then a random edge (v, u) <br>
	 * with u in spanning tree Cb.<br>
	 * Change v to be in Cb and fix F to satisfy its invariant.<br>
	 * Edge (v, u) is now considered to be an edge of the spanning tree.<br>
	 * Return the new node v that was added to Cb */
  JPD(){
    let index = floor(random(0, this.F.length));
    let v = this._removeFromArray(this.F, index);
    let ns = this._neighbors(v);
    let index2 = floor(random(0, ns.length));
    let u = ns[index2];

    let dir = this._direction(v,u);
    if(dir == null) throw 'Direction == null';

    this._addAdjecentToF(v);
    this.nodes[v.x][v.y] = dir;

    return v;
  }



}
