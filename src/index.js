import Complex from 'complex.js';

const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

const plotSize = 20;
const horizontalNumberOfPlots = Math.floor(1000 / plotSize);
const verticalNumberOfPlots = Math.floor(500 / plotSize);
const topLeft = Complex(-2, 0.8);
const plotToComplexScale = 3 / horizontalNumberOfPlots;
const lengthOfComplexAxisInPlot = 2;
const complexScaleinPlot = plotSize / lengthOfComplexAxisInPlot;

let n, m;
for (n = 0; n < horizontalNumberOfPlots; n++) {
  for (m = 0; m < verticalNumberOfPlots; m++) {
    plot(n, m);
  }
}

function plot(n, m) {
  let its = iterations(plotToComplex(n, m));
  const startPos = complexPlotToCoordinates(n, m, its.shift);
  ctx.beginPath();
  ctx.strokeStyle = '#333';
  ctx.moveTo(startPos.x, startPos.y);
  its.forEach((i) => {
    const pos = complexPlotToCoordinates(n, m, i);
    ctx.lineTo(pos.x, pos.y);
  });
  ctx.stroke();
}

function complexPlotToCoordinates(n, m, c) {
  const topLeftOfPlot = plotToCoordinates(n, m);
  const middle = { x: topLeftOfPlot.x + (plotSize / 2), y: topLeftOfPlot.y + (plotSize / 2) }

  return { x: middle.x + (c.re * complexScaleinPlot), y: middle.y - (c.im * complexScaleinPlot) }
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
    iterations.push(z);
    z = z.pow(2).add(c);
  }

  return iterations;
}
