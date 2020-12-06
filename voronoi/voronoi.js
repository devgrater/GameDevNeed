let gsx = 0;
let canvasSize = 512;
let gridSize = 64;
let canvas;
let points;
let maxDistance;
let prevVals;
let voronoiDistance;
let randomness = 0.0;

let previousFrameVals = [];

function setup() {
  canvas = createCanvas(canvasSize, canvasSize);
  maxDistance = canvas.width * canvas.width;
  pixelDensity(1);
  gsx = canvasSize / gridSize;
  points = populateGridDots(canvas, gridSize, gridSize);
  print(points);
  voronoiDistance = maxDistance;
  //voronoi(canvas, points, gridSize, gridSize);
  for(let x = 0; x < canvas.width; x++){
    let yArray = [];
    for(let y = 0; y < canvas.height; y++){
      yArray.push(0);
    }
    previousFrameVals.push(yArray);
  }
}



function draw(){
  //voronoiDistance += 200;
  for(let i = 0; i < points.length; i++){
    //let point = points[i];
    points[i].x += (random() - 0.5) * 4;
    points[i].y += (random() - 0.5) * 4;
  }
  voronoi(canvas, points, gridSize, gridSize, voronoiDistance);
}

function populateGridDots(canvas, gridx, gridy) {
  let pointList = [];
  for(let x = 0; x < canvas.width / gridx; x ++){
    for(let y = 0; y < canvas.width / gridy; y ++){
      let rndx = Math.floor(random(0, gridx));
      let rndy = Math.floor(random(0, gridy));
      pointList.push(
        {x : x * gridx + rndx * randomness, y : y * gridx + rndy * randomness}
      );
      
      let c = color(0);
      set(x * gridx + rndx, y * gridy + rndy, c);
    }
  }
  updatePixels();
  return pointList;
}

function voronoi(canvas, points, gridx, gridy, voronoiDistance){
  //For each pixel in the canvas:
  for(let x = 0; x < canvas.width; x++){
    for(let y = 0; y < canvas.height; y++){
      let xzone = Math.floor(x / gridx);
      let yzone = Math.floor(y / gridy);
      
      //Get nearby zones:
      
      let minDistance = voronoiDistance; // The minimum distance can't go further than this.
      //let subMinDistance = voronoiDistance;
      //let subSubMinDistance = voronoiDistance;
      
      for(let dx = -1; dx <= 1; dx++){
        for(let dy = -1; dy <= 1; dy++){
          
          let zone = getZone(xzone + dx, yzone + dy); // This gives me the zone I need to compare with.
          let point = points[zone.index]; // Gets the point.
          
          let dist = 0;
          let xdiff = (point.x - x);
          let ydiff = (point.y - y);
          if(zone.wrapx){ //If you wrap around the zones, then we need to calculate out the minimum distance.
            xdiff = Math.min(point.x, x) + canvas.width - Math.max(point.x, x);
          }
          if(zone.wrapy){
            ydiff = Math.min(point.y, y) + canvas.width - Math.max(point.y, y);
          }
          
          dist = xdiff * xdiff + ydiff * ydiff;
          if(dist <= minDistance){
            //subMinDistance = minDistance;
            minDistance = dist; 
          } //Try to find the nearest point.
        }
      }
      let c = color(Math.sqrt(minDistance) / (1.5 * gridx) * 255); //Remap the color to make the white part brighter
      //previousFrameVals[x][y] += Math.sqrt(minDistance) / (1.5 * gridx);
      //let c = color((1-(minDistance - subMinDistance) / subMinDistance) * 80);
      //let c = color(0.0);
      //if(Math.sqrt(minDistance))
      set(x, y, c);
      
    }
  }
  updatePixels();
}

//This is right.
function getZone(x, y){
  let wrapx, wrapy = false;
  while(x < 0){ x += gsx; wrapx = true; }
  while(x >= gsx){ x -= gsx; wrapx = true; }
  while(y < 0){ y += gsx; wrapy = true; }
  while(y >= gsx){ y -= gsx; wrapy = true; }
  
  return {index : x * gsx + y, wrapx : wrapx, wrapy : wrapy};
}
