let img;
let img_b;
let tileSize = 16; //How large each slice will be.
let gridCount = 0;
let canvasSize = 512;
let gridObject = [];

function preload() {
  // Loads in the image.
  img = loadImage('img/tile_fancy.png');
  img_b = loadImage('img/volume_fancy.png');

}

function setup(){
  createCanvas(canvasSize,canvasSize);
  gridCount = canvasSize / tileSize;
  
  //Create a grid and populate with zeros
  for(let y = 0; y < gridCount; y++){
    gridObject.push([]);
    for(let x = 0; x < gridCount; x++){
      gridObject[y].push(0);
    }
  }
  render();
}

function render() {
  //Get mouse location:
  // This gives which grid the mouse is pointing at.
  //let mouseGridX = Math.floor(mouseX / tileSize);
  //let mouseGridY = Math.floor(mouseY / tileSize);
  
  //For each of the tiles..
  for(let y = 0; y < gridObject.length; y++){
    for(let x = 0; x < gridObject[y].length; x++){
      //...
      let val = gridObject[y][x];
      //If the grid we are getting is out of bounds, we return true to indicate existing tile.
      //If it's not out of bounds:
      // If this tile is solid and the tile on top is also solid: bitmask should be 1
      // If this tile is solid, and the tile on top is not: bitmask should be 0
      // If this tile is blank, then we do nothing.
      //        within bounds? if so, what tile is it? otherwise, pretend there is no things.
      
      let toptile = (y - 1 >= 0)? gridObject[y-1][x] : 0;
      let bottomtile = (y + 1 < gridObject.length)? gridObject[y+1][x] : 0;
      let lefttile = (x - 1 >= 0)? gridObject[y][x-1] : 0;
      let righttile = (x + 1 < gridObject[y].length)? gridObject[y][x+1] : 0;
      
      
      /*
      let bottomtile     =  (y - 1 >= 0)? gridObject[x][y-1] : 0;
      let righttile    =  (x - 1 >= 0)? gridObject[x-1][y] : 0;
      let toptile  =  (y + 1 < gridObject[x].length)? gridObject[x][y+1] : 0;
      let lefttile   =  (x + 1 < gridObject.length)? gridObject[x+1][y] : 0;*/

      let bitmask = 0;
      if(val == 0){
        image(img_b, x * tileSize, y * tileSize);
      }
      else{
        //If there's a blank tile on top, then we know that
        //this tile should be using #1 tile.
        //But why, in reality, everything is swapped?
        let top = toptile === 0? 1:0; 
        let left = lefttile === 0? 2:0;
        let bottom = bottomtile === 0? 4:0;
        let right = righttile === 0? 8:0;
        
        //It was not by my hand that these tiles are flipped.
        //They were flipped by my wonky drawtile function,
        //Which used x and y in reverse.
        
        //
        
        bitmask = top + left + bottom + right;
        drawTileAt(x * tileSize, y * tileSize, bitmask);
        print(top);
        print(bitmask)
      }
    }
  }
}

function mousePressed(){
  //gridObject
  let X = Math.floor(mouseX / tileSize);
  let Y = Math.floor(mouseY / tileSize);
  //print(X);
  //print(Y);
  gridObject[Y][X] = ~gridObject[Y][X]; //Bitwise flip
  render();
}

function drawTileAt(x, y, bitmask){
  //Change the starting at parameter  (this)  based on the bitmask
  let tilex = Math.floor(bitmask / 4);
  let tiley = bitmask % 4;
  
  print(tilex, tiley);
  
  image(img, x, y, tileSize, tileSize, tiley * tileSize, tilex * tileSize, tileSize, tileSize);
}


/*
//This looks right.
function getCoordFromIndex(index){
  let x = Math.floor(index / gridCount);
  let y = index - x * gridCount;
  return {x : x, y : y };
}

function getTileAt(x, y){
  let index = x * gridCount + y;
  if(index >= gridCount * gridCount || index < 0){
    return 0; 
  } //Hopefully we won't need that
  return index;
}*/
