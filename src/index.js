import Complex from 'complex.js';

const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

const plotSize = 20;
const horizontalNumberOfPlots = Math.floor(1000 / plotSize);
const verticalNumberOfPlots = Math.floor(500 / plotSize);
const topLeft = Complex(-2, 0.8);
const plotToComplexScale = 3 / horizontalNumberOfPlots;

let n, m;
for (n = 0; n < horizontalNumberOfPlots; n++) {
  for (m = 0; m < verticalNumberOfPlots; m++) {
    plot(n, m);
  }
}

function plot(n, m) {
  const it = iterations(plotToComplex(n, m));
  ctx.fillStyle = 'rgb(0, ' + (255 - (it.length * 4)) + ', ' + (it.length * 4) + ')';
  const topLeftCoords = plotToCoordinates(n, m);
  const bottomRightCoords = plotToCoordinates(n + 1, m + 1);
  ctx.fillRect(topLeftCoords.x, topLeftCoords.y, bottomRightCoords.x, bottomRightCoords.y);
}

function plotToCoordinates(n, m) {
 return { x: n * plotSize, y: m * plotSize }
}

function plotToComplex(n, m) {
  return topLeft.add(new Complex(n * plotToComplexScale, -(m * plotToComplexScale)));
}

function iterations(c) {
  let i = 0
  let z = Complex.ZERO;
  let iterations = [];

  while (i < 40 && ((Math.pow(z.re, 2) + Math.pow(z.im, 2)) < 4)) {
    i++;
    z = z.pow(2).add(c);
    iterations.push(z);
  }

  return iterations;
}
