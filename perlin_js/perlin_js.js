let noiseArray = [];
let outArray = [];
const noiseCount = 256;
let sampleStep = 0;
let sampleSum = 0;

function setup() {
  sampleStep = 1;
  createCanvas(256, 256);
  
  for(let i = 0; i < noiseCount; i++){
    noiseArray.push(Math.random());
    outArray.push(0);
  }
  
  while(sampleStep <= noiseCount){
   perlin(noiseArray,sampleStep,outArray);
    sampleStep *= 2;
  }
  //perlin(noiseArray,64,outArray);
  
  for(let i = 0; i < outArray.length; i++){
    point(i, 256 - outArray[i] / sampleSum * 256);
  }
}

function perlin(noiseArray, sampleStep, outArray){
  const sampleRatio = sampleStep / noiseArray.length;
  sampleSum += sampleRatio;
  print(sampleRatio);
  let tail = 0;
  let head = sampleStep;
  while(head <= noiseArray.length){
    let offset = 1;
    while(tail + offset <= head){
      //print(tail + offset);
      let index = (tail + offset) % noiseArray.length;
      /*
      outArray[index] += cosineInterp(
        index,
        tail,
        head,
        getItemAt(noiseArray, tail),
        getItemAt(noiseArray, head)) * sampleRatio; */
      outArray[index] += cubicInterp(
        index,
        tail,
        head,
        getItemAt(noiseArray, tail - sampleStep),
        getItemAt(noiseArray, tail),
        getItemAt(noiseArray, head),
        getItemAt(noiseArray, head + sampleStep)
      ) * sampleRatio;
       
      offset += 1;
    }
    tail = head;
    head += sampleStep;
  }
}

function interpolate(point, start, end, startval, endval){
  return ((point-start) / (end - start)) * (endval - startval) + startval;
}

function cosineInterp(point, start, end, startval, endval){
  let percentage = (point-start) / (end - start); //This gives 0~1
 
  let ft = percentage * 3.1415927;
  let f =  (1 - Math.cos(ft)) * 0.5;
  return f * (endval - startval) + startval;
}

function cubicInterp(point, start, end, startleft, startval, endval, endright){
  let percentage = (point-start) / (end - start);
  let a0, a1, a2, a3, f;
  
  f = percentage * percentage;
  
  a0 = endright - endval - startval + startleft;
  a1 = startleft - startval - a0;
  a2 = endval - startleft;
  a3 = startval;
  
  return (a0 * percentage * f + a1 * f + a2 * percentage + a3);
  
  
}

function getItemAt(noiseArray, index){
  let tempIndex = index;
  while(tempIndex < 0){
    tempIndex += noiseArray.length;
  }
  while(tempIndex >= noiseArray.length){
    tempIndex -= noiseArray.length;
  }
  return noiseArray[tempIndex];
}
