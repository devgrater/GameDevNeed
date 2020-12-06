let gsx = 0;
let canvasSize = 512;
let gridSize = 64;
let borderThickness = 2;

function setup() {
  let canvas = createCanvas(canvasSize, canvasSize);
  pixelDensity(1);
  gsx = canvasSize / gridSize;
  let points = populateGridDots(canvas, gridSize, gridSize);
  print(points);
  voronoi(canvas, points, gridSize, gridSize);
}

function populateGridDots(canvas, gridx, gridy) {
  let pointList = [];
  for(let x = 0; x < canvas.width / gridx; x ++){
    for(let y = 0; y < canvas.width / gridy; y ++){
      let rndx = Math.floor(random(0, gridx));
      let rndy = Math.floor(random(0, gridy));
      pointList.push(
        {x : x * gridx + rndx, y : y * gridx + rndy, color : Math.random() * 255 }
      );
      
      let c = color(0);
      set(x * gridx + rndx, y * gridy + rndy, c);
    }
  }
  updatePixels();
  return pointList;
}

function voronoi(canvas, points, gridx, gridy){
  //For each pixel in the canvas:
  for(let x = 0; x < canvas.width; x++){
    for(let y = 0; y < canvas.height; y++){
      let xzone = Math.floor(x / gridx);
      let yzone = Math.floor(y / gridy);
      
      //Get nearby zones:
      
      let minDistance = canvas.width * canvas.width; // The minimum distance can't go further than this.
      let prevMinDist = minDistance;
      let c = color(minDistance / (1.5 * gridx) * 255); //Remap the color to make the white part brighter
      for(let dx = -1; dx <= 1; dx++){
        for(let dy = -1; dy <= 1; dy++){
          
          let zone = getZone(xzone + dx, yzone + dy); // This gives me the zone I need to compare with.
          let point = points[zone.index]; // Gets the point.
          
          let dist = 0;
         // let xdiff = abs(point.x - x);
          let xdiff = point.x - x;
          let ydiff = point.y - y;
          //let ydiff = abs(poit.y - y);
          if(zone.wrapx){ //If you wrap around the zones, then we need to calculate out the minimum distance.
            xdiff = Math.min(point.x, x) + canvas.width - Math.max(point.x, x);
          }
          if(zone.wrapy){
            ydiff = Math.min(point.y, y) + canvas.width - Math.max(point.y, y);
          }
          //dist = xdiff + ydiff;
          dist = xdiff * xdiff + ydiff * ydiff;
          if(dist <= minDistance){
            prevMinDist = minDistance;
            minDistance = dist; 
            c = color(point.color, point.color,point.color);
          }
        }
      }
      if((prevMinDist - minDistance) < 5){
        c = color(255.0);
      }
      else{
        c = color(0.0);
      }
      
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
