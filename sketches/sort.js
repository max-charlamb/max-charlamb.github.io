
//-----------------------------------------------------------------------//
var canvas;
var sorter;
var insertionButton;
var bubbleButton;
var quickButton;
var selectionButton;


var arrays;
var counter = 0;
var timeStep = 1;


function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.parent('canvas-holder');
    canvas.position(0,0);

    bubbleButton = createButton('Bubble');
    insertionButton = createButton('Insertion');
    quickButton = createButton('Quick');
    selectionButton = createButton('Selection');

    bubbleButton.position(0,0);
    insertionButton.position(64,0);
    quickButton.position(128,0);
    selectionButton.position(192,0);

    bubbleButton.size(64);
    insertionButton.size(64);
    quickButton.size(64);
    selectionButton.size(64);

    bubbleButton.mousePressed(startBubble);
    insertionButton.mousePressed(startInsertion);
    quickButton.mousePressed(startQuick);
    selectionButton.mousePressed(startSelection);

    background(0);
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text('Click Button to Start', width/2,height/2);

    noLoop();
}

function startBubble(){
    sorter = new Sorter(100);
    arrays = sorter.bubbleSort();
    counter = 0;
    loop();
}

function startInsertion(){
    sorter = new Sorter(100);
    arrays = sorter.insertionSort();
    counter = 0;
    loop();
}

function startQuick(){
    sorter = new Sorter(1000);
    arrays = sorter.quickSort();
    counter = 0;
    loop();
}

function startSelection(){
    sorter = new Sorter(1000);
    arrays = sorter.selectionSort();
    counter = 0;
    loop();
}

function draw(){
    if(counter < arrays.length){
        background(0);
        Sorter.showArray(arrays[counter]);
    } else if(counter > arrays.length){
        background(0);
        Sorter.showArray(arrays[arrays.length - 1]);
        textSize(32);
        fill(255);
        text(arrays.length + ' swaps',100,200);
        noLoop();
    }
    counter += timeStep;
}


class Sorter{
    constructor(lengthOfArray){
        this.lengthOfArray = lengthOfArray;
    }

    static fillArray(arr, length){
        for(let i = 0; i < length; i++){
            arr[i] = i;
        }
    }

    static randomizeArray(arr){
        for(let i = arr.length - 1; i > 0; i--){
            let j = floor(random(i + 1));
            Sorter.swap(arr, i, j);
        }
        return arr;
    }


    //Returns an array of arrays with each array representing the state at one step
    bubbleSort(){
        let cycles = [];
        let arr = []
        Sorter.fillArray(arr, this.lengthOfArray);
        Sorter.randomizeArray(arr);
        let swapped = false;
        console.time();
        do{
            swapped = false;
            for(let i = 1; i < arr.length; i++){
                cycles.push(Sorter.cloneArray(arr));
                if(arr[i-1] > arr[i]){
                    Sorter.swap(arr, i-1, i);
                    swapped = true;
                }
            }
        } while(swapped);
        // Debug information
        // console.timeEnd();
        // console.log(window.performance.memory);
        return cycles;
    }

    insertionSort(){
        let cycles = [];
        let arr = []
        Sorter.fillArray(arr, this.lengthOfArray);
        Sorter.randomizeArray(arr);
        for(let i = 1; i < arr.length; i++){
            let j = i;
            while(j > 0 && arr[j-1] > arr[j]){
                Sorter.swap(arr,j-1,j);
                cycles.push(Sorter.cloneArray(arr));
                j--;
            }
        }
        return cycles;
    }

    selectionSort(){
      let cycles = [];
      let arr = []
      Sorter.fillArray(arr, this.lengthOfArray);
      Sorter.randomizeArray(arr);
      //[0..i] is sorted
      for(let i = 0; i < arr.length; i++){
        let minValue = arr[i];
        let minIndex = i;
        for(let j = i; j < arr.length; j++){
          if(arr[j] < minValue){
            minValue = arr[j]
            minIndex = j;
          }
        }
        Sorter.swap(arr,minIndex,i);
        cycles.push(Sorter.cloneArray(arr));
        //console.log(cycles);
      }

      return cycles;
    }

    quickSort(){
        let cycles = [];
        let arr = []
        Sorter.fillArray(arr, this.lengthOfArray);
        Sorter.randomizeArray(arr);

        this.qSort(arr, 0, arr.length - 1, cycles);

        return cycles;
    }

    qSort(array, a, b, cycles){
        if(b + 1 - a < 2) return;
        let j = this.partition(array, a, b, cycles);
        this.qSort(array, a, j - 1, cycles);
        this.qSort(array, j + 1, b, cycles);
    }

    partition(array, a, b, cycles){
        let t = a + 1;
        let j = b;
        while(t <= j){
            if(array[t] < array[a]){
                t++;
            }
            else if(array[j] >= array[a]) {
                j--;
            }
            else{
                Sorter.swap(array, t, j);
                cycles.push(Sorter.cloneArray(array));
                j--;
                t++;
            }
        }
        Sorter.swap(array, a, j);
        cycles.push(Sorter.cloneArray(array));
        return j;
    }


    static cloneArray(arr){
        let a = [];
        for(let i = 0; i < arr.length; i++){
            a.push(arr[i]);
        }
        return a;
    }

    //a and b are ints and valid indicies of arr
    static swap(arr, a, b){
        let tmp = arr[a];
        arr[a] = arr[b];
        arr[b] = tmp;
    }


    //Method to show visualize array
    static showArray(arr){
        let columnWidth = (width/arr.length);
        let spacingWidth = width/arr.length;
        let heightMultiplier = height/arr.length;

        for(let i = 0; i < arr.length; i++){
            fill(255);
            noStroke();
            rect(i * spacingWidth, height, columnWidth,  (-arr[i] - 1)* heightMultiplier);
        }
    }

}
