import Complex from 'complex.js';
import iterations from './mandlebrot-set.js';

const urlParams = new URLSearchParams(window.location.search);

const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

const plotSize = urlParams.get('plotSize') || 20;
let topLeft;
if (urlParams.get('topLeft')) {
  console.log(urlParams.get('topLeft'));
  topLeft = Complex(urlParams.get('topLeft'));
} else {
  topLeft = Complex(-2, 0.8);
}
const complexWidth = urlParams.get('width') || 2;

const horizontalNumberOfPlots = Math.floor(1000 / plotSize);
const verticalNumberOfPlots = Math.floor(500 / plotSize);
const plotToComplexScale = complexWidth / horizontalNumberOfPlots;
const lengthOfComplexAxisInPlot = 2
const complexScaleinPlot = plotSize / lengthOfComplexAxisInPlot;

let n, m;
for (n = 0; n < horizontalNumberOfPlots; n++) {
  for (m = 0; m < verticalNumberOfPlots; m++) {
    plot(n, m);
  }
}

function plot(n, m) {
  let its = iterations(plotToComplex(n, m, 40));
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
