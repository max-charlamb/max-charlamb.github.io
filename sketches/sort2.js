const SWAP = 0;
const COMPARE = 1;
const WHITE = 2;
const SWAP_COLOR = [200, 20, 20];
const COMPARE_COLOR = [20,200,20];

const TIME_STEP = 10;
const LENGTH = 200;
const FRAME_RATE = 30;

const STARTSCREEN = 0;
const SORT = 1;
const SORTDONE = 2;
//-----------------------------------------------------------------------//
var canvas;
var array;
var mode;

var insertionButton;
var heapButton;
var quickButton;
var selectionButton;

function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.parent('canvas-holder');
    canvas.position(0,0);

    heapButton = createButton('Heap');
    insertionButton = createButton('Insertion');
    quickButton = createButton('Quick');
    selectionButton = createButton('Selection');

    heapButton.position(0,0);
    insertionButton.position(64,0);
    quickButton.position(128,0);
    selectionButton.position(192,0);

    heapButton.size(64);
    insertionButton.size(64);
    quickButton.size(64);
    selectionButton.size(64);

    heapButton.mousePressed(startHeap);
    insertionButton.mousePressed(startInsertion);
    quickButton.mousePressed(startQuick);
    selectionButton.mousePressed(startSelection);


    frameRate(FRAME_RATE);
    mode = STARTSCREEN;
}


function draw(){
    switch(mode){
        case STARTSCREEN:
        startScreen();
        break;
        case SORT:
        if(array.hasNext()){
            showArray(array.next(TIME_STEP));
            textSize(32);
            fill(255);
            textAlign(LEFT);
            text(array.swapCounter + ' swaps',100,200);
            text(array.compareCounter + ' compares',100,300);
        } else {
            array.resetColor();
            showArray(array.visual);
            textSize(32);
            fill(255);
            textAlign(LEFT);
            text(array.swapCounter + ' swaps',100,200);
            text(array.compareCounter + ' compares',100,300);
            mode = SORTDONE;
        }
        break;
        default:
        break;
    }
}

function startScreen(){
    background(0);
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text('SELECT SORT TO BEGIN', width/2, height/2);
}

function startHeap(){
    array = new VisualArray(LENGTH);
    heapSort(array);
    mode = SORT;
}

function startQuick(){
    array = new VisualArray(LENGTH);
    quickSort(array, 0, array.getLength() - 1);
    mode = SORT;
}

function startInsertion(){
    array = new VisualArray(LENGTH);
    insertionSort(array);
    mode = SORT;
}

function startSelection(){
    array = new VisualArray(LENGTH);
    selectionSort(array);
    mode = SORT;
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    if(mode = SORTDONE){mode = SORT;}
}

//Takes in an array of arrays with 0: value, 1: type (to determine color)
function showArray(arr){
    let columnWidth = width/arr.length;
    let spacingWidth = width/arr.length;
    let heightMultiplier = height/arr.length;

    background(0);

    for(let i = 0; i < arr.length; i++){
        switch(arr[i][1]){
            case SWAP:
            fill(SWAP_COLOR[0],SWAP_COLOR[1],SWAP_COLOR[2]);
            break;
            case COMPARE:
            fill(COMPARE_COLOR[0],COMPARE_COLOR[1],COMPARE_COLOR[2]);
            break;
            default:
            fill(255);
        }
        noStroke();
        rect(i * spacingWidth, height, columnWidth,  (-arr[i][0] - 1)* heightMultiplier);
    }
}


//-----------------------------------------------------------------------//

//Takes in VisualArray
function selectionSort(visualArray){
    let length = visualArray.getLength();
    for(let i = 0; i < length; i++){
        let minIndex = i;
        for(let j = i; j < length; j++){
            if(visualArray.compare(minIndex, j) > 0){
                minIndex = j;
            }
        }
        visualArray.swap(i,minIndex);
    }
}

//-----------------------------------------------------------------------//

//Takes in VisualArray
function heapSort(visualArray){
    let length = visualArray.getLength();
    for(let i = 1; i < length; i++){
        bubbleUp(visualArray, i);
    }
    for(let j = length - 1; j > 0; j--){
        visualArray.swap(0,j);
        bubbleDown(visualArray, 0, j);
    }
}

function bubbleUp(visualArray, k){
    let parent = floor((k - 1) / 2);
    while (parent >= 0 && visualArray.compare(parent, k) < 0) {
        visualArray.swap(parent, k);
        k= parent;
        parent= floor((k - 1) / 2);
    }
}

function bubbleDown(visualArray, k, j){
    if (k < 0 || k > j - 1) { return; }
    let leftChild;
    let rightChild;
    let highestChild;
    while (k * 2 + 1 < j) {
        leftChild= 2 * k + 1;
        rightChild= 2 * k + 2;
        if (k * 2 + 2 < j) {
            highestChild= visualArray.compare(leftChild, rightChild) > 0 ? leftChild : rightChild;
            if (visualArray.compare(k, highestChild) >= 0) { break; }
            visualArray.swap(k, highestChild);
            k= highestChild;
        } else {
            if (visualArray.compare(k, leftChild) == -1) {
                visualArray.swap(k, leftChild);
                k= leftChild;
            }
            break;
        }
    }
}

//-----------------------------------------------------------------------//

function quickSort(visualArray, a, b){
    if(b - a < 1) return;
    let j = partition(visualArray, a, b);
    quickSort(visualArray, a, j - 1);
    quickSort(visualArray, j + 1, b);
}

function partition(visualArray, a, b){
    if(b - a < 15){
        choosePivot(visualArray, a, b);
    }
    let t = a + 1;
    let j = b;
    while(t <= j){
        if(visualArray.compare(a, t) > 0){
            t++;
        }
        else if(visualArray.compare(j, a) >= 0) {
            j--;
        }
        else{
            visualArray.swap(t, j);
            j--;
            t++;
        }
    }
    visualArray.swap(a, j);
    return j;
}

function choosePivot(visualArray, a, b){

    let first = a;
    let second = floor(a + (b - a)/2);
    let third = b;

    if (visualArray.compare(first, second) >= 0) {
        if (visualArray.compare(second, third) >= 0) {
            visualArray.swap(first,second);
            return;
        } else if (visualArray.compare(first, third) >= 0) {
            visualArray.swap(first,third);
            return;
        } else {
            return;
        }
    } else {
        if (visualArray.compare(first, third) >= 0) {
            return;
        } else if (visualArray.compare(second, third) >= 0) {
            visualArray.swap(first,third);
            return;
        } else {
            visualArray.swap(first,second);
            return;
        }
    }

}

//-----------------------------------------------------------------------//

function insertionSort(visualArray){
    let length = visualArray.getLength();
    for(let i = 0; i < length; i++){
        let j = i
        while(j > 0 && visualArray.compare(j-1, j) > 0){
            visualArray.swap(j-1, j)
            j--;
        }
    }
}

//-----------------------------------------------------------------------//

class VisualArray{

    constructor(length){
        this.length = length;
        this.arr = [];
        this.visual = []; //This is an array of "tuple" arrays 0: value, 1: color
        this.queue = new LinkedList();
        this.lastMoveIndicies = [];
        this.swaps = 0;
        this.compares = 0;
        this.swapCounter = 0;
        this.compareCounter = 0;
        this.fillArray();
    }

    getLength(){
        return this.length;
    }

    fillArray(){
        for(let i = 0; i < this.length; i++){
            this.arr[i] = i;
        }
        this.randomizeArray();
        this.resetVisual();
        this.resetCounters();
    }

    resetCounters(){
        this.swaps = 0;
        this.compares = 0;
    }

    randomizeArray(){
        for(let i = this.arr.length - 1; i > 0; i--){
            let j = floor(random(i + 1));
            this.swap(i, j);
        }
    }

    resetVisual(){
        this.visual = [];
        for(let i = 0; i < this.arr.length; i++){
            this.visual[i] = [this.arr[i], WHITE];
        }
        this.queue = new LinkedList();
    }

    //Swaps two elements of the array and adds a move to the queue
    swap(i, j){
        if(i < 0 || j < 0) throw "i or j negative ";
        let tmp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = tmp;
        this.queue.append(new move(SWAP, i, j));
        this.swaps++;
    }

    //Compares two elements of the array and adds a move to the queue
    //Returns positive if the first is larger, negative if the second is larger
    //or equal if they are the same.
    compare(i, j){
        if(i < 0 || j < 0) throw "i or j negative"
        this.queue.append(new move(COMPARE, i, j));
        this.compares++;
        return this.arr[i] - this.arr[j];
    }

    hasNext(){
        return this.queue.size > 0;
    }

    next(numberOfSteps){
        this.resetColor();
        while(numberOfSteps > 0 && this.hasNext()){
            if(numberOfSteps == 1){
                let move = this.queue.shift();
                switch (move.type){
                    case SWAP:
                    this.swapCounter++;
                    let i = move.indexFirst;
                    let j = move.indexSecond;
                    let tmp = this.visual[i];
                    this.visual[i] = this.visual[j];
                    this.visual[j] = tmp;
                    this.setColor(i, SWAP);
                    this.setColor(j, SWAP);
                    break;
                    case COMPARE:
                    this.compareCounter++;
                    let k = move.indexFirst;
                    let m = move.indexSecond;
                    this.setColor(k, COMPARE);
                    this.setColor(m, COMPARE);
                    break;
                    default:
                    break;
                }
            } else {
                let move = this.queue.shift();
                switch (move.type){
                    case SWAP:
                    this.swapCounter++;
                    let i = move.indexFirst;
                    let j = move.indexSecond;
                    let tmp = this.visual[i];
                    this.visual[i] = this.visual[j];
                    this.visual[j] = tmp;
                    break;
                    case COMPARE:
                    this.compareCounter++;
                    let k = move.indexFirst;
                    let m = move.indexSecond;
                    break;
                    default:
                    break;

                }
            }
            numberOfSteps--;
        }
        return this.visual;
    }

    //Set color of index to color. Call after swapped
    setColor(index, color){
        if(index < 0) throw "Index is less than 0";
        this.visual[index][1] = color;
        this.lastMoveIndicies.push(index);
    }

    //Resets all the colors in the array to white
    resetColor(){
        for(let i = 0; i < this.lastMoveIndicies.length; i++){
            this.visual[this.lastMoveIndicies[i]][1] = WHITE;
        }
    }
}


class move{
    constructor(type, i, j){
        this.type = type;
        this.indexFirst = i;
        this.indexSecond = j;
    }
}

class LinkedList{
    constructor(){
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    append(val){
        if(this.size == 0){
            this.first = new Node(val, null, null);
            this.last = this.first;
            this.size++;
        } else {
            let tmp = this.last;
            this.last = new Node(val, tmp, null);
            tmp.next = this.last;
            this.size++;
        }
    }

    shift(){
        if(this.size == 0) throw "No items in LinkedList";
        if(this.size == 1){
            let tmp = this.first;
            this.first = null;
            this.last = null;
            this.size = 0;
            return tmp.val;

        } else {
            let tmp = this.first;
            this.first = tmp.next;
            this.size--;
            return tmp.val;
        }
    }
}
class Node{
    constructor(val, prev, next){
        this.val = val;
        this.prev = prev;
        this.next = next;
    }
}
